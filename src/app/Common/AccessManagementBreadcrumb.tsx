import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import * as React from 'react';

const AccessManagementBreadcrumb = (props: { isRole?: boolean; isAccessControl?: boolean; roleName?: string }) => {
  const roleOrACBreadcrumb = () => {
    if (props.isRole) {
      return (
        <BreadcrumbItem>
          <Link
            to={{
              pathname: '/access-management'
            }}
          >
            Roles
          </Link>
        </BreadcrumbItem>
      );
    } else if (props.isAccessControl) {
      return (
        <BreadcrumbItem>
          <Link
            to={{
              pathname: '/access-management'
            }}
          >
            Access Control
          </Link>
        </BreadcrumbItem>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link
          to={{
            pathname: '/access-management'
          }}
        >
          Access management
        </Link>
      </BreadcrumbItem>
      {roleOrACBreadcrumb()}
      <BreadcrumbItem isActive>{props.roleName}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export { AccessManagementBreadcrumb };
