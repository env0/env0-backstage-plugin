import { Variable } from '../../api/types';

enum SecretReferencePrefixes {
  AWS = 'ssm',
  GCP = 'gcp',
  AZURE = 'azure',
  VAULT = 'vault',
  OCI = 'oci',
}
const SECRET_REF_POSTFIX = '}';

const getFullPrefix = (secretType: string) => `\${${secretType}:`;
const startsWithPrefix = (reference: string | undefined, prefix: string) =>
  reference?.startsWith(getFullPrefix(prefix));

export const isSecretReference = (variable: Variable) =>
  Object.values(SecretReferencePrefixes).some(
    prefix =>
      startsWithPrefix(variable.value, prefix) &&
      variable.value?.endsWith(SECRET_REF_POSTFIX),
  );
