import * as Utils from "../utils";
import AbstractOAuth from "../abstract";

import * as UU from "./utils";
import * as T from "./type";

export default class SwissId extends AbstractOAuth<T.Profile> {
  host: string;

  constructor(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    host: string = UU.defaultValues.host
  ) {
    super(client_id, client_secret, redirect_uri);

    this.host = host;
  }

  callback = async (code: string): Promise<string> => {
    const body = {
      grant_type: "authorization_code",
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
    };

    const url = this.host + "/access_token";

    return Utils.callback(url, body);
  };

  getParams = (paramsInput: Partial<T.InputParams> = {}) => ({
    client_id: this.client_id,
    redirect_uri: this.redirect_uri,
    ui_locales: paramsInput.ui_locales || UU.defaultValues.locales,
    nonce: paramsInput.nonce || Utils.generateNonce(),
    scope: paramsInput.scope || UU.defaultValues.scope,
    response_type: "code",
    acr_values: "loa-1",
    state: paramsInput.state,
  });

  oAuthUrl = (state?: string): string => {
    const params = this.getParams({ state });
    const url = this.host + "/authorize";
    return Utils.oAuthLink(url, params);
  };

  getProfile = async (token: string): Promise<T.Profile> => {
    const url = this.host + "/userinfo";

    return UU.getProfile(url, token);
  };
}
