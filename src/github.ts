// see https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
// manage credentials https://console.cloud.google.com/apis/credentials
import * as Utils from "./utils.js";
import AbstractOAuth from "./abstract.js";

export interface Profile {
  id: number;
  login: string;
}

const host = "https://github.com/login/oauth";

const urlAuthorize: string = host + "/authorize";
const urlToken: string = host + "/access_token";

export default class Github extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
    };

    return Utils.callback(urlToken, body);
  };

  getParams = (state?: string, scopes?: string[]) => {
    const scope: string | undefined = scopes ? scopes.join(" ") : undefined;

    return {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      state,
      scope,
    };
  };

  /**
   *
   * @param state
   * @param scopes , see list of available scopes: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes
   * @returns
   */
  oAuthUrl = (state?: string, scopes?: string[]): string => {
    const params = this.getParams(state, scopes);
    return Utils.oAuthLink(urlAuthorize, params);
  };

  getProfile = async (token: string): Promise<Profile> => {
    const url = "https://api.github.com/user";
    const headers = {
      Authorization: "Bearer " + token,
      "content-type": "application/json",
    };
    const options = {
      method: "GET",
      headers,
    };

    const r = await fetch(url, options);
    const { id, login } = await r.json();

    return { id, login };
  };
}
