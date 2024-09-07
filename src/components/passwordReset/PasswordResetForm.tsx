import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPasswordMutation } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import LoadingButton from "../buttons/LoadingButton";
import TextInput from "../common/inputs/TextInput";

const schema = yup
  .object({
    password: yup.string().required("The new password is required").min(8, "The password must be at least 8 characters long"),
  })
  .required();

interface ResetPasswordFormProps {
  token: string;
  onAfterSubmit?: () => void;
}

const PasswordResetForm: React.VFC<ResetPasswordFormProps> = ({ onAfterSubmit, token }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
    },
  });
  const [resetPassword, { loading }] = useResetPasswordMutation();

  async function submitPasswordReset({ password }): Promise<void> {
    const { data } = await resetPassword({ variables: { password, token } });
    if (data?.resetPassword.__typename === "ResetPasswordErrorResult") {
      setError("password", { message: "The password must be at least 8 characters long." });
      return;
    }

    reset({ password: "" });
    onAfterSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordReset)} aria-label="Password reset">
      <div className={clsx("mb-6 max-w-md")}>
        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput
              inputRef={ref}
              label="New Password"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              {...field}
            />
          )}
        />
      </div>

      <LoadingButton loading={loading} primary srTextLoading="Password reset in progress">
        Reset password
      </LoadingButton>
    </form>
  );
};

export default PasswordResetForm;
