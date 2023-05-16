import { useContext, useEffect, useState } from 'react';
import { ConsoleServices } from '@services/ConsoleServices';
import { RoleDetailContext } from '@app/providers/RoleDetailProvider';

// Will be removed when the backend is ready
// Mocking the roles
function mockRole(roleNames): role[] {
  const roles = roleNames.map((roleName) => {
    return {
      name: roleName,
      description: 'description',
      cacheManagerPermissions: ['READ', 'WRITE', 'EXEC', 'CREATE', 'ADMIN'],
      cachePermissions: ['READ', 'WRITE', 'EXEC', 'CREATE', 'ADMIN']
    };
  });
  return roles;
}

function mockRoleDetail(roleName): DetailedInfinispanRole {
  return {
    name: roleName,
    description: 'description',
    permissions: [
      {
        name: 'permission',
        category: 'category',
        description: 'description'
      }
    ],
    roleCachePermissions: [
      {
        cacheName: 'cacheName',
        cacheType: 'cacheType',
        health: 'health'
      }
    ],
    principals: ['principals']
  };
}

export function useFetchAvailableRoles() {
  const [roles, setRoles] = useState<role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) {
      ConsoleServices.security()
        .getSecurityRoles()
        .then((either) => {
          if (either.isRight()) {
            setRoles(mockRole(either.value));
          } else {
            setError(either.value.message);
          }
        })
        .then(() => setLoading(false));
    }
  }, [loading]);

  return {
    roles,
    loading,
    error
  };
}

export function useRoleDetail() {
  const { loadRole, error, loading, roleName, description, rolePermissions, cachePermissions, principals } =
    useContext(RoleDetailContext);

  return {
    loadRole,
    error,
    loading,
    roleName,
    description,
    rolePermissions,
    cachePermissions,
    principals
  };
}
