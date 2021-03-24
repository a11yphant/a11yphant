import Slash from "app/components/icons/Slash";
import Link from "next/link";
import React from "react";

export interface Breadcrumb {
  href: string;
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbs.map((breadcrumb, idx) => {
          return (
            <li key={breadcrumb.href}>
              <div className="flex items-center">
                {idx > 0 && <Slash />}
                <Link href={breadcrumb.href}>
                  <a className={breadcrumb.className ? breadcrumb.className : "ml-1 text-gray-500 hover:text-primaryDark"}>{breadcrumb.children}</a>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
