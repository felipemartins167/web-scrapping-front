import { RoleModel } from "./role-model";
import { StatusUserModel } from "./status-user-model";

export class UserModel {
    id: number;
    name: string;
    email: string;
    roles: Array<RoleModel>;
    status: StatusUserModel;
  
    constructor() {
      this.id = 0;
      this.name = '';
      this.email = '';
      this.roles = new Array<RoleModel>();
      this.status = new StatusUserModel();
    }
}