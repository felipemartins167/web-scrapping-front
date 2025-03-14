export class RegisterModel {
    name: string;
    email: string;
    password: string;
    roleId: number;

    constructor(name: string, email: string, password: string, roleId: number) {
        this.name = name;
        this.email = email;
        this.password = password,
        this.roleId = roleId;
    }
  }