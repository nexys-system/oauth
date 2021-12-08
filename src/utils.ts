import fetch from "node-fetch";
import * as FT from "node-fetch";
import crypto from "crypto";

export interface OAuthHeaders {
  Authorization: string;
}
const isUndefined = (a: any): a is undefined => a === undefined;

const paramsToQueryString = (
  params:
    | Object
    | {
        [k: string]: string | boolean | number | undefined;
      }
): string => {
  const arr = Object.entries(params);

  if (arr.length === 0) {
    return "";
  }

  return arr
    .filter(([_k, v]) => !isUndefined(v))
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
};

// turn into Class

/**
 * buidl redirect uri with extra query parameters (e.g instance)
 * @param url
 * @param extra
 */
export const getUriRedirect = (
  url: string,
  extra: { [k: string]: string }
): string => url + "?" + paramsToQueryString(extra);

export const oAuthLink = (
  host: string,
  params: { [k: string]: string | boolean | number | undefined }
): string => host + "?" + paramsToQueryString(params);

export const callback = async (url: string, data: Object): Promise<string> => {
  //const body = JSON.stringify(data);
  const body = paramsToQueryString(data);
  const options = {
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" }, // "application/json" },
    method: "POST",
  };

  try {
    const r = await fetch(url, options);

    if (!r.ok) {
      const t = await r.text();
      throw Error("request failed: " + t);
    }

    if (r.headers.get("content-type")?.includes("application/json")) {
      const { access_token } = await r.json();
      return access_token;
    }

    const response = await r.text();

    const a = response
      .split("&")
      .map((x) => x.split("="))
      .find(([k]) => {
        return k === "access_token";
      });

    if (!a) {
      throw Error("could not find access token");
    }

    return a[1];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const oAuthHeaders = (accessToken: string): FT.HeaderInit => ({
  "content-type": "application/json",
  Authorization: "Bearer " + accessToken,
});

/**
 * @see https://stackoverflow.com/a/50089071/1659569
 * @returns
 */
export const generateNonce = (): string =>
  crypto.randomBytes(16).toString("base64");
