import React, { useCallback, useEffect, useState } from 'react';
import { ConsoleServices } from '@services/ConsoleServices';
import { useConnectedUser } from '@app/services/userManagementHook';
import { ConsoleACL } from '@services/securityService';
import { ContentType } from '@services/infinispanRefData';

const mockRole: DetailedInfinispanRole = {
  name: 'test',
  description: 'test',
  permissions: [
    {
      name: 'permission1',
      description: 'Description permission 1',
      category: 'category1'
    },
    {
      name: 'permission2',
      description: 'Description permission 2',
      category: 'category2'
    }
  ],
  roleCachePermissions: [
    {
      cacheName: 'cache1',
      cacheType: 'Distributed',
      health: 'HEALTHY'
    },
    {
      cacheName: 'cache2',
      cacheType: 'Replicated',
      health: 'HEALTHY'
    }
  ],
  principals: ['principal1', 'principal2', 'principal3', 'principal4']
};

const initialContext = {
  loadRole: (roleName: string) => {},
  error: '',
  loading: false,
  roleName: '',
  description: '',
  rolePermissions: [] as rolePermissions[],
  cachePermissions: [] as roleCachePermissions[],
  principals: [] as string[]
};

export const RoleDetailContext = React.createContext(initialContext);

const RoleDetailProvider = ({ children }) => {
  const { connectedUser } = useConnectedUser();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [rolePermissions, setRolePermissions] = useState([] as rolePermissions[]);
  const [cachePermissions, setCachePermissions] = useState([] as roleCachePermissions[]);
  const [principals, setPrincipals] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRole = (name: string | undefined) => {
    if (name != undefined && name != '' && roleName != name) {
      setRoleName(name);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [loading]);

  const fetchRole = () => {
    if (loading) {
      setDescription(mockRole.description);
      setRolePermissions(mockRole.permissions);
      setCachePermissions(mockRole.roleCachePermissions);
      setPrincipals(mockRole.principals);
      setLoading(false);
    }
  };

  const contextValue = {
    loadRole: useCallback(loadRole, []),
    error: error,
    loading: false,
    roleName: roleName,
    description: description,
    rolePermissions: rolePermissions,
    cachePermissions: cachePermissions,
    principals: principals
  };
  return <RoleDetailContext.Provider value={contextValue}>{children}</RoleDetailContext.Provider>;
};

export { RoleDetailProvider };
