import { Prisma } from "@prisma/client";

export type ChallengeData = Prisma.ChallengeCreateArgs["data"];
export type CheckResultData = Prisma.CheckResultCreateArgs["data"];
export type LevelData = Prisma.LevelCreateArgs["data"];
export type HintData = Prisma.HintCreateArgs["data"];
export type RequirementData = Prisma.RequirementCreateArgs["data"];
export type ResultData = Prisma.ResultCreateArgs["data"];
export type RuleData = Prisma.RuleCreateArgs["data"];
export type SubmissionData = Prisma.SubmissionCreateArgs["data"];
export type TaskData = Prisma.TaskCreateArgs["data"];
export type UserData = Prisma.UserCreateArgs["data"];
