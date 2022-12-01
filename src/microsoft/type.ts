export interface UserInfo {
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity";
  displayName: string;
  surname: string;
  givenName: string;
  id: string;
  userPrincipalName: string; // email?
  businessPhones: [];
  jobTitle: null;
  mail: null;
  mobilePhone: null;
  officeLocation: null;
  preferredLanguage: null;
}
