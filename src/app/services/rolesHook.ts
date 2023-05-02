import { useEffect, useState } from 'react';
import { ConsoleServices } from '@services/ConsoleServices';

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
