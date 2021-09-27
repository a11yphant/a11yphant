import React from "react";

export const errorMessages = {
  networkError: (): React.ReactNode => (
    <>
      <strong>Network error.</strong> Please check your internet connection.
    </>
  ),
  unknownError: (): React.ReactNode => (
    <>
      <strong>Unknown error.</strong> Please try again later.
    </>
  ),
};
