export interface AwsTransportStrategyOptions {
  polling: boolean;
  queueUrl: string;
  region: string;
  deleteHandled: boolean;
}
