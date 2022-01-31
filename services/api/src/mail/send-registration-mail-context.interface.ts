export interface SendRegistrationMailContext {
  userId: string;
  email: string;
  token: string;
  displayName?: string;
}
