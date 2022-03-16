import * as Utils from "./utils";
import AbstractOAuth from "./abstract";

export interface Profile {
  First_Name: string;
  Email: string;
  Last_Name: string;
  Display_Name: string;
  ZUID: number;
}

const host = "https://accounts.zoho.com/oauth/v2";
const urlAuthorize: string = host + "/auth";
const urlToken: string = host + "/token";
// https://www.zoho.com/crm/developer/docs/api/v2/scopes.html
const scope = "AaaServer.profile.Read";

/**
 * https://www.zoho.com/accounts/protocol/oauth/web-apps/access-token.html
 */
export default class Github extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      client_id: this.client_id,
      grant_type: "authorization_code",
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      code,
    };

    return Utils.callback(urlToken, body);
  };

  /**
   * https://www.zoho.com/accounts/protocol/oauth/web-apps/authorization.html
   */
  getParams = (state?: string) => {
    const params = {
      response_type: "code",
      scope,
      prompt: "consent",
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
    };

    if (state) {
      return { state, ...params };
    }

    return params;
  };

  oAuthUrl = (state?: string): string => {
    const params = this.getParams(state);
    return Utils.oAuthLink(urlAuthorize, params);
  };

  /**
   * https://www.zoho.com/accounts/protocol/oauth/use-access-token.html
   */
  getProfile = async (token: string): Promise<Profile> => {
    const url = "https://accounts.zoho.com/oauth/user/info";
    const headers = {
      Authorization: "Zoho-oauthtoken " + token,
      "content-type": "application/json",
    };
    const options = {
      method: "GET",
      headers,
    };

    const r = await fetch(url, options);
    const j = await r.json();

    return j;
  };
}
