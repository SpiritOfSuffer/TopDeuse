import { RolesBuilder } from 'nest-access-control';
import { UserRoles } from '../../roles/src/enums';

 export const roles: RolesBuilder = new RolesBuilder();
 
 roles
  .grant(UserRoles.USER)
    .createOwn('profile')
    .updateOwn('profile')
    .readAny('profile')
  .grant(UserRoles.ADMIN)
    .extend(UserRoles.USER)
    .createAny('profile')
    .updateAny('profile')
    .deleteAny('profile');