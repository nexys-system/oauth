import * as T from "./type";
import JWT from "jsonwebtoken";

export const defaultValues = {
  locales: "de",
  scope: "openid profile",
  host: "https://login.sandbox.pre.swissid.ch/idp/oauth2",
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
    gender,
    language: locale,
  } = JWT.decode(t) as T.JWTContent;

  return { id, firstName, lastName, locale, gender };
};
