import React, { useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  ENV0_ENVIRONMENT_ANNOTATION,
  ENV0_PROJECT_ANNOTATION,
  ENV0_TEMPLATE_ANNOTATION,
} from '../common/is-plugin-available';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../../api';
import Button from '@material-ui/core/Button';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { styled } from '@material-ui/core';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Env0VariablesInput } from '../env0-variables-input';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';

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
  const projectId = entity.metadata.annotations?.[ENV0_PROJECT_ANNOTATION];
  const templateId = entity.metadata.annotations?.[ENV0_TEMPLATE_ANNOTATION];
  const api = useApi<Env0Api>(env0ApiRef);
  const [snackbarText, setSnackbarText] = useState<string>('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
      await api.redeployEnvironment(environmentId);
      setSnackbarText('env0 deployment initiated successfully ✅');
    } catch (error) {
      console.error('env0 deployment failed:', error);
      setSnackbarText('Failed to trigger env0 deployment ❌');
    } finally {
      setSnackBarOpen(true);
      setModalOpen(false);
      !fetchDeployments && fetchDeployments();
    }
  };

  const modal = (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <StyledBox>
        <StyledCard>
          <StyledEnv0VariablesInput
            initialVariables={[]}
            onVariablesChange={() => {}}
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

  return (
    <>
      <Tooltip
        title="Trigger env0 deployment with current configured variables"
        enterDelay={1000}
      >
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Deploy
        </Button>
      </Tooltip>
      {modal}
      {snackbar}
    </>
  );
};
