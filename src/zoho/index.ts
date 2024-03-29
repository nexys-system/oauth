import * as Utils from "../utils.js";
import AbstractOAuth from "../abstract.js";
import { ParamsToken, ResponseToken, ParamsOptions } from "../type.js";

export interface Profile {
  First_Name: string;
  Email: string;
  Last_Name: string;
  Display_Name: string;
  ZUID: number;
}

const host: string = "https://accounts.zoho.eu/oauth/v2";

// https://www.zoho.com/mail/help/api/using-oauth-2.html
// token validity: https://www.zoho.com/crm/developer/docs/api/v6/token-validity.html
// scopes: https://www.zoho.com/crm/developer/docs/api/v2/scopes.html

/**
 * https://www.zoho.com/accounts/protocol/oauth/web-apps/access-token.html
 */
class Zoho extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      grant_type: "authorization_code",
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
    };

    return Utils.callback(host + "/token", body);
  };

  /**
   * https://www.zoho.com/accounts/protocol/oauth/web-apps/authorization.html
   */
  getParams = ({
    state,
    scopes = this.scopes,
    access_type = "offline",
    prompt = "consent",
    response_type = "code",
  }: Partial<ParamsOptions>) => {
    const scope = scopes.join(",");
    const client_id = this.client_id;
    const redirect_uri = this.redirect_uri;

    return {
      state,
      scope,
      response_type,
      prompt,
      access_type,
      client_id,
      redirect_uri,
    };
  };

  oAuthUrl = (state?: string, scopes?: string[]): string => {
    const params = this.getParams({ state, scopes });
    return Utils.oAuthLink(host + "/auth", params);
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
    return r.json();
  };

  getToken = async (paramsExtra: ParamsToken): Promise<ResponseToken> => {
    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      scope: this.scopes.join(","),
      ...paramsExtra,
    };

    const url = `${host}/token`;

    const { access_token, refresh_token = "" } = await Utils.callbackComplete(
      url,
      params
    );

    return { access_token, refresh_token };
  };

  getAccessToken = async (code: string): Promise<ResponseToken> =>
    this.getToken({
      grant_type: "authorization_code",
      code,
    });

  refreshAccessToken = async (refresh_token: string) =>
    this.getToken({
      grant_type: "refresh_token",
      refresh_token,
    });
}

export { Zoho };

export default Zoho;
