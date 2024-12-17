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
  gridTemplateColumns: '1fr 5fr',
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

type VariableType = 'string' | 'dropdown';

type VariableInputComponentProps = {
  variable: Variable;
  onVariableUpdated: (updatedVariable: Variable, value: string) => void;
};

const variableInputByInputType: Record<
  VariableType,
  ({ variable, onVariableUpdated }: VariableInputComponentProps) => ReactElement
> = {
  string: ({ variable, onVariableUpdated }) => (
    <TextField
      label="Value"
      fullWidth
      value={variable.value}
      required={variable.isRequired}
      onChange={(changeEvent: React.ChangeEvent<{ value: string }>) =>
        onVariableUpdated(variable, changeEvent.target.value)
      }
    />
  ),
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
    <VariableContainer>
      <Typography
        noWrap={false}
        variant="body1"
        style={{
          display: 'flex',
          minWidth: '150px',
          fontWeight: 'bold',
        }}
      >
        {variable.isSensitive && (
          <Tooltip title="Senstive variable">
            <Warning />
          </Tooltip>
        )}
        {variable.name}:
      </Typography>
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
