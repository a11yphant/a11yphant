import { Factory } from "rosie";

export function buildMultipleOf<T>(
  factory: string,
  attributes: { [k in keyof T]?: T[k] } = {},
  options: Record<string, any> = {},
): (size: number) => { create: T[] } {
  return (size = 0) => {
    if (size === 0) {
      return undefined;
    }

    const createMany = {
      create: Factory.buildList<T>(factory, size, attributes, options),
    };

    return createMany;
  };
}

export function buildOneOf<T>(
  factory: string,
  attributes: { [k in keyof T]?: T[k] } = {},
  options: Record<string, any> = {},
): (recordId: string, createRecordIfMissing: boolean) => { create: T } {
  return (recordId: string, createRecordIfMissing: boolean) => {
    if (recordId || (!createRecordIfMissing && !recordId)) {
      return undefined;
    }

    const result = {
      create: Factory.build<T>(factory, attributes, options),
    };

    return result;
  };
}
