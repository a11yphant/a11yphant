import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";

export interface InputError<Fields> {
  field: Fields;
  message: string;
}

export function InputError<InputFields>(inputFieldsType: Record<string, string>): Type<InputError<InputFields>> {
  @ObjectType({ isAbstract: true })
  class InputErrorClass implements InputError<InputFields> {
    @Field(() => inputFieldsType)
    field: InputFields;

    @Field()
    message: string;
  }

  return InputErrorClass;
}
