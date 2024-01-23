import AbstractOAuth from "./abstract.js";

export interface Profile {
  username: string;
}
const host = "https://api.instagram.com";

class Instagram extends AbstractOAuth<Profile> {
  oAuthUrl = (
    state?: string | undefined,
    scopes?: string[] | undefined
  ): string => {
    const scope = (scopes || []).join(",");
    const response_type = "code";
    const params = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      scope,
      response_type,
    };

    if (state) {
      (params as any)["state"] = state;
    }

    const paramsString = Object.entries(params)
      .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
      .join("&");

    const path = "/oauth/authorize";

    return host + path + "?" + paramsString;
  };

  getToken = async (
    code: string
  ): Promise<{ access_token: string; user_id: string }> => {
    const grant_type = "authorization_code";
    const params = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      grant_type,
    };
    const paramsString = Object.entries(params)
      .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
      .join("&");

    const path = "/oauth/access_token";
    const url = host + path;
    const method = "POST";
    const headers = { "content-type": "application/x-www-form-urlencoded" };

    const response = await fetch(url, { method, body: paramsString, headers });

    return response.json();
  };

  callback = async (code: string): Promise<string> => {
    const token = await this.getToken(code);
    // const ssoprofile = await getUserInfo(token.user_id, token.access_token);

    return token.access_token;
  };

  getProfile = async (
    access_token: string,
    user_id: string = "me"
  ): Promise<Profile> => {
    const fields = ["id", "username", "profile_picture_url"];
    const url = `https://graph.instagram.com/${user_id}?fields=${fields.join(
      ","
    )}&access_token=${access_token}`;
    const response = await fetch(url, { method: "GET" });
    return response.json();
  };
}

export const getPublicInfo = async (
  username: string
): Promise<{
  graphql: { user: { profile_pic_url_hd: string; profile_pic_url: string } };
}> => {
  const url = `https://www.instagram.com/${username}/?__a=1&__d=1`;
  const response = await fetch(url);

  return response.json();
};

export default Instagram;
