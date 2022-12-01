import { UserInfo } from "./type";

export const urlPrefix = "https://login.microsoftonline.com/common/oauth2/v2.0";

export const getParams = (
  {
    state,
    scope = "user.read",
  }: {
    state?: string;
    scope?: string;
  },
  client_id: string,
  redirect_uri: string
) => {
  const response_type = "code";
  const params = { client_id, scope, response_type, redirect_uri };

  if (state) {
    return { ...params, state };
  }

  return params;
};

export const getProfileInfo = async (token: string): Promise<UserInfo> => {
  const url = "https://graph.microsoft.com/v1.0/me";

  const headers = {
    Authorization: "Bearer " + token,
    "content-type": "application/json",
  };

  const r = await fetch(url, { headers });

  return r.json();
};
