import { Entity } from '@backstage/catalog-model';

export const ENV0_ORGANIZATION_ANNOTATION = 'env0.com/organization-id';
export const ENV0_ENVIRONMENT_ANNOTATION = 'env0.com/environment-id';
export const ENV0_TEMPLATE_ANNOTATION = 'env0.com/template-id';

export const isEnv0Available = (entity: Entity) =>
    Boolean(
        entity.metadata.annotations?.[ENV0_ORGANIZATION_ANNOTATION] ||
        entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION]
    );

