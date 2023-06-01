import Lang from '../../global/Lang';
import ColorSelectionOption from '../../base/option/ColorSelectionOption';
import Color from '../../base/option/Color';

enum SpaceMemberRole {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE',
  ADMIN = 'ADMIN',
}

const SpaceMemberRoles: SpaceMemberRole[] = Object.keys(SpaceMemberRole).map(
  (k) => k as SpaceMemberRole
);

const SpaceMemberRoleMap: Record<SpaceMemberRole, ColorSelectionOption> = {
  [SpaceMemberRole.READ_ONLY]: {
    name: Lang.t('space.memberRoleReadonly'),
    value: SpaceMemberRole.READ_ONLY,
    color: Color.SUCCESS,
  },
  [SpaceMemberRole.READ_WRITE]: {
    name: Lang.t('space.memberRoleReadWrite'),
    value: SpaceMemberRole.READ_WRITE,
    color: Color.PRIMARY,
  },
  [SpaceMemberRole.ADMIN]: {
    name: Lang.t('space.memberRoleAdmin'),
    value: SpaceMemberRole.ADMIN,
    color: Color.DANGER,
  },
};

const SpaceMemberRoleList: ColorSelectionOption[] = [];
SpaceMemberRoles.forEach((type: SpaceMemberRole, index: number) => {
  SpaceMemberRoleList.push(SpaceMemberRoleMap[type]);
});

export {
  SpaceMemberRole,
  SpaceMemberRoles,
  SpaceMemberRoleMap,
  SpaceMemberRoleList,
};
