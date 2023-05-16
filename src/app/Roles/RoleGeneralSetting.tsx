import * as React from 'react';
import { Card, CardBody, Form, FormGroup, TextInput, TextArea, ActionGroup, Button } from '@patternfly/react-core';
import { useRoleDetail } from '@app/services/rolesHook';
import { useTranslation } from 'react-i18next';

const RoleGeneralSetting = (props: { roleName: string }) => {
  const { t } = useTranslation();
  const { roleName, description } = useRoleDetail();

  return (
    <Card>
      <CardBody>
        <Form isHorizontal>
          <FormGroup label={t('access-management.role-detail.general-settings.name')} isRequired fieldId="name-field">
            <TextInput value={roleName} isRequired type="text" />
          </FormGroup>

          <FormGroup label={t('access-management.role-detail.general-settings.description')} fieldId="role-description">
            <TextArea value={description} />
          </FormGroup>

          <ActionGroup>
            <Button isDisabled variant="primary">
              {t('access-management.role-detail.general-settings.submit-button')}
            </Button>
            <Button isDisabled variant="link">
              {t('access-management.role-detail.general-settings.cancel-button')}
            </Button>
          </ActionGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export { RoleGeneralSetting };
