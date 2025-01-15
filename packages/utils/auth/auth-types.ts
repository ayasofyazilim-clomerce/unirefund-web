export interface MyUser {
  //user
  userName: string;
  email: string;
  name: string;
  surname: string;

  //tenant
  tenantId?: string;
  tenantName?: string;

  refresh_token: string;
  access_token: string;
  expiration_date: number;
}
