import { CustomScalar, Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";
import { validate as uuidValidate, version as uuidVersion } from "uuid";

const validate = (uuid: string): boolean => uuidValidate(uuid) && uuidVersion(uuid) === 4;

@Scalar("Uuid", (type) => String)
export class UuidScalar implements CustomScalar<string, string> {
  description = "Custom uuid scalar type.";

  parseValue(value: string): string {
    if (!validate(value)) {
      throw new TypeError(`UUID cannot represent non-UUID value: ${value}`);
    }

    return value;
  }

  serialize(value: string): string {
    if (!validate(value)) {
      throw new TypeError(`UUID cannot represent non-UUID value: ${value}`);
    }

    return value;
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      if (!validate(ast.value)) {
        throw new TypeError(`UUID cannot represent non-UUID value: ${ast.value}`);
      }
      return ast.value;
    }
    return null;
  }
}
