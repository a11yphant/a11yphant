import { Injectable, Logger } from "@nestjs/common";
import { readdir as readdirCallback } from "fs";
import { join, resolve } from "path";
import { promisify } from "util";

import { PrismaService } from "../prisma/prisma.service";
import { Challenge, Hint, Level, Requirement, Resource } from "./challenge.interface";
import { Rule } from "./rule.interface";
import { YamlReaderService } from "./yaml-reader.service";

const readdir = promisify(readdirCallback);

@Injectable()
export class ImportService {
  constructor(private logger: Logger, private prisma: PrismaService, private ymlReader: YamlReaderService) {}

  public async importAllFromFolder(folder: string): Promise<void> {
    const path = resolve(__dirname, folder);

    this.logger.log(`Importing yml files from ${path}`, ImportService.name);

    const fileNames = await readdir(path);

    const ruleImportPromises = fileNames
      .filter((file) => file.endsWith(".yml") && file.startsWith("rule-"))
      .map(async (file) => {
        this.logger.log(`Importing file: ${file}`, ImportService.name);

        const filePath = join(path, file);
        const content = await this.ymlReader.readFile<Rule>(filePath, "rule");

        await this.upsertRule(content);
      });

    await Promise.all(ruleImportPromises);

    this.logger.log(`Imported ${ruleImportPromises.length} rules`, ImportService.name);

    const challengeImportPromises = fileNames
      .filter((file) => file.endsWith(".yml") && file.startsWith("challenge-"))
      .map(async (file) => {
        this.logger.log(`Importing file: ${file}`, ImportService.name);

        const filePath = join(path, file);
        const content = await this.ymlReader.readFile<Challenge>(filePath, "challenge");

        await this.importChallenge(content);
      });

    await Promise.all(challengeImportPromises);

    this.logger.log(`Imported ${challengeImportPromises.length} challenges`, ImportService.name);
  }

  public async upsertRule(rule: Rule): Promise<void> {
    await this.prisma.rule.upsert({
      where: { id: rule.id },
      create: {
        id: rule.id,
        key: rule.key,
        title: rule.title,
        shortDescription: rule.shortDescription,
        additionalDescription: rule.additionalDescription,
      },
      update: {
        key: rule.key,
        title: rule.title,
        shortDescription: rule.shortDescription,
        additionalDescription: rule.additionalDescription,
      },
    });
  }

  public async importChallenge(challenge: Challenge): Promise<void> {
    await this.upsertChallenge(challenge);

    await this.upsertLevelsForChallenge(challenge.levels, challenge.id);

    for (const level of challenge.levels) {
      await this.upsertRequirementsForLevel(level.requirements, level.id);
      await this.upsertResourcesForLevel(level.resources, level.id);
      await this.upsertHintsForLevel(level.hints, level.id);
    }
  }

  private async upsertChallenge(challenge: Challenge): Promise<void> {
    await this.prisma.challenge.upsert({
      where: { id: challenge.id },
      create: {
        id: challenge.id,
        name: challenge.name,
        slug: challenge.slug,
        difficulty: this.mapDifficulty(challenge.difficulty),
      },
      update: {
        name: challenge.name,
        slug: challenge.slug,
      },
    });
  }

  private mapDifficulty(difficulty: string): number {
    const difficultyMap = {
      easy: 0,
      medium: 1,
      hard: 2,
    };
    return difficultyMap[difficulty];
  }

  private async upsertLevelsForChallenge(levels: Level[], challengeId: string): Promise<void> {
    await Promise.all(
      levels.map(async (level) => {
        await this.prisma.level.upsert({
          where: { id: level.id },
          create: {
            id: level.id,
            order: level.order,
            tldr: level.tldr,
            instructions: level.instructions,
            challengeId,
            html: level.code?.html,
            css: level.code?.css,
            js: level.code?.js,
          },
          update: {
            tldr: level.tldr,
            order: level.order,
            instructions: level.instructions,
            challengeId,
            html: level.code?.html,
            css: level.code?.css,
            js: level.code?.js,
          },
        });
      }),
    );
  }

  private async upsertRequirementsForLevel(requirements: Requirement[], levelId: string): Promise<void> {
    await Promise.all(
      requirements.map(async (requirement) => {
        await this.prisma.requirement.upsert({
          where: { id: requirement.id },
          create: {
            id: requirement.id,
            title: requirement.title,
            levelId,
          },
          update: { title: requirement.title, levelId },
        });

        await Promise.all(
          requirement.rules?.map(async (ruleKey) => {
            await this.prisma.requirement.update({
              where: { id: requirement.id },
              data: {
                rules: {
                  connect: {
                    key: ruleKey,
                  },
                },
              },
            });
          }),
        );
      }),
    );
  }

  private async upsertResourcesForLevel(resources: Resource[], levelId: string): Promise<void> {
    await Promise.all(
      resources.map(async (resource) => {
        await this.prisma.resource.upsert({
          where: { id: resource.id },
          create: {
            id: resource.id,
            title: resource.title,
            link: resource.link,
            levelId,
          },
          update: {
            title: resource.title,
            link: resource.link,
            levelId,
          },
        });
      }),
    );
  }

  private async upsertHintsForLevel(hints: Hint[], levelId: string): Promise<void> {
    await Promise.all(
      hints.map(async (hint) => {
        await this.prisma.hint.upsert({
          where: { id: hint.id },
          create: {
            id: hint.id,
            content: hint.content,
            levelId,
          },
          update: { content: hint.content, levelId },
        });
      }),
    );
  }
}
