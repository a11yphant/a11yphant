import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TextInput from "../common/inputs/TextInput";
import InvertedLoadingButton from "./InvertedLoadingButton";

const schema = yup
  .object({
    email: yup.string().email("This email address is not valid").required("The email address is required"),
  })
  .required();

interface ResetPasswordFormProps {
  onAfterSubmit?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onAfterSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const submitPasswordReset = async ({ email }): Promise<void> => {
    reset({ email: "" });
    onAfterSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit(submitPasswordReset)} aria-label="Request password reset">
      <div className="mb-6">
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Email" error={!!errors?.email} helperText={errors?.email?.message} {...field} />
          )}
        />
      </div>

      <InvertedLoadingButton loading={false} srLoadingText="Request password reset in progress">
        Reset password
      </InvertedLoadingButton>
    </form>
  );
};

export default ResetPasswordForm;
