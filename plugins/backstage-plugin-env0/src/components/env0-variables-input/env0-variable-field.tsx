import {
  Select,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import InfoRounded from '@material-ui/icons/InfoRounded';
import React, { ReactElement } from 'react';
import type { Variable } from '../../api/types';

const VariableContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '3fr 11fr',
  gridColumnStart: 1,
  gap: '2em',
  alignItems: 'center',
  width: '100%',
  marginBottom: '2em',
}));

const FullWidthSelect = styled(Select)({
  width: '100%',
});

const InputAndInfoIconContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const EllipsisTypography = styled(Typography)(() => ({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

type VariableType = 'string' | 'dropdown';

type VariableInputComponentProps = {
  variable: Variable;
  onVariableUpdated: (
    updatedVariable: Variable,
    value: string,
    isEdited?: boolean,
  ) => void;
};

export const doesVariableValueMatchRegex = (variable: Variable) => {
  if (!variable.regex) {
    return true;
  }

  const regex = new RegExp(variable.regex);
  return regex.test(variable.value || '');
};

const variableInputByInputType: Record<
  VariableType,
  ({ variable, onVariableUpdated }: VariableInputComponentProps) => ReactElement
> = {
  string: ({ variable, onVariableUpdated }) => {
    const isRegexWrong = !doesVariableValueMatchRegex(variable);

    const onlyAsterisks = /^\*+$/;
    const isVariableValueSecretMask =
      variable.isSensitive && onlyAsterisks.test(variable.value || '');

    variable.value = isVariableValueSecretMask ? undefined : variable.value;

    return (
      <TextField
        fullWidth
        value={variable.value}
        placeholder={isVariableValueSecretMask ? '********' : ''}
        required={variable.isRequired}
        error={isRegexWrong}
        helperText={
          isRegexWrong ? `Value does not match regex: ${variable.regex}` : ''
        }
        onChange={(changeEvent: React.ChangeEvent<{ value: string }>) =>
          onVariableUpdated(
            variable,
            changeEvent.target.value,
            !(isVariableValueSecretMask && variable.value === undefined),
          )
        }
      />
    );
  },
  dropdown: ({ variable, onVariableUpdated }) => (
    <FullWidthSelect
      value={variable.value}
      onChange={(changeEvent: React.ChangeEvent<{ value: string }>) =>
        onVariableUpdated(variable, changeEvent.target.value)
      }
    >
      {variable.schema?.enum?.map((option, optionIndex) => (
        <option key={optionIndex} value={option}>
          {option}
        </option>
      ))}
    </FullWidthSelect>
  ),
};

const getVariableInput = (
  variable: Variable,
  onVariableUpdated: VariableInputComponentProps['onVariableUpdated'],
) => {
  return variableInputByInputType[
    variable.schema?.enum ? 'dropdown' : 'string'
  ]({
    variable,
    onVariableUpdated,
  });
};

export const Env0VariableField = ({
  variable,
  onVariableUpdated,
}: VariableInputComponentProps) => {
  return (
    <VariableContainer data-testid={`${variable.id}-variable-field`}>
      <EllipsisTypography
        noWrap
        variant="body1"
        style={{
          maxWidth: '100%',
          fontWeight: 'bold',
        }}
      >
        {variable.isSensitive && (
          <Tooltip title="Sensitive variable">
            <Warning />
          </Tooltip>
        )}
        <Tooltip title={variable.name} placement="top-start">
          <span>{variable.name}</span>
        </Tooltip>
        :
      </EllipsisTypography>
      <InputAndInfoIconContainer>
        {getVariableInput(variable, onVariableUpdated)}
        {variable.description && (
          <Tooltip title={variable.description}>
            <InfoRounded />
          </Tooltip>
        )}
      </InputAndInfoIconContainer>
    </VariableContainer>
  );
};
