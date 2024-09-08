export interface SendPasswordResetMailContext {
  email: string;
  token: string;
  displayName?: string;
}
