import * as Utils from "./utils.js";
import AbstractOAuth from "./abstract.js";

export type Profile = { id: string; login: string };

const host = "https://gitlab.com/oauth";
const urlAuthorize: string = host + "/authorize";
const urlToken: string = host + "/token";

export default class Gitlab extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "authorization_code",
      redirect_uri: this.redirect_uri,
    };

    return Utils.callback(urlToken, body);
  };

  oAuthUrl = () => {
    const params = {
      client_id: this.client_id,
      redirect_uri: this.client_secret,
    };

    return Utils.oAuthLink(urlAuthorize, params);
  };

  getProfile = async (_token: string): Promise<Profile> => {
    return { id: "1", login: "todo" };
  };
}
