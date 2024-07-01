import { render, screen } from "@testing-library/react";
import PasswordResetForm from "app/components/passwordReset/PasswordResetForm";
import { ValidatePasswordResetTokenResultEnum } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import ResetPassword, { getServerSideProps, ResetPasswordProps } from "app/pages/reset-password";
import { GetServerSidePropsContext } from "next";

const validationResult = ValidatePasswordResetTokenResultEnum.Valid;

jest.mock("app/components/Navigation", () => {
  return {
    __esModule: true,
    default: () => <></>,
  };
});

const mockShowFlashMessage = jest.fn();
jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: () => ({
    show: mockShowFlashMessage,
  }),
}));

jest.mock("app/components/passwordReset/PasswordResetForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/lib/apollo-client", () => ({
  initializeApollo: jest.fn(),
}));

describe("reset password page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (PasswordResetForm as jest.Mock).mockImplementation(() => <p>Password Reset Form</p>);
  });

  describe("page", () => {
    it("renders an error message when token is invalid", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.InvalidToken} />);

      expect(screen.getByText("Invalid token")).toBeInTheDocument();
    });

    it("renders an error message when the token is expired", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.Expired} />);

      expect(screen.getByText("Invalid token")).toBeInTheDocument();
    });

    it("renders the password reset form when the token is valid", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.Valid} />);

      expect(screen.getByText("Password Reset Form")).toBeInTheDocument();
    });

    it("shows a flash message after a successful password reset", () => {
      (PasswordResetForm as jest.Mock).mockImplementation((props: Parameters<typeof PasswordResetForm>[0]) => {
        props.onAfterSubmit();
        return <div>ResetPasswordForm</div>;
      });
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.Valid} />);

      expect(mockShowFlashMessage).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("get server side props", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (initializeApollo as jest.Mock).mockReturnValue({
        mutate: jest.fn().mockResolvedValue({ data: { validatePasswordResetToken: { result: validationResult } } }),
      });
    });

    it("returns the token", async () => {
      const { props } = (await getServerSideProps({
        query: { token: "token" },
        req: { headers: { host: "a11yphant.com" } },
      } as unknown as GetServerSidePropsContext)) as { props: ResetPasswordProps };

      expect(props.token).toBe("token");
    });

    it("returns the token validation result", async () => {
      const { props } = (await getServerSideProps({
        req: { headers: { host: "a11yphant.com" } },
        query: { token: "token" },
      } as unknown as GetServerSidePropsContext)) as { props: ResetPasswordProps };

      expect(props.tokenValidationResult).toBe(validationResult);
    });
  });
});
