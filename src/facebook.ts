// never tested
import AbstractOAuth from "./abstract.js";

export interface FacebookProfile {
  id: string;
  name: string;
  email?: string;
}

const host = "https://www.facebook.com";
const graphApiHost = "https://graph.facebook.com";

class Facebook extends AbstractOAuth<FacebookProfile> {
  oAuthUrl = (
    state?: string | undefined,
    scopes?: string[] | undefined
  ): string => {
    const scope = (scopes || []).join(" ");
    const response_type = "code";
    const params: { [k: string]: string } = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      scope,
      response_type,
      auth_type: "rerequest",
    };

    if (state) {
      params["state"] = state;
    }

    const paramsString = Object.entries(params)
      .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
      .join("&");

    const path = "/v13.0/dialog/oauth";

    return host + path + "?" + paramsString;
  };

  getToken = async (
    code: string
  ): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> => {
    const params = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      grant_type: "authorization_code",
    };

    const paramsString = Object.entries(params)
      .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
      .join("&");

    const path = "/v13.0/oauth/access_token";
    const url = graphApiHost + path + "?" + paramsString;
    const response = await fetch(url, { method: "GET" });

    return response.json();
  };

  callback = async (code: string): Promise<string> => {
    const tokenResponse = await this.getToken(code);
    return tokenResponse.access_token;
  };

  getProfile = async (access_token: string): Promise<FacebookProfile> => {
    const url = `${graphApiHost}/me?fields=id,name,email&access_token=${access_token}`;
    const response = await fetch(url, { method: "GET" });
    return response.json();
  };
}

export default Facebook;
