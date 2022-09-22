import * as T from "./type";
import JWT from "jsonwebtoken";

export const defaultValues = {
  locales: "de",
  scope: "openid profile email",
  host: "https://login.sandbox.pre.swissid.ch/idp/oauth2",
};

export const callback = async (
  code: string,
  host: string,
  redirect_uri: string,
  client: string,
  secret: string
): Promise<{
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
}> => {
  const url = host + "/access_token";
  const pbody = {
    grant_type: "authorization_code",
    code,
    redirect_uri,
  };

  const body = Object.entries(pbody)
    .map(([k, v]) => [k, v].join("="))
    .join("&");

  const Authorization: string =
    "Basic " + Buffer.from(client + ":" + secret).toString("base64");

  const options = {
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization,
    },
    method: "POST",
  };

  const response = await fetch(url, options);
  if (response.status !== 200) {
    throw Error("something went wrong, callback" + (await response.text()));
  }

  return response.json();
};

export const getProfile = async (
  url: string,
  token: string
): Promise<T.Profile> => {
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

  if (!r.ok) {
    throw Error("unsuccesful call: " + t);
  }

  // decode the JWT and map to internal structure
  const {
    sub: id,
    given_name: firstName,
    family_name: lastName,
    email,
    gender,
    language: locale,
  } = JWT.decode(t) as T.JWTContent;

  return { id, firstName, lastName, locale, gender, email };
};
