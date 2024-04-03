import AbstractOAuth from "../abstract.js";
import { paramsToQueryString } from "../utils.js";
import { secretFromPrivateKey } from "./utils.js";

interface AppleProfile {
  name: string;
  email: string;
  sub: string; // unique user id
  email_verified: boolean;
}

const urlPrefix = "https://appleid.apple.com/auth";

class AppleSSOClient extends AbstractOAuth<
  AppleProfile,
  { access_token: string; id_token: string }
> {
  constructor(
    clientId: string,
    teamId: string,
    keyId: string,
    privateKey: string,
    redirectUrl: string
  ) {
    const client_secret = secretFromPrivateKey({
      clientId,
      keyId,
      teamId,
      privateKey,
    });

    super(clientId, client_secret, redirectUrl);
  }

  oAuthUrl = (
    state: string | undefined = undefined,
    scopes = ["name", "email"]
  ) => {
    const params = {
      response_type: "code",
      response_mode: "form_post",
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      scope: scopes.join(" "),
      state,
    };

    return urlPrefix + "/authorize?" + paramsToQueryString(params);
  };

  callback = async (
    code: string
  ): Promise<{ access_token: string; id_token: string }> => {
    const formData = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirect_uri,
    };

    const url = urlPrefix + "/token";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paramsToQueryString(formData),
    });

    if (response.ok) {
      const r = await response.json();
      return r;
      // const accessToken = data.access_token;
      // console.log("Access Token:", accessToken);
      // Use the access token to call Apple's APIs for user information
    } else {
      console.error("Error:", response.status, response.statusText);
      throw Error(`"Error:", ${response.status}, ${response.statusText}`);
    }
  };

  getProfile = async (token: string) => {
    const url = "https://appleid.apple.com/openid/userinfo"; // urlPrefix + "/userInfo";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return response.json();

      // Handle the user information as needed
    } else {
      console.error("Error:", response.status, response.statusText);
      throw Error(`"Error:", ${response.status}, ${response.statusText}`);
    }
  };
}

export default AppleSSOClient;
