import React, { useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../../api';
import Button from '@material-ui/core/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

export const RedeployButton: React.FC<{ disabled?: boolean }> = ({
  disabled = false,
}) => {
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  const api = useApi<Env0Api>(env0ApiRef);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleRedeploy = async (environmentId?: string) => {
    if (!environmentId) {
      return;
    }

    try {
      setIsLoading(true);
      await api.redeployEnvironment(environmentId);
      setSnackbarText('env0 deployment initiated successfully ✅');
    } catch (error) {
      console.error('env0 deployment failed:', error);
      setSnackbarText('Failed to trigger env0 deployment ❌');
    } finally {
      setOpen(true);
      setIsLoading(false);
    }
  };

  const buttonText = !isLoading ? (
    'Deploy'
  ) : (
    <span>
      <CircularProgress size="1em" /> Loading...
    </span>
  );

  return (
    <>
      <Tooltip
        title={'Trigger env0 deployment with current configured variables'}
        enterDelay={1000}
      >
        <Button
          disabled={disabled || isLoading}
          variant="contained"
          color="primary"
          onClick={() => handleRedeploy(environmentId)}
        >
          {buttonText}
        </Button>
      </Tooltip>

      <Snackbar
        open={open}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={snackbarText}
        autoHideDuration={3000}
        action={
          <Button color="inherit" size="small" onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      />
    </>
  );
};
