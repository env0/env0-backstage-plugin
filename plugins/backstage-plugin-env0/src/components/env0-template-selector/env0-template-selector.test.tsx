import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0TemplateSelector } from './env0-template-selector';
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

const mockTemplates: Partial<Template>[] = [
  {
    id: 'template-1',
    name: 'Test Template 1',
    organizationId: 'org-1',
    projectIds: ['proj-1'],
  },
  {
    id: 'template-2',
    name: 'Test Template 2',
    organizationId: 'org-2',
    projectIds: ['proj-2'],
  },
];

const getOrganizationsMock = jest.fn();
const getProjectsByOrganizationIdMock = jest.fn();
const getTemplatesByProjectIdMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  getOrganizations: getOrganizationsMock,
  getProjectsByOrganizationId: getProjectsByOrganizationIdMock,
  getTemplatesByProjectId: getTemplatesByProjectIdMock,
};

describe('Env0TemplateSelector', () => {
  const defaultProps = {
    onChange: jest.fn(),
    schema: { title: 'Test Template Selector' },
    rawErrors: [],
    required: false,
    formData: undefined,
  } as any;

  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <Env0TemplateSelector {...defaultProps} {...props} />
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getOrganizationsMock.mockResolvedValue(mockOrganizations);
    getProjectsByOrganizationIdMock.mockImplementation(orgId =>
      Promise.resolve(mockProjects.filter(p => p.organizationId === orgId)),
    );
    getTemplatesByProjectIdMock.mockImplementation(projId =>
      Promise.resolve(
        mockTemplates.filter(t => t.projectIds?.includes(projId)),
      ),
    );
  });

  it('renders loading state while fetching data', async () => {
    getOrganizationsMock.mockImplementation(() => new Promise(() => {}));

    await renderComponent();

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders error popup when API calls fail', async () => {
    const errorMessage = 'Test error';
    getOrganizationsMock.mockRejectedValue(new Error(errorMessage));

    await renderComponent();

    expect(await screen.findByText(/Test error/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to load templates from env0/),
    ).toBeInTheDocument();
  });

  it('loads and displays templates without duplicates', async () => {
    await renderComponent();

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    // Should show both unique templates
    expect(await screen.findByText('Test Template 1')).toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();

    // Check that duplicate template is not shown
    const templateOptions = await screen.findAllByRole('option');
    expect(templateOptions).toHaveLength(2);
  });

  it('calls onChange with template id when template is selected', async () => {
    const onChange = jest.fn();
    await renderComponent({ onChange });

    const input = await screen.findByRole('combobox');
    await userEvent.click(input);

    const option = await screen.findByText('Test Template 1');
    await userEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('template-1');
  });

  it('displays selected template when formData is provided', async () => {
    await renderComponent({ formData: 'template-2' });

    await waitFor(() => {
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Test Template 2');
    });
  });

  it('shows required indicator when required prop is true', async () => {
    await renderComponent({ required: true });

    const input = await screen.findByRole('combobox');
    expect(input).toBeRequired();
  });

  it('fetches data from all organizations and projects', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(getOrganizationsMock).toHaveBeenCalled();
      expect(getProjectsByOrganizationIdMock).toHaveBeenCalledWith('org-1');
      expect(getProjectsByOrganizationIdMock).toHaveBeenCalledWith('org-2');
      expect(getTemplatesByProjectIdMock).toHaveBeenCalledWith('proj-1');
      expect(getTemplatesByProjectIdMock).toHaveBeenCalledWith('proj-2');
    });
  });

  it('calls onChange with undefined when selection is cleared', async () => {
    const onChange = jest.fn();
    await renderComponent({ onChange, formData: 'template-1' });

    const clearButton = await screen.findByTitle('Clear');
    await userEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
