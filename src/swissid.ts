import fetch from "node-fetch";
import * as Utils from "./utils";
import AbstractOAuth from "./abstract";
import JWT from "jsonwebtoken";

export interface Profile {
  firstName: string;
  lastName: string;
  gender: string;
  locale: string;
}

// this is the shape of the JWT returned by the userinfo endpoint
interface JWTContent {
  given_name: string;
  family_name: string;
  language: string;
  gender: string;
}

interface InputParams {
  scope: string;
  ui_locales: string;
  state: string;
  nonce: string;
}

const host = "https://login.sandbox.pre.swissid.ch/idp/oauth2";

const urlAuthorize: string = host + "/authorize";
const urlToken: string = host + "/access_token";

const localesDefault = "de";
const scopeDefault = "openid profile";

export default class SwissId extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      grant_type: "authorization_code",
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
    };

    return Utils.callback(urlToken, body);
  };

  getParams = (paramsInput: Partial<InputParams> = {}) => {
    const params = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      response_type: "code",
      acr_values: "loa-1",
      ui_locales: paramsInput.ui_locales || localesDefault,
      nonce: paramsInput.nonce || Utils.generateNonce(),
      scope: paramsInput.scope || scopeDefault,
      state: paramsInput.state,
    };

    return params;
  };

  oAuthUrl = (state?: string): string => {
    const params = this.getParams({ state });
    return Utils.oAuthLink(urlAuthorize, params);
  };

  getProfile = async (token: string): Promise<Profile> => {
    const url = host + "/userinfo";
    const headers = {
      Authorization: "Bearer " + token,
    };
    const options = {
      method: "GET",
      headers,
    };

    const r = await fetch(url, options);
    // this returns a JWT
    const t = await r.text();

    // decode the JWT and map to internal structure
    const {
      given_name: firstName,
      family_name: lastName,
      gender,
      language: locale,
    } = JWT.decode(t) as JWTContent;

    return {
      firstName,
      lastName,
      locale,
      gender,
    };
  };
}
