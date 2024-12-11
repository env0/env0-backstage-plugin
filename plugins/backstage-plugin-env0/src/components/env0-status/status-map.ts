import {
  DeploymentStatus,
  DeploymentStepStatus,
  EnvironmentDriftStatus,
  EnvironmentStatus,
} from '../../api/types';

interface StatusProperties {
  bgColor: string;
  color: string;
  text: string;
}

type keyInDeploymentStepStatus = {
  [key in DeploymentStepStatus]: StatusProperties;
};
type keyInEnvironmentStatus = {
  [key in EnvironmentStatus]: StatusProperties;
};
type keyInDeploymentStatuses = {
  [key in DeploymentStatus]: StatusProperties;
};
type keyInModuleTestStatuses = { [key in 'CREATING']: StatusProperties };
type keyInDriftDetectionStatuses = {
  [key in EnvironmentDriftStatus]: StatusProperties;
};

const colors = {
  lightRed: '#FFECF0',
  red: '#DB3131',
  plainGray: '#F3F5F7',
  darkGray: '#234D70',
  lightGreen: '#E6FFF9',
  secondaryGreen: '#00AC86',
  lightPurple: '#F3F3FF',
  primaryBlue: '#3636D8',
  errorRed: '#FF3939',
  alertYellow: '#fdf3cd',
  alertYellowText: '#866709',
};

export const statusToTextAndColor: keyInDeploymentStepStatus &
  keyInEnvironmentStatus &
  keyInDeploymentStatuses &
  keyInModuleTestStatuses &
  keyInDriftDetectionStatuses = {
  FAIL: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Failed',
  },
  IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'In Progress...',
  },
  SUCCESS: {
    bgColor: colors.lightGreen,
    color: colors.secondaryGreen,
    text: 'Success',
  },
  WAITING_FOR_USER: {
    bgColor: colors.lightPurple,
    color: colors.primaryBlue,
    text: 'Waiting for approval',
  },
  NOT_STARTED: {
    bgColor: '',
    color: '',
    text: '',
  },
  CANCELLED: {
    bgColor: colors.errorRed,
    color: '#fff',
    text: 'Canceled',
  },
  SKIPPED: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Skipped',
  },
  WARNING: {
    bgColor: colors.alertYellow,
    color: colors.alertYellowText,
    text: 'Warning',
  },
  ACTIVE: {
    bgColor: colors.lightGreen,
    color: colors.secondaryGreen,
    text: 'Active',
  },
  CREATED: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Never Deployed',
  },
  DEPLOY_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Deploy In Progress',
  },
  FAILED: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Failed',
  },
  TIMEOUT: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Timeout',
  },
  INACTIVE: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Inactive',
  },
  DESTROY_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Destroy In Progress',
  },
  FAILURE: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Failed',
  },
  INTERNAL_FAILURE: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Internal Failure',
  },
  ABORTING: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Aborting',
  },
  ABORTED: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Aborted',
  },
  QUEUED: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Queued',
  },
  CREATING: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Creating...',
  },
  PR_PLAN_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'PR Plan In Progress',
  },
  REMOTE_PLAN_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Remote Plan In Progress',
  },
  DRIFT_DETECTION_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Drift Detection In Progress',
  },
  TASK_IN_PROGRESS: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Task In Progress',
  },
  NEVER_DEPLOYED: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Never Deployed',
  },
  DRIFTED: {
    bgColor: colors.alertYellow,
    color: colors.alertYellowText,
    text: 'Drifted',
  },
  ERROR: {
    bgColor: colors.lightRed,
    color: colors.red,
    text: 'Error',
  },
  OK: {
    bgColor: colors.lightGreen,
    color: colors.secondaryGreen,
    text: 'OK',
  },
  NEVER_RUN: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Never Run',
  },
  DISABLED: {
    bgColor: colors.plainGray,
    color: colors.darkGray,
    text: 'Disabled',
  },
};
