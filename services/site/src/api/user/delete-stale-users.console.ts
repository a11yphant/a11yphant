import { Command, Console } from "nestjs-console";

import { UserService } from "./user.service";

@Console()
export class DeleteStaleUsers {
  constructor(private userService: UserService) {}

  @Command({
    command: "delete:staleusers",
  })
  async deleteStaleUsers(): Promise<void> {
    await this.userService.deleteStaleUsers();
  }
}
