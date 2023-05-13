import SelectionOption from '../../base/option/SelectionOption';
import Lang from '../../global/Lang';

enum SpaceMemberRole {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE',
  ADMIN = 'ADMIN',
}

const SpaceMemberRoles: SpaceMemberRole[] = Object.keys(SpaceMemberRole).map(
  (k) => k as SpaceMemberRole
);

const SpaceMemberRoleMap: Record<SpaceMemberRole, SelectionOption> = {
  [SpaceMemberRole.READ_ONLY]: {
    name: Lang.t('spaceMember.readOnly'),
    value: SpaceMemberRole.READ_ONLY,
  },
  [SpaceMemberRole.READ_WRITE]: {
    name: Lang.t('spaceMember.readWrite'),
    value: SpaceMemberRole.READ_WRITE,
  },
  [SpaceMemberRole.ADMIN]: {
    name: Lang.t('spaceMember.admin'),
    value: SpaceMemberRole.ADMIN,
  },
};

const SpaceMemberRoleList: SelectionOption[] = [];
SpaceMemberRoles.forEach((type: SpaceMemberRole, index: number) => {
  SpaceMemberRoleList.push(SpaceMemberRoleMap[type]);
});

export {
  SpaceMemberRole,
  SpaceMemberRoles,
  SpaceMemberRoleMap,
  SpaceMemberRoleList,
};
