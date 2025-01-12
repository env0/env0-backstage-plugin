import React, { useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../../api';
import Button from '@material-ui/core/Button';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { styled } from '@material-ui/core';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { Env0VariablesInput } from '../env0-variables-input';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import useAsync from 'react-use/lib/useAsync';
import type { Variable } from '../../api/types';
import Alert from '@mui/material/Alert';

const StyledCard = styled(Card)({
  padding: '0 1em',
});
const StyledEnv0VariablesInput = styled(Env0VariablesInput)({
  boxShadow: 'none',
});

const StyledBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
});

export const RedeployButton: React.FC<{
  disabled?: boolean;
  afterDeploy?: () => void;
}> = ({ disabled = false, afterDeploy }) => {
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  const api = useApi<Env0Api>(env0ApiRef);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [isRedeploying, setIsRedeploying] = useState<boolean>(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasAttemptedDeploy, setHasAttemptedDeploy] = useState(false);

  const {
    value,
    loading: isLoadingEnvironment,
    error: environmentError,
  } = useAsync(async () => {
    if (!environmentId) {
      throw new Error('No environmentId found on entity');
    }

    const {
      projectId,
      latestDeploymentLog: { blueprintId: templateId },
    } = await api.getEnvironmentById(environmentId);

    return {
      projectId,
      templateId,
    };
  });
  const { projectId, templateId } = value || {};

  const handleModalClose = () => {
    setModalOpen(false);
    setHasAttemptedDeploy(false);
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const handleRedeploy = async () => {
    if (!environmentId) {
      return;
    }

    setHasAttemptedDeploy(true);

    if (validationErrors.length > 0) {
      return;
    }

    try {
      setIsRedeploying(true);
      await api.redeployEnvironment(environmentId, variables);
      setSnackbarText('env0 deployment initiated successfully ✅');
    } catch (error) {
      setSnackbarText('Failed to trigger env0 deployment ❌');
    } finally {
      setSnackBarOpen(true);
      handleModalClose();
      setIsRedeploying(false);
      afterDeploy?.();
    }
  };

  const deployButtonText = isRedeploying ? (
    <span>
      <CircularProgress size="1em" /> Loading...
    </span>
  ) : (
    'Deploy'
  );

  const modal = (
    <Modal
      data-testid="redeploy-modal"
      open={modalOpen}
      onClose={handleModalClose}
    >
      <StyledBox>
        <StyledCard>
          {validationErrors.length > 0 && hasAttemptedDeploy && (
            <Alert
              data-testid="redeploy-validation-errors"
              severity="error"
              elevation={6}
              variant="filled"
            >
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
          <StyledEnv0VariablesInput
            onVariablesFormDataChange={setVariables}
            editRawErrors={setValidationErrors}
            environmentId={environmentId}
            projectId={projectId}
            templateId={templateId}
          />
          <CardActions>
            <Button
              data-testid="redeploy-cancel-button"
              color="secondary"
              variant="contained"
              onClick={() => handleModalClose()}
            >
              Cancel
            </Button>
            <Button
              data-testid="redeploy-run-button"
              color="primary"
              variant="contained"
              onClick={() => handleRedeploy()}
              disabled={isRedeploying}
            >
              {deployButtonText}
            </Button>
          </CardActions>
        </StyledCard>
      </StyledBox>
    </Modal>
  );

  const snackbar = (
    <Snackbar
      open={snackBarOpen}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      message={snackbarText}
      autoHideDuration={3000}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={() => setSnackBarOpen(false)}
        >
          Close
        </Button>
      }
    />
  );

  const getRedeployModalButtonText = () => {
    if (environmentError) {
      return (
        <Tooltip title={environmentError.message}>
          <span>Error</span>
        </Tooltip>
      );
    }

    if (isLoadingEnvironment) {
      return (
        <span>
          <CircularProgress size="1em" /> Loading...
        </span>
      );
    }

    return 'Deploy';
  };

  const deployOpenModalButtonText = getRedeployModalButtonText();

  return (
    <>
      <Tooltip
        title="Trigger env0 deployment with current configured variables"
        enterDelay={1000}
      >
        <Button
          data-testid="redeploy-button"
          disabled={disabled || environmentError || isLoadingEnvironment}
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          {deployOpenModalButtonText}
        </Button>
      </Tooltip>
      {modal}
      {snackbar}
    </>
  );
};
