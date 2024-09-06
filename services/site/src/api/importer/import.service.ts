import { Injectable, Logger } from "@nestjs/common";
import { readdir as readdirCallback } from "fs";
import { join, resolve } from "path";
import { promisify } from "util";

import { PrismaService } from "../prisma/prisma.service";
import { Challenge, CodeLevel, Hint, Level, QuizLevel, Requirement, Task } from "./challenge.interface";
import { Rule } from "./rule.interface";
import { YamlReaderService } from "./yaml-reader.service";

const readdir = promisify(readdirCallback);

@Injectable()
export class ImportService {
  constructor(
    private logger: Logger,
    private prisma: PrismaService,
    private ymlReader: YamlReaderService,
  ) {}

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

    const challenges = await Promise.all(
      fileNames
        .filter((file) => file.endsWith(".yml") && file.startsWith("challenge-"))
        .map(async (file) => {
          this.logger.log(`Importing file: ${file}`, ImportService.name);

          const filePath = join(path, file);

          return await this.ymlReader.readFile<Challenge>(filePath, "challenge");
        }),
    );

    await Promise.all(challenges.map((challenge) => this.importChallenge(challenge)));

    this.logger.log(`Imported ${challenges.length} challenges`, ImportService.name);

    const challengeIds = challenges.map((challenge) => challenge.id);

    const { count } = await this.prisma.challenge.deleteMany({
      where: {
        id: {
          notIn: challengeIds,
        },
      },
    });

