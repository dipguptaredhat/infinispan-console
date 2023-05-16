import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  AlertActionLink,
  AlertVariant,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Label,
  PageSection,
  PageSectionVariants,
  Spinner,
  Tab,
  Tabs,
  TabsComponent,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { useRoleDetail } from '@app/services/rolesHook';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 } from '@patternfly/react-tokens';
import { Link } from 'react-router-dom';
import { RoleGeneralSetting } from './RoleGeneralSetting';
import { RolePermissions } from './RolePermissions';
import { AccessManagementBreadcrumb } from '@app/Common/AccessManagementBreadcrumb';
import { RoleAccessibleCache } from './RoleAccessibleCache';
import { RolePrincipals } from './RolePrincipals';
import { useTranslation } from 'react-i18next';

const DetailRole = (props: { roleName: string }) => {
  const { t } = useTranslation();
  const { loadRole, loading, error, roleName } = useRoleDetail();

  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  useEffect(() => {
    loadRole(props.roleName);
  }, []);

  const buildRoleHeader = () => {
    if (loading || !props.roleName) {
      return (
        <Toolbar id="role-detail-header">
          <ToolbarGroup>
            <ToolbarContent style={{ paddingLeft: 0 }}>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h1}>
                    {t('access-management.role-detail.loading', { roleName: props.roleName })}
                  </Text>
                </TextContent>
              </ToolbarItem>
            </ToolbarContent>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    if (error != '') {
      return (
        <Toolbar id="role-detail-header">
          <ToolbarGroup>
            <ToolbarContent style={{ paddingLeft: 0 }}>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h1}>
                    {t('access-management.role-detail.error', { roleName: props.roleName })}
                  </Text>
                </TextContent>
              </ToolbarItem>
            </ToolbarContent>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    return (
      <React.Fragment>
        <Toolbar id="role-detail-header" style={{ paddingBottom: '1rem' }}>
          <ToolbarContent style={{ paddingLeft: 0 }}>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h1}>{roleName}</Text>
              </TextContent>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Tabs
          isBox={false}
          activeKey={activeTabKey}
          component={TabsComponent.nav}
          onSelect={(event, tabIndex) => {
            setActiveTabKey(tabIndex);
          }}
        >
          <Tab data-cy="generalSettingsTab" eventKey={0} title={t('access-management.role-detail.general-tab')} />
          <Tab data-cy="permissionsTab" eventKey={1} title={t('access-management.role-detail.permissions-tab')} />
          <Tab
            data-cy="accessibleCacheTab"
            eventKey={2}
            title={t('access-management.role-detail.accessible-cache-tab')}
          />
          <Tab data-cy="principalsTab" eventKey={3} title={t('access-management.role-detail.principal-tab')} />
        </Tabs>
      </React.Fragment>
    );
  };

  const buildDetailContent = () => {
    if (error.length > 0) {
      return (
        <Card>
          <CardBody>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={ExclamationCircleIcon} color={global_danger_color_200.value} />
              <Title headingLevel="h2" size="lg">
                {t('access-management.role-detail.error', { roleName: props.roleName })}
              </Title>
              <EmptyStateBody>{error}</EmptyStateBody>
              <EmptyStatePrimary>
                <Link
                  to={{
                    pathname: '/access-management'
                  }}
                >
                  <Button variant={ButtonVariant.secondary}>{t('access-management.role-detail.back-button')}</Button>
                </Link>
              </EmptyStatePrimary>
            </EmptyState>
          </CardBody>
        </Card>
      );
    }

    if (loading || !props.roleName) {
      return (
        <Card>
          <CardBody>
            <Spinner size="xl" />
          </CardBody>
        </Card>
      );
    }

    if (activeTabKey == 0) {
      return <RoleGeneralSetting roleName={roleName} />;
    } else if (activeTabKey == 1) {
      return <RolePermissions roleName={roleName} />;
    } else if (activeTabKey == 2) {
      return <RoleAccessibleCache roleName={roleName} />;
    } else if (activeTabKey == 3) {
      return <RolePrincipals roleName={roleName} />;
    }
  };

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light} style={{ paddingBottom: 0 }}>
        <AccessManagementBreadcrumb isRole roleName={props.roleName} />
        {buildRoleHeader()}
      </PageSection>
      <PageSection>{buildDetailContent()}</PageSection>
    </React.Fragment>
  );
};

export { DetailRole };
