import React, { useEffect, useState } from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Select,
  SelectOption,
  SelectVariant,
  SearchInput,
  Pagination,
  Title,
  Toolbar,
  ToolbarFilter,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarGroup
} from '@patternfly/react-core';
import { TableComposable, Thead, Tr, Th, Tbody, Td, IAction, ActionsColumn } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';
import { useFetchAvailableRoles } from '@app/services/rolesHook';
import { filterRoles } from '@app/utils/searchFilter';
import { RoleFilterOption } from '@services/infinispanRefData';

const RoleTableDisplay = () => {
  const { t } = useTranslation();
  const brandname = t('brandname.brandname');
  const { roles, loading, error } = useFetchAvailableRoles();
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [selectSearchOption, setSelectSearchOption] = useState<string>(RoleFilterOption.name);
  const [searchValue, setSearchValue] = useState<string>('');
  const [rolesPagination, setRolesPagination] = useState({
    page: 1,
    perPage: 10
  });

  const [filteredRoles, setFilteredRoles] = useState<role[]>([]);

  useEffect(() => {
    if (searchValue !== '') {
      setFilteredRoles(filterRoles(searchValue, roles, selectSearchOption));
    } else {
      setFilteredRoles(roles);
    }
  }, [searchValue, roles]);

  const columnNames = {
    name: t('access-management.roles.role-name'),
    managerPermissions: t('access-management.roles.cache-manager-permission'),
    cachePermissions: t('access-management.roles.cache-permission'),
    description: t('access-management.roles.role-description')
  };

  const onSelectFilter = (event, selection) => {
    setSelectSearchOption(selection);
    setIsOpenFilter(false);
  };

  const onSetPage = (_event, pageNumber) => {
    setRolesPagination({
      ...rolesPagination,
      page: pageNumber
    });
  };

  const onPerPageSelect = (_event, perPage) => {
    setRolesPagination({
      page: 1,
      perPage: perPage
    });
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const pagination = (
    <Pagination
      itemCount={roles.length}
      perPage={rolesPagination.perPage}
      page={rolesPagination.page}
      onSetPage={onSetPage}
      widgetId="pagination-roles"
      onPerPageSelect={onPerPageSelect}
      isCompact
    />
  );

  const buildSearch = (
    <ToolbarGroup variant="filter-group">
      <ToolbarItem>
        <Select
          variant={SelectVariant.single}
          aria-label={'search option'}
          onToggle={() => setIsOpenFilter(!isOpenFilter)}
          onSelect={onSelectFilter}
          selections={selectSearchOption}
          isOpen={isOpenFilter}
          toggleIcon={<FilterIcon />}
        >
          <SelectOption key={0} value={RoleFilterOption.name} />
          <SelectOption key={1} value={RoleFilterOption.cacheManagerPermissions} />
          <SelectOption key={2} value={RoleFilterOption.cachePermissions} />
        </Select>
      </ToolbarItem>
      <ToolbarFilter categoryName={selectSearchOption}>
        <SearchInput
          placeholder={`Find by ${selectSearchOption}`}
          value={searchValue}
          onChange={(_event, value) => onSearchChange(value)}
          onSearch={(_event, value) => onSearchChange(value)}
          onClear={() => setSearchValue('')}
        />
      </ToolbarFilter>
    </ToolbarGroup>
  );

  return (
    <React.Fragment>
      <Toolbar id="role-table-toolbar" className={'role-table-display'}>
        <ToolbarContent>
          {buildSearch}
          <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <TableComposable className={'roles-table'} aria-label={'roles-table-label'} variant={'compact'}>
        <Thead>
          <Tr>
            <Th
              info={{
                tooltip: t('access-management.roles.role-name-tooltip'),
                className: 'role-name-info-tip',
                tooltipProps: {
                  isContentLeftAligned: true
                }
              }}
              colSpan={1}
            >
              {columnNames.name}
            </Th>
            <Th colSpan={1}>{columnNames.managerPermissions}</Th>
            <Th colSpan={1}>{columnNames.cachePermissions}</Th>
            <Th colSpan={1}>{columnNames.description}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRoles.length == 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      {t('access-management.roles.no-roles-found')}
                    </Title>
                    <EmptyStateBody>
                      {roles.length == 0
                        ? t('access-management.roles.no-roles-body')
                        : t('access-management.roles.no-filtered-roles-body')}
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          ) : (
            filteredRoles.map((row) => {
              return (
                <Tr key={row.name}>
                  <Td dataLabel={columnNames.name}>{row.name}</Td>
                  <Td dataLabel={columnNames.managerPermissions}>{row.cacheManagerPermissions.join(', ')}</Td>
                  <Td dataLabel={columnNames.cachePermissions}>{row.cachePermissions.join(', ')}</Td>
                  <Td dataLabel={columnNames.description}>{row.description}</Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </TableComposable>
      <Toolbar id="role-table-toolbar" className={'role-table-display'}>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
      </Toolbar>
    </React.Fragment>
  );
};

export { RoleTableDisplay };
