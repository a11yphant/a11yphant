import { Breadcrumb } from "app/components/breadcrumbs/Breadcrumbs";
import React, { useState } from "react";

export const useBreadcrumbs = (): BreadcrumbsApi => {
  return React.useContext(BreadcrumbsContext);
};

interface BreadcrumbsApi {
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  breadcrumbs: Breadcrumb[];
}

export const BreadcrumbsContext = React.createContext<BreadcrumbsApi>({
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
    return;
  },
  breadcrumbs: [],
});

export const BreadcrumbsContextProvider: React.FunctionComponent = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return <BreadcrumbsContext.Provider value={{ setBreadcrumbs, breadcrumbs }}>{children}</BreadcrumbsContext.Provider>;
};
