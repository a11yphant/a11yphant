import React from "react";

export const NetworkError = (): React.ReactElement => (
  <>
    <strong>Network error.</strong> Please check your internet connection.
  </>
);

export const UnknownError = (): React.ReactElement => (
  <>
    <strong>Unknown error.</strong> Please try again later.
  </>
);
