import { useEffect, useState } from 'react';
import { Variable } from '../../api/types';
import { doesVariableValueMatchRegex } from '../env0-variables-input/env0-variable-field';

const validateVariables = (variables: Variable[]): string[] => {
  const errors: string[] = [];
  variables.forEach(variable => {
    if (variable.isRequired && !variable.value) {
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
  variables,
}: {
  variables: Variable[];
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setValidationErrors(validateVariables(variables));
  }, [variables]);

  return { validationErrors };
};