    this.logger.log(`Deleted ${count} challenges`, ImportService.name);
  }

  public async upsertRule(rule: Rule): Promise<void> {
    await this.prisma.rule.upsert({
      where: { id: rule.id },
      create: {
        id: rule.id,
        key: rule.key,
      },
      update: {
        key: rule.key,
      },
    });
  }

  public async importChallenge(challenge: Challenge): Promise<void> {
    await this.upsertChallenge(challenge);

    await this.upsertLevelsForChallenge(challenge.levels, challenge.id);

    for (const level of challenge.levels) {
      if (level.type === "code") {
        await this.upsertRequirementsForLevel(level.requirements, level.id);
        await this.upsertTasksForLevel(level.tasks, level.id);

        for (const task of level.tasks) {
          await this.upsertHintsForTask(task.hints, task.id);
        }
      }

      if (level.type === "quiz") {
        await this.upsertAnswerOptionsForQuizLevel(level);
      }
    }

    const quizLevelIds = challenge.levels.filter((level) => level.type === "quiz").map((level) => level.id);

    await this.prisma.quizLevel.deleteMany({
      where: {
        id: { notIn: quizLevelIds },
        challengeId: challenge.id,
      },
    });
  }

  private async upsertAnswerOptionsForQuizLevel(level: QuizLevel): Promise<void> {
    await Promise.all(
      level.answer_options.map((answerOption) =>
        this.prisma.answerOption.upsert({
          where: { id: answerOption.id },
          create: {
            id: answerOption.id,
            text: answerOption.text,
            correct: answerOption.correct,
            quizLevelId: level.id,
          },
          update: {
            text: answerOption.text,
            correct: answerOption.correct,
            quizLevelId: level.id,
          },
        }),
      ),
    );
  }

  private async upsertChallenge(challenge: Challenge): Promise<void> {
    await this.prisma.challenge.upsert({
      where: { id: challenge.id },
      create: {
        id: challenge.id,
        name: challenge.name,
        slug: challenge.slug,
        difficulty: this.mapDifficulty(challenge.difficulty),
        introduction: challenge.introduction,
        order: challenge.order,
      },
      update: {
        name: challenge.name,
        slug: challenge.slug,
        difficulty: this.mapDifficulty(challenge.difficulty),
        introduction: challenge.introduction,
        order: challenge.order,
      },
    });
  }

  private mapDifficulty(difficulty: string): number {
    const difficultyMap = {
      easy: 0,
      medium: 1,
      hard: 2,
    };
    return difficultyMap[difficulty] || 0;
  }

  private async upsertLevelsForChallenge(levels: Level[], challengeId: string): Promise<void> {
    await Promise.all(
      levels.map(async (level) => {
        if (level.type === "code") {
          await this.upsertCodeLevel(level, challengeId);
        }

        if (level.type === "quiz") {
          await this.upsertQuizLevel(level, challengeId);
        }
      }),
    );
  }

  private async upsertQuizLevel(level: QuizLevel, challengeId: string): Promise<void> {
    await this.prisma.quizLevel.upsert({
      where: { id: level.id },
      create: {
        id: level.id,
        challengeId: challengeId,
        order: level.order,
        question: level.question,
      },
      update: {
        challengeId: challengeId,
        order: level.order,
        question: level.question,
      },
    });
  }

  private async upsertCodeLevel(level: CodeLevel, challengeId: string): Promise<void> {
    await this.prisma.codeLevel.upsert({
      where: { id: level.id },
      create: {
        id: level.id,
        order: level.order,
        instructions: level.instructions,
        challengeId,
        html: level.code?.html,
        css: level.code?.css,
        js: level.code?.js,
        hasHtmlEditor: level.has_editor?.html ?? !!level.code?.html,
        hasCssEditor: level.has_editor?.css ?? !!level.code?.css,
        hasJsEditor: level.has_editor?.js ?? !!level.code?.js,
      },
      update: {
        order: level.order,
        instructions: level.instructions,
        challengeId,
        html: level.code?.html,
        css: level.code?.css,
        js: level.code?.js,
        hasHtmlEditor: level.has_editor?.html ?? !!level.code?.html,
        hasCssEditor: level.has_editor?.css ?? !!level.code?.css,
        hasJsEditor: level.has_editor?.js ?? !!level.code?.js,
      },
    });
  }

  private async upsertRequirementsForLevel(requirements: Requirement[], levelId: string): Promise<void> {
    await Promise.all(
      requirements.map(async (requirement) => {
        await this.prisma.requirement.upsert({
          where: { id: requirement.id },
          create: {
            id: requirement.id,
            title: requirement.title,
            description: requirement.description,
            options: requirement.options,
            order: requirement.order,
            levelId,
          },
          update: {
            title: requirement.title,
            description: requirement.description,
            options: requirement.options,
            order: requirement.order,
            levelId,
          },
        });

        await this.prisma.requirement.update({
          where: { id: requirement.id },
          data: {
            rule: {
              connect: {
                key: requirement.key,
              },
            },
          },
        });
      }),
    );

    await this.prisma.requirement.deleteMany({
      where: {
        AND: {
          id: { notIn: requirements.map((r) => r.id) },
          levelId,
        },
      },
    });
  }

  private async upsertTasksForLevel(tasks: Task[], levelId: string): Promise<void> {
    await Promise.all(
      tasks.map(async (task) => {
        await this.prisma.task.upsert({
          where: { id: task.id },
          create: {
            id: task.id,
            text: task.text,
            levelId,
          },
          update: {
            text: task.text,
            levelId,
          },
        });
      }),
    );

    await this.prisma.task.deleteMany({
      where: {
        AND: {
          id: { notIn: tasks.map((t) => t.id) },
          levelId,
        },
      },
    });
  }

  private async upsertHintsForTask(hints: Hint[], taskId: string): Promise<void> {
    await Promise.all(
      hints.map(async (hint) => {
        await this.prisma.hint.upsert({
          where: { id: hint.id },
          create: {
            id: hint.id,
            text: hint.text,
            taskId,
          },
          update: { text: hint.text, taskId },
        });
      }),
    );

    await this.prisma.hint.deleteMany({
      where: {
        AND: {
          id: { notIn: hints.map((h) => h.id) },
          taskId,
        },
      },
    });
  }
}
