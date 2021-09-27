export class User {
  constructor(properties: { id: string; displayName: string; authId?: string; authProvider?: string }) {
    this.id = properties.id;
    this.displayName = properties.displayName;
    this.authProvider = properties.authProvider || "anonymous";
    this.authId = properties.authId;
  }
  id: string;

  displayName: string;

  authProvider: string;

  authId?: string;
}
