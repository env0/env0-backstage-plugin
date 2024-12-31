import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0ProjectSelector } from './env0-project-selector';
import { Env0Api, env0ApiRef } from '../../api';
import { Organization, Project, Template } from '../../api/types';
import { defaultEnv0Mocks } from '../common/test-handlers.utils';

const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
  },
  {
    id: 'org-2',
  },
];

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Test Project 1',
    organizationId: 'org-1',
    isArchived: false,
  },
  {
    id: 'proj-2',
    name: 'Test Project 2',
    organizationId: 'org-2',
    isArchived: false,
  },
];

const mockTemplate: Partial<Template> = {
  id: 'template-1',
  name: 'Test Template',
  projectIds: ['proj-1'],
};

const getOrganizationsMock = jest.fn();
const getProjectsByOrganizationIdMock = jest.fn();
const getTemplateByIdMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  getOrganizations: getOrganizationsMock,
  getProjectsByOrganizationId: getProjectsByOrganizationIdMock,
  getTemplateById: getTemplateByIdMock,
};

describe('Env0ProjectSelector', () => {
  const defaultProps = {
    onChange: jest.fn(),
    schema: { title: 'Test Project Selector' },
    rawErrors: [],
    required: false,
    formData: undefined,
    formContext: {},
    uiSchema: {},
  } as any;

  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <Env0ProjectSelector {...defaultProps} {...props} />
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getOrganizationsMock.mockResolvedValue(mockOrganizations);
    getProjectsByOrganizationIdMock.mockImplementation(orgId =>
      Promise.resolve(mockProjects.filter(p => p.organizationId === orgId)),
    );
    getTemplateByIdMock.mockResolvedValue(mockTemplate);
  });

  it('is disabled when no template is selected', async () => {
    await renderComponent();

    const input = await screen.findByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('renders loading state while fetching data', async () => {
    getOrganizationsMock.mockImplementation(() => new Promise(() => {}));

    await renderComponent({
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders error popup when API calls fail', async () => {
    const errorMessage = 'Test error';
    getOrganizationsMock.mockRejectedValue(new Error(errorMessage));

    await renderComponent({
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    expect(await screen.findByText(/Test error/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to load templates or projects from env0/),
    ).toBeInTheDocument();
  });

  it('loads projects filtered by template from formContext', async () => {
    await renderComponent({
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    expect(await screen.findByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('loads projects filtered by template from uiSchema', async () => {
    await renderComponent({
      uiSchema: { 'ui:options': { env0TemplateId: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    expect(await screen.findByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('prioritizes formContext template over uiSchema template', async () => {
    const formContextTemplate = {
      ...mockTemplate,
      id: 'template-2',
      projectIds: ['proj-2'],
    };
    getTemplateByIdMock.mockImplementation(id =>
      Promise.resolve(id === 'template-2' ? formContextTemplate : mockTemplate),
    );

    await renderComponent({
      formContext: { formData: { env0_template_id: 'template-2' } },
      uiSchema: { 'ui:options': { env0TemplateId: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    expect(await screen.findByText('Test Project 2')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 1')).not.toBeInTheDocument();
  });

  it('calls onChange with project id when project is selected', async () => {
    const onChange = jest.fn();
    await renderComponent({
      onChange,
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);
    const option = await screen.findByText('Test Project 1');
    await userEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('proj-1');
  });

  it('displays selected project when formData is provided', async () => {
    await renderComponent({
      formData: 'proj-1',
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    await waitFor(() => {
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Test Project 1');
    });
  });

  it('shows required indicator when required prop is true', async () => {
    await renderComponent({
      required: true,
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    const input = await screen.findByRole('combobox');
    expect(input).toBeRequired();
  });

  it('calls onChange with undefined when selection is cleared', async () => {
    const onChange = jest.fn();
    await renderComponent({
      onChange,
      formData: 'proj-1',
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    const clearButton = await screen.findByTitle('Clear');
    await userEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('fetches template and organizations data', async () => {
    await renderComponent({
      formContext: { formData: { env0_template_id: 'template-1' } },
    });

    await waitFor(() => {
      expect(getOrganizationsMock).toHaveBeenCalled();
      expect(getTemplateByIdMock).toHaveBeenCalledWith('template-1');
      expect(getProjectsByOrganizationIdMock).toHaveBeenCalledWith('org-1');
      expect(getProjectsByOrganizationIdMock).toHaveBeenCalledWith('org-2');
    });
  });
});
