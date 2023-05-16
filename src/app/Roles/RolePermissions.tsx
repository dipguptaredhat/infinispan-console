import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';
import { RolePermissionFilterOption } from '@services/infinispanRefData';
import { filterItems } from '@app/utils/searchFilter';
import { useRoleDetail } from '@app/services/rolesHook';
import { getKeyByValue } from '@app/utils/jsObjectUtils';
import { useTranslation } from 'react-i18next';

const RolePermissions = (props: { roleName: string }) => {
  const { t } = useTranslation();
  const { rolePermissions } = useRoleDetail();
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [selectSearchOption, setSelectSearchOption] = useState<string>(RolePermissionFilterOption.name);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredPermission, setFilteredPermission] = useState<rolePermissions[]>([]);
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    perPage: 10
  });

  const columnNames = {
    name: t('access-management.role-detail.permissions.name'),
    category: t('access-management.role-detail.permissions.category'),
    description: t('access-management.role-detail.permissions.description')
  };

  useEffect(() => {
    if (searchValue !== '') {
      setFilteredPermission(
        filterItems(searchValue, rolePermissions, getKeyByValue(RolePermissionFilterOption, selectSearchOption))
      );
    } else {
      setFilteredPermission(rolePermissions);
    }
  }, [searchValue, rolePermissions]);

  const onSelectFilter = (event, selection) => {
    setSelectSearchOption(selection);
    setIsOpenFilter(false);
  };

  const onSetPage = (_event, pageNumber) => {
    setTablePagination({
      ...tablePagination,
      page: pageNumber
    });
  };

  const onPerPageSelect = (_event, perPage) => {
    setTablePagination({
      page: 1,
      perPage: perPage
    });
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const pagination = (
    <Pagination
      itemCount={rolePermissions.length}
      perPage={tablePagination.perPage}
      page={tablePagination.page}
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
          <SelectOption key={0} value={RolePermissionFilterOption.name} />
          <SelectOption key={1} value={RolePermissionFilterOption.category} />
          <SelectOption key={2} value={RolePermissionFilterOption.description} />
        </Select>
      </ToolbarItem>
      <ToolbarFilter categoryName={selectSearchOption}>
        <SearchInput
          placeholder={t('access-management.role-detail.permissions.search-placeholder', {
            searchOption: selectSearchOption
          })}
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
      <Toolbar id="role-permission-table-toolbar">
        <ToolbarContent>
          {buildSearch}
          <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <TableComposable className={'roles-table'} aria-label={'roles-table-label'} variant={'compact'}>
        <Thead>
          <Tr>
            <Th colSpan={1}>{columnNames.name}</Th>
            <Th colSpan={1}>{columnNames.category}</Th>
            <Th colSpan={1}>{columnNames.description}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPermission.length == 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      {t('access-management.role-detail.permissions.no-permission')}
                    </Title>
                    <EmptyStateBody>
                      {rolePermissions.length == 0
                        ? t('access-management.role-detail.permissions.no-permission')
                        : t('access-management.role-detail.permissions.no-filter-permission')}
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          ) : (
            filteredPermission.map((row) => {
              return (
                <Tr key={row.name}>
                  <Td dataLabel={columnNames.name}>{row.name}</Td>
                  <Td dataLabel={columnNames.category}>{row.category}</Td>
                  <Td dataLabel={columnNames.description}>{row.description}</Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </TableComposable>
      <Toolbar id="role-permission-table-toolbar" className={'role-permission-table-display'}>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
      </Toolbar>
    </React.Fragment>
  );
};

export { RolePermissions };
