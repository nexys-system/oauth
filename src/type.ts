export interface ResponseToken {
  access_token: string;
  refresh_token: string;
}

export interface ParamsToken {
  grant_type: "authorization_code" | "refresh_token";
  refresh_token?: string;
  code?: string;
}

export interface ParamsOptions {
  state: string;
  scopes: string[];
  access_type: "online" | "offline";
  prompt: "consent";
  response_type: "code";
}
