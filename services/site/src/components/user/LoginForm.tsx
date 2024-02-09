"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { CurrentUserDocument, useLoginMutation } from "app/generated/graphql";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TextInput from "../common/inputs/TextInput";
import InvertedLoadingButton from "./InvertedLoadingButton";

const schema = yup
  .object({
    email: yup.string().email("This email address is not valid").required("The email address is required"),
    password: yup.string().required("The password is required"),
  })
  .required();

interface LoginFormProps {
  onAfterSubmit?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAfterSubmit }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { loading }] = useLoginMutation({
    context: LocalErrorScopeApolloContext,
    refetchQueries: [{ query: CurrentUserDocument }],
    onError: (error) => {
      if (error.graphQLErrors?.[0]?.extensions.code === "BAD_USER_INPUT") {
        setError("password", { message: "The email or the password is incorrect." });
        return;
      }
      setError("password", { message: "An unknown error occurred" });
    },
  });

  const submitLogin = async ({ email, password }): Promise<void> => {
    const { errors } = await login({ variables: { email, password } });
    if (errors) {
      return;
    }

    onAfterSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit(submitLogin)} aria-label="Login form">
      <div className="mb-4">
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Email" error={!!errors?.email} helperText={errors?.email?.message} {...field} />
          )}
        />
      </div>
      <div className="mb-6">
        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Password" type="password" error={!!errors?.password} helperText={errors?.password?.message} {...field} />
          )}
        />
      </div>

      <InvertedLoadingButton loading={loading} srLoadingText="Login in progress">
        Log in
      </InvertedLoadingButton>
    </form>
  );
};

export default LoginForm;
