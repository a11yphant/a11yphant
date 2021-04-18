import { Command, Console } from "nestjs-console";

@Console()
export class ImportChallenges {
  @Command({
    command: "import:challenges",
    description: "Imports challenges from the filesystem into the database",
  })
  importChallenges(): void {
    console.log("hi");
  }
}
