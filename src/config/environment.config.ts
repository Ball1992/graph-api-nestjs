export interface EnvironmentConfig {
  clientId: string;
  tenantId: string;
  clientSecret: string;
  targetGroup: string;
  port: number;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    clientId: process.env.CLIENT_ID || '',
    tenantId: process.env.TENANT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    targetGroup: process.env.TARGET_GROUP || '',
    port: parseInt(process.env.PORT || '3000', 10),
  };
};
