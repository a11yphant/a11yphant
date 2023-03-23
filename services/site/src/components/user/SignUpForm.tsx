import { yupResolver } from "@hookform/resolvers/yup";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { CurrentUserDocument, useRegisterMutation } from "app/generated/graphql";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TextInput from "../common/inputs/TextInput";
import InvertedLoadingButton from "./InvertedLoadingButton";

const schema = yup
  .object({
    name: yup.string().required("Please tell us your name"),
    email: yup.string().email("This email address is not valid").required("The email address is required"),
    password: yup.string().min(8, "The password must be at least 8 characters long").required("The password is required"),
  })
  .required();

interface SignUpFormProps {
  onAfterSubmit?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onAfterSubmit }) => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [register, { loading }] = useRegisterMutation({
    context: LocalErrorScopeApolloContext,
    refetchQueries: [{ query: CurrentUserDocument }],
    onError: (error) => {
      if (error.graphQLErrors?.[0]?.extensions.code === "INPUT_ERROR") {
        setError("email", { message: "This email is already taken" });
        return;
      }
      setError("password", { message: "An unknown error occurred" });
    },
  });

  const submitLogin = async ({ name, email, password }): Promise<void> => {
    const { errors } = await register({ variables: { name, email, password } });
    if (errors) {
      return;
    }

    reset({
      name: "",
      email: "",
      password: "",
    });

    onAfterSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit(submitLogin)} aria-label="Sign up form">
      <div className="mb-4">
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Name" error={!!errors?.name} helperText={errors?.name?.message} {...field} />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Email" type="email" error={!!errors?.email} helperText={errors?.email?.message} {...field} />
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

      <InvertedLoadingButton loading={loading} srLoadingText="Sign up in progress">
        Sign Up
      </InvertedLoadingButton>
    </form>
  );
};

export default SignUpForm;
