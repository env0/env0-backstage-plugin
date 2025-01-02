export namespace Env0Api {
  interface ConfigurationChange {
    id: string;
    name: string;
    value?: string;

    [key: string]: any;
  }

  interface TTLRequest {
    type: 'INFINITE' | 'HOURS' | 'DATE';
    value?: string | Date;
  }

  export namespace GetEnvironment {
    // https://docs.env0.com/reference/environments-find-by-id
    export interface Response {
      id: string;
      name: string;
      projectId: string;
      blueprintId: string;
      status: string;
    }
  }

  export namespace CreateEnvironment {
    // https://docs.env0.com/reference/environments-create
    export interface Request {
      name: string;
      projectId: string;
      configurationChanges?: ConfigurationChange[];
      ttl?: TTLRequest;
      requiresApproval?: boolean;
      continuousDeployment?: boolean;
      pullRequestPlanDeployments?: boolean;
      deployRequest: {
        comment?: string;
        blueprintId: string;
      };
    }

    export interface Response {
      id: string; // environment id
      name: string;
      projectId: string;
      organizationId: string;
    }
  }

  // https://docs.env0.com/reference/environments-deploy
  export namespace RedeployEnvironment {
    export interface Request {
      id: string;
      deployRequest: {
        comment?: string;
        configurationChanges?: ConfigurationChange[];
        userRequiresApproval?: boolean;
        ttl?: TTLRequest;
      };
    }

    export interface Response {
      id: string; // deployment id
    }
  }
}
