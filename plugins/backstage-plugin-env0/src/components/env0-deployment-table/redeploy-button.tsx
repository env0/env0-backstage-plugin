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
  width: '50%',
});

export const RedeployButton: React.FC<{
  disabled?: boolean;
  fetchDeployments?: () => void;
}> = ({ disabled = false, fetchDeployments }) => {
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  const api = useApi<Env0Api>(env0ApiRef);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);

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

    try {
      await api.redeployEnvironment(environmentId, variables);
      setSnackbarText('env0 deployment initiated successfully ✅');
    } catch (error) {
      setSnackbarText('Failed to trigger env0 deployment ❌');
    } finally {
      setSnackBarOpen(true);
      setModalOpen(false);
      if(fetchDeployments)
        fetchDeployments();
    }
  };

  const modal = (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <StyledBox>
        <StyledCard>
          <StyledEnv0VariablesInput
            initialVariables={variables}
            onVariablesChange={setVariables}
            rawErrors={[]}
            environmentId={environmentId}
            projectId={projectId}
            templateId={templateId}
          />
          <CardActions>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleRedeploy()}
            >
              Deploy
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

  const getButtonText = () => {
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

  const buttonText = getButtonText();

  return (
    <>
      <Tooltip
        title="Trigger env0 deployment with current configured variables"
        enterDelay={1000}
      >
        <Button
          disabled={disabled || environmentError || isLoadingEnvironment}
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          {buttonText}
        </Button>
      </Tooltip>
      {modal}
      {snackbar}
    </>
  );
};
