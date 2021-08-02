import fetch from "node-fetch";
import * as FT from "node-fetch";

export interface OAuthHeaders {
  Authorization: string;
}

// turn into Class

/**
 * buidl redirect uri with extra query parameters (e.g instance)
 * @param url
 * @param extra
 */
export const getUriRedirect = (
  url: string,
  extra: { [k: string]: string }
): string => {
  const extraArray = Object.entries(extra);

  if (extraArray.length === 0) {
    return url;
  }

  return (
    url + "?" + extraArray.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
  );
};

export const oAuthLink = (
  host: string,
  params: { [k: string]: string | boolean | number }
): string => {
  const p: string = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return host + "?" + p;
};

export const callback = async (url: string, data: Object): Promise<string> => {
  //const body = JSON.stringify(data);
  const body = Object.entries(data)
    .map(([k, v]) => k + "=" + encodeURIComponent(v))
    .join("&");
  const options = {
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" }, // "application/json" },
    method: "POST",
  };

  try {
    const r = await fetch(url, options);

    if (r.headers.get("content-type")?.includes("application/json")) {
      const { access_token } = await r.json();
      return access_token;
    }

    //console.log(await r.text());
    const response = await r.text();

    // console.log(r.headers.get("content-type"));

    // console.info(response);

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
    throw Error(err);
  }
};

export const oAuthHeaders = (accessToken: string): FT.HeaderInit => ({
  "content-type": "application/json",
  Authorization: "Bearer " + accessToken,
});
