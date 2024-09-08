"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRequestPasswordResetMutation } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TextInput from "../common/inputs/TextInput";
import InvertedLoadingButton from "./InvertedLoadingButton";

const schema = yup
  .object({
    email: yup.string().email("This e-mail address is not valid").required("The e-mail address is required"),
  })
  .required();

interface RequestPasswordResetFormProps {
  onAfterSubmit?: () => void;
}

const RequestPasswordResetForm: React.VFC<RequestPasswordResetFormProps> = ({ onAfterSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const [requestPasswordReset, { loading }] = useRequestPasswordResetMutation();

  async function submitPasswordReset({ email }): Promise<void> {
    const { data } = await requestPasswordReset({ variables: { email } });
    if (data?.requestPasswordReset?.__typename === "RequestPasswordResetSuccessResult") {
      reset({ email: "" });
      onAfterSubmit?.();
    }

    if (data?.requestPasswordReset.__typename === "RequestPasswordResetErrorResult") {
      setError("email", { message: "The e-mail is not valid" });
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordReset)} aria-label="Request password reset">
      <div className={clsx("mb-6")}>
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Email" error={!!errors?.email} helperText={errors?.email?.message} {...field} />
          )}
        />
      </div>

      <InvertedLoadingButton loading={loading} srLoadingText="Request password reset in progress">
        Reset password
      </InvertedLoadingButton>
    </form>
  );
};

export default RequestPasswordResetForm;
