import { IFactory } from "rosie";

export function buildMultipleOf<TFactory extends IFactory>(
  factory: TFactory,
  attributes: Parameters<TFactory["buildList"]>[1] = {},
  options: Parameters<TFactory["buildList"]>[2] = {},
): (size: number) => { create: ReturnType<TFactory["buildList"]> } {
  return (size = 0) => {
    if (size === 0) {
      return undefined;
    }

    const createMany = {
      create: factory.buildList(size, attributes, options) as ReturnType<TFactory["buildList"]>,
    };

    return createMany;
  };
}

export function buildOneOf<TFactory extends IFactory>(
  factory: TFactory,
  attributes: Parameters<TFactory["build"]>[0] = {},
  options: Parameters<TFactory["build"]>[1] = {},
): (recordId: string, createRecordIfMissing: boolean) => { create: ReturnType<TFactory["build"]> } {
  return (recordId: string, createRecordIfMissing: boolean) => {
    if (recordId || (!createRecordIfMissing && !recordId)) {
      return undefined;
    }

    const result = {
      create: factory.build(attributes, options) as ReturnType<TFactory["build"]>,
    };

    return result;
  };
}
