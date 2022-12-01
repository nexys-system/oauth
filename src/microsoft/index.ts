import * as Utils from "../utils";
import AbstractOAuth from "../abstract";
import { UserInfo } from "./type";

// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

const urlPrefix = "https://login.microsoftonline.com/common/oauth2/v2.0";

const getParams = (
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

export default class Microsoft extends AbstractOAuth<UserInfo> {
  oAuthUrl = (state?: string): string => {
    const params = getParams({ state }, this.client_id, this.redirect_uri);
    const urlAuthorize = urlPrefix + "/authorize";
    return Utils.oAuthLink(urlAuthorize, params);
  };

  callback = async (code: string): Promise<string> => {
    const url = urlPrefix + "/token";
    const grant_type = "authorization_code";

    const data = {
      code,
      client_secret: this.client_secret,
      client_id: this.client_id,
      grant_type,
      redirect_uri: this.redirect_uri,
    };

    const { access_token } = await Utils.callbackComplete(url, data);

    return access_token;
  };

  getProfile = async (token: string): Promise<UserInfo> => {
    const url = "https://graph.microsoft.com/v1.0/me";

    const headers = {
      Authorization: "Bearer " + token,
      "content-type": "application/json",
    };

    const r = await fetch(url, { headers });

    return r.json();
  };
}

export const getInfo = async (token: string): Promise<UserInfo> => {
  const url = "https://graph.microsoft.com/v1.0/me";

  const headers = {
    Authorization: "Bearer " + token,
    "content-type": "application/json",
  };

  const r = await fetch(url, { headers });

  return r.json();
};
