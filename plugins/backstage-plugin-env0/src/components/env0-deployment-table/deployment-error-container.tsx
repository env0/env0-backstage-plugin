import Alert from '@material-ui/lab/Alert';
import React from 'react';
import Ansi from 'ansi-to-react';

export const DeploymentErrorContainer = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  return (
    <Alert severity="error">
      <p>Deployment failed with error:</p>
      <p>
        <pre>
          <Ansi linkify={false}>{errorMessage}</Ansi>
        </pre>
      </p>
    </Alert>
  );
};
