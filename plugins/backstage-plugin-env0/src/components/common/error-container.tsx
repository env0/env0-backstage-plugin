import React from 'react';
import {NotFoundError, NotAllowedError, ServiceUnavailableError} from '@backstage/errors';
import {Alert} from '@material-ui/lab';

export const ErrorContainer = ({error}: { error: Error }) => {
    if (error.constructor === NotAllowedError) {
        return <Alert severity="error">
            You are not authorized to view this information.
        </Alert>
    } else if (error.constructor === NotFoundError) {
        return <Alert severity="info">
            No information found for this entity.
        </Alert>
    } else if (error.constructor === NotAllowedError) {
        return <Alert severity="info">
            You are unauthorized to view this information.
        </Alert>
    }  else if (error.constructor === ServiceUnavailableError) {
        return <Alert severity="info">
            env0 is currently unavailable
        </Alert>
    } else {
        return <Alert severity="error">
            Error encountered while fetching information. {error.message}
        </Alert>
    }
}
