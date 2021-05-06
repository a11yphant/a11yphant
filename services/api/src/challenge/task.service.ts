import { Injectable } from "@nestjs/common";
import { Task as TaskRecord } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Task } from "./models/task.model";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findForLevel(levelId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { levelId },
    });

    return tasks.map((task) => TaskService.createModelFromDatabaseRecord(task));
  }

  static createModelFromDatabaseRecord(record: TaskRecord): Task {
    const task = new Task({
      id: record.id,
      text: record.text,
    });

    return task;
  }
}
