import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Collapse,
  FormControl,
  IconButton,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useVariablesData } from '../../hooks/use-variables-data';
import { Env0Card } from '../common/env0-card';
import type { Variable } from '../../api/types';
import { Progress } from '@backstage/core-components';
import { ErrorContainer } from '../common/error-container';
import { Env0VariableField } from './env0-variable-field';

type VariableWithEditScope = Variable & {
  originalVariableScope?: string;
};

export type Env0VariablesInputProps = {
  projectId?: string;
  templateId?: string;
  environmentId?: string;
  onVariablesChange: (update: Variable[]) => void;
  rawErrors: string[];
  initialVariables: Variable[];
};

const shouldShowVariable = (variable: VariableWithEditScope) =>
  !(variable.isReadonly || variable.isOutput);

const VariableFields = ({
  variables,
  updateVariableValue,
}: {
  variables: VariableWithEditScope[];
  updateVariableValue: (
    updatedVariable: VariableWithEditScope,
    value: string,
  ) => void;
}) => {
  return (
    <>
      {variables.map(
        variable =>
          shouldShowVariable(variable) && (
            <Env0VariableField
              key={variable.id}
              variable={variable}
              onVariableUpdated={updateVariableValue}
            />
          ),
      )}
    </>
  );
};

const VariablesCollapsedGroup = ({
  title,
  variables,
  updateVariableValue,
}: {
  title: string;
  variables: VariableWithEditScope[];
  updateVariableValue: (
    updatedVariable: VariableWithEditScope,
    value: string,
  ) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Typography
        noWrap={false}
        variant="body1"
        style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: '150px',
          fontWeight: 'bold',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="expand"
      >
        {title}
        <IconButton>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Typography>

      <Collapse in={isOpen}>
        <VariableFields
          variables={variables}
          updateVariableValue={updateVariableValue}
        />
      </Collapse>
    </>
  );
};

export const Env0VariablesInput = ({
  projectId,
  templateId,
  environmentId,
  onVariablesChange,
  rawErrors,
  initialVariables,
}: Env0VariablesInputProps) => {
  const [variables, setVariables] =
    useState<VariableWithEditScope[]>(initialVariables);

  const [isInitialized, setIsInitialized] = useState(false);

  const onVariablesChangeCallback = useCallback(
    (newVariables: VariableWithEditScope[]) => {
      onVariablesChange(newVariables);
      setVariables(newVariables);
    },
    [onVariablesChange],
  );

  const updateVariableValue = (
    updatedVariable: VariableWithEditScope,
    value: string,
  ) => {
    const newVariables = [...variables];
    const updatedVariableIndex = newVariables.findIndex(
      variable => variable.id === updatedVariable.id,
    );
    newVariables[updatedVariableIndex] = {
      ...updatedVariable,
      originalVariableScope:
        updatedVariable.originalVariableScope || updatedVariable.scope,
      scope: 'ENVIRONMENT',
      value,
    };
    onVariablesChangeCallback(newVariables);
  };

  const {
    loading,
    error,
    value: { variables: variablesData, variablesSets: variablesSetsData } = {},
  } = useVariablesData(templateId, projectId, environmentId);

  useEffect(() => {
    if (variablesData && !isInitialized) {
      onVariablesChangeCallback(variablesData);
      setIsInitialized(true);
    }
  }, [isInitialized, onVariablesChangeCallback, variablesData]);

  const groupedVariablesByVariableSets = useMemo(() => {
    if (!variables || !variablesSetsData) return {};

    return variables.reduce((acc, variable) => {
      const wasEditedFromSetScope =
        variable.overwrites?.scope === 'SET' ||
        variable.originalVariableScope === 'SET';
      if (variable.scope === 'SET' || wasEditedFromSetScope) {
        const foundSet = variablesSetsData.find(
          set =>
            set.id === variable.scopeId ||
            set.id === variable.overwrites?.scopeId,
        );

        if (foundSet) {
          acc[foundSet.name] = acc[foundSet.name] || [];
          acc[foundSet.name].push(variable);
        }
      } else {
        acc.defaultGroup = acc.defaultGroup || [];
        acc.defaultGroup.push(variable);
      }
      return acc;
    }, {} as Record<string, VariableWithEditScope[]>);
  }, [variables, variablesSetsData]);

  const areThereAnyVariablesToShowInGroup = (
    group: VariableWithEditScope[],
  ) => {
    return group.some(variable => shouldShowVariable(variable));
  };

  if (loading) {
    return (
      <Env0Card title="env0">
        <Progress />
      </Env0Card>
    );
  }

  if (error) {
    return (
      <Env0Card title="env0">
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }

  return (
    <FormControl margin="normal" error={Boolean(rawErrors?.length)} fullWidth>
      <VariableFields
        variables={groupedVariablesByVariableSets.defaultGroup || []}
        updateVariableValue={updateVariableValue}
      />
      {Object.entries(groupedVariablesByVariableSets).map(
        ([variableSetName, groupVariables]) =>
          variableSetName !== 'defaultGroup' &&
          areThereAnyVariablesToShowInGroup(groupVariables) && (
            <VariablesCollapsedGroup
              key={variableSetName}
              title={variableSetName}
              variables={groupVariables}
              updateVariableValue={updateVariableValue}
            />
          ),
      )}
    </FormControl>
  );
};
