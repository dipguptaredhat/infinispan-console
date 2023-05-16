import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
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
import { SearchIcon } from '@patternfly/react-icons';
import { filterItems } from '@app/utils/searchFilter';
import { useRoleDetail } from '@app/services/rolesHook';
import { useTranslation } from 'react-i18next';

const RolePrincipals = (props: { roleName: string }) => {
  const { t } = useTranslation();
  const { principals } = useRoleDetail();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredPrincipals, setFilteredPrincipals] = useState<string[]>([]);
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    perPage: 10
  });

  const columnNames = {
    principalName: t('access-management.role-detail.principals.name')
  };

  useEffect(() => {
    if (searchValue !== '') {
      setFilteredPrincipals(filterItems(searchValue, principals));
    } else {
      setFilteredPrincipals(principals);
    }
  }, [searchValue, principals]);

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
      itemCount={principals.length}
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
      <ToolbarFilter categoryName={'name'}>
        <SearchInput
          placeholder={t('access-management.role-detail.principals.search-placeholder')}
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
      <Toolbar id="role-principal-table-toolbar">
        <ToolbarContent>
          {buildSearch}
          <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <TableComposable
        className={'roles-principal-table'}
        aria-label={'roles-principal-table-label'}
        variant={'compact'}
      >
        <Thead>
          <Tr>
            <Th colSpan={1}>{columnNames.principalName}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPrincipals.length == 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      {t('access-management.role-detail.principals.no-principal')}
                    </Title>
                    <EmptyStateBody>
                      {principals.length == 0
                        ? t('access-management.role-detail.principals.no-principal')
                        : t('access-management.role-detail.principals.no-filter-principal')}
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          ) : (
            filteredPrincipals.map((row) => {
              return (
                <Tr key={row}>
                  <Td dataLabel={columnNames.principalName}>{row}</Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </TableComposable>
      <Toolbar id="role-principal-table-toolbar" className={'role-principal-table-display'}>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
      </Toolbar>
    </React.Fragment>
  );
};

export { RolePrincipals };
