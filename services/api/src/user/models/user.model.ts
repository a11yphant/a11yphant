export class User {
  constructor(properties: { id: string; authId?: string; authProvider?: string }) {
    this.id = properties.id;
    this.authProvider = properties.authProvider || "anonymous";
    this.authId = properties.authId;
  }
  id: string;

  authProvider: string;

  authId?: string;
}
