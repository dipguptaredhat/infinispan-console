import * as React from 'react';
import { RoleDetailProvider } from '@app/providers/RoleDetailProvider';
import { DetailRole } from '@app/Roles/DetailRole';

const DetailRolePage = (props) => {
  const roleName = decodeURIComponent(props.computedMatch.params.roleName);
  return (
    <RoleDetailProvider>
      <DetailRole roleName={roleName} />
    </RoleDetailProvider>
  );
};

export { DetailRolePage };
