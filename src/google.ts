import * as Utils from "./utils";
import AbstractOAuth from "./abstract";

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  gender: string;
  locale: string;
  hd: string;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const urlAuthorize: string = "https://accounts.google.com/o/oauth2/v2/auth";
const stateDefault: string = "myuniquestatetoavoidCSRF";
const apiHost = "https://www.googleapis.com";

export const scopesDefault: string[] = [
  "userinfo.profile",
  "userinfo.email",
  //"calendar",
  //"gmail.readonly", // for emails, not required if only the token is needed
].map((path) => apiHost + "/auth/" + path);

export default class Google extends AbstractOAuth<Profile> {
  oAuthUrl = (
    state: string = stateDefault,
    scopes: string[] = scopesDefault
  ) => {
    const params = {
      scope: scopes.join(" "),
      state,
      redirect_uri: this.redirect_uri,
      response_type: "code",
      client_id: this.client_id,
      prompt: "consent",
      access_type: "offline", // this allows us to get the refresh token
      include_granted_scopes: true,
    };
    return Utils.oAuthLink(urlAuthorize, params);
  };

  callback = async (code: string): Promise<string> => {
    const { access_token } = await this.callbackComplete(code);
    return access_token;
  };

  callbackComplete = async (
    code: string
  ): Promise<{ access_token: string; refresh_token?: string }> => {
    const url = apiHost + "/oauth2/v4/token";

    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      grant_type: "authorization_code",
    };

    return Utils.callbackComplete(url, body);
  };

  getProfile = async (accessToken: string): Promise<Profile> => {
    const url: string =
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";

    const options: any = {
      headers: Utils.oAuthHeaders(accessToken),
      method: "GET",
    };

    try {
      const r = await fetch(url, options);
      const res: GoogleProfile = await r.json();
      return {
        id: res.id,
        email: res.email,
        firstName: res.family_name,
        lastName: res.given_name,
      };
    } catch (err) {
      console.log("error refresh");
      throw err;
    }
  };

  /**
   * get refreshed token
   * note: we reuse the callback function since the interface is the same, it should however be reworked to account for different out types
   * @param refresh_token
   * @returns new access token
   */
  getRefreshedToken = async (refresh_token: string): Promise<string> => {
    const url = apiHost + "/oauth2/v4/token";

    const body = {
      client_secret: this.client_secret,
      client_id: this.client_id,
      refresh_token,
      grant_type: "refresh_token",
    };

    return Utils.callback(url, body);
  };
}

// expected out type when refreshing token
// https://developers.google.com/identity/protocols/oauth2/web-server#httprest_7
export interface RefreshOut {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: "Bearer";
}
