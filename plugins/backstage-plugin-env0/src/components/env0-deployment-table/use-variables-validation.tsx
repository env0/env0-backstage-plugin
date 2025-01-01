import { useEffect, useState } from 'react';
import { Variable } from '../../api/types';
import { doesVariableValueMatchRegex } from '../env0-variables-input/env0-variable-field';
import { VariableWithEditScope } from '../env0-variables-input';
import uniqBy from 'lodash/uniqBy';

const validateVariables = (variables: Variable[]): string[] => {
  const errors: string[] = [];
  variables.forEach(variable => {
    if (variable.isRequired && !variable.value && !variable.isSensitive) {
      errors.push(`Variable "${variable.name}" is required`);
    }
    if (!doesVariableValueMatchRegex(variable)) {
      errors.push(
        `Value for variable "${variable.name}" does not match regex: ${variable.regex}`,
      );
    }
  });
  return errors;
};

export const useVariablesValidation = ({
  editedVariables,
  variablesData,
}: {
  editedVariables: VariableWithEditScope[];
  variablesData?: Variable[];
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (variablesData) {
      const distinctVariables = uniqBy(
        [...editedVariables, ...variablesData],
        'id',
      );
      setValidationErrors(validateVariables(distinctVariables));
    }
  }, [editedVariables, variablesData]);

  return { validationErrors };
};
