export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  locale: string;
}

// this is the shape of the JWT returned by the userinfo endpoint
export interface JWTContent {
  given_name: string;
  family_name: string;
  language: string;
  gender: string;
  sub: string;
  updated_at: number;
}

export interface InputParams {
  scope: string;
  ui_locales: string;
  state: string;
  nonce: string;
}
