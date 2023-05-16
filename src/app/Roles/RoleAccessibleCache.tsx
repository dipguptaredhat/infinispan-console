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
import { RoleCachePermissionFilterOption, ComponentHealth } from '@services/infinispanRefData';
import { filterItems } from '@app/utils/searchFilter';
import { useRoleDetail } from '@app/services/rolesHook';
import { CacheTypeBadge } from '@app/Common/CacheTypeBadge';
import { Health } from '@app/Common/Health';
import { getKeyByValue } from '@app/utils/jsObjectUtils';
import { useTranslation } from 'react-i18next';

const RoleAccessibleCache = (props: { roleName: string }) => {
  const { t } = useTranslation();
  const { cachePermissions } = useRoleDetail();
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [selectSearchOption, setSelectSearchOption] = useState<string>(RoleCachePermissionFilterOption.cacheName);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredCachePermission, setFilteredCachePermission] = useState<roleCachePermissions[]>([]);
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    perPage: 10
  });

  const columnNames = {
    cacheName: t('access-management.role-detail.accessible-caches.cache-name'),
    cacheType: t('access-management.role-detail.accessible-caches.cache-type'),
    health: t('access-management.role-detail.accessible-caches.cache-health')
  };

  useEffect(() => {
    if (searchValue !== '') {
      setFilteredCachePermission(
        filterItems(searchValue, cachePermissions, getKeyByValue(RoleCachePermissionFilterOption, selectSearchOption))
      );
    } else {
      setFilteredCachePermission(cachePermissions);
    }
  }, [searchValue, cachePermissions]);

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
      itemCount={cachePermissions.length}
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
          <SelectOption key={0} value={RoleCachePermissionFilterOption.cacheName} />
          <SelectOption key={1} value={RoleCachePermissionFilterOption.cacheType} />
          <SelectOption key={2} value={RoleCachePermissionFilterOption.health} />
        </Select>
      </ToolbarItem>
      <ToolbarFilter categoryName={selectSearchOption}>
        <SearchInput
          placeholder={t('access-management.role-detail.accessible-caches.search-placeholder', {
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
      <Toolbar id="role-cache-permission-table-toolbar">
        <ToolbarContent>
          {buildSearch}
          <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <TableComposable className={'roles-cache-table'} aria-label={'roles-cache-table-label'} variant={'compact'}>
        <Thead>
          <Tr>
            <Th colSpan={1}>{columnNames.cacheName}</Th>
            <Th colSpan={1}>{columnNames.cacheType}</Th>
            <Th colSpan={1}>{columnNames.health}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCachePermission.length == 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      {t('access-management.role-detail.accessible-caches.no-cache')}
                    </Title>
                    <EmptyStateBody>
                      {cachePermissions.length == 0
                        ? t('access-management.role-detail.accessible-caches.no-cache')
                        : t('access-management.role-detail.accessible-caches.no-filter-cache')}
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          ) : (
            filteredCachePermission.map((row) => {
              return (
                <Tr key={row.cacheName}>
                  <Td dataLabel={columnNames.cacheName}>{row.cacheName}</Td>
                  <Td dataLabel={columnNames.cacheType}>
                    <CacheTypeBadge cacheType={row.cacheType} small={true} cacheName={row.cacheName} />
                  </Td>
                  <Td dataLabel={columnNames.health}>
                    <Health
                      health={row.health}
                      displayIcon={ComponentHealth[row.health] == ComponentHealth.FAILED}
                      cacheName={row.cacheName}
                    />
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </TableComposable>
      <Toolbar id="role-cache-permission-table-toolbar" className={'role-cache-permission-table-display'}>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
      </Toolbar>
    </React.Fragment>
  );
};

export { RoleAccessibleCache };
