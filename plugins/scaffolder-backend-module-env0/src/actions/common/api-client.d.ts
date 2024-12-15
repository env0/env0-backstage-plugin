export namespace Env0Api {
  interface ConfigurationChange {
    id?: string;
    name: string;
    value?: string;
    type: 0 | 1; // 0 - TF Var, 1 - Env Var
    isSensitive?: boolean;
    isRequired?: boolean;
  }

  export namespace GetEnvironment {
    // https://docs.env0.com/reference/environments-find-by-id
    export interface Response {
      id: string;
      name: string;
      projectId: string;
      blueprintId: string;
      status: string
    }
  }

  export namespace CreateEnvironment {
    // https://docs.env0.com/reference/environments-create
    export interface Request {
      name: string;
      projectId: string;
      deployRequest: {
        blueprintId: string;
        comment?: string;
        configurationChanges?: ConfigurationChange[]
      }
    }


    export interface Response {
      id: string; // environment id
      name: string;
      projectId: string;
      organizationId: string;
    }
  }

  https://docs.env0.com/reference/environments-deploy
  export namespace RedeployEnvironment {
    export interface Request {
      id: string;
      deployRequest: {
        comment?: string;
        configurationChanges?: ConfigurationChange[]
      }
    }

    export interface Response {
      id: string; // deployment id
    }
  }
}
