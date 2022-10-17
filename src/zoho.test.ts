import Z, { Profile } from "./zoho";
import nock from "nock";

const redirect_uri = "https://myhost/sso/zoho/redirect";

const z = new Z("clientId", "clientSecret", redirect_uri);

const accessToken = "myaccesstoken";
nock("https://accounts.zoho.com/oauth/v2").post("/token").reply(200, {
  access_token: accessToken,
});

const profile: Profile = {
  First_Name: "John",
  Email: "johan@mydomain.com",
  Last_Name: "Doe",
  Display_Name: "John",
  ZUID: 111222,
};

nock("https://accounts.zoho.com")
  .get("/oauth/user/info")
  .matchHeader("Authorization", "Zoho-oauthtoken " + accessToken)
  .reply(200, profile);

test("redirect url", () => {
  const url = z.oAuthUrl();

  expect(url).toEqual(
    "https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read&response_type=code&prompt=consent&access_type=offline&client_id=clientId&redirect_uri=https%3A%2F%2Fmyhost%2Fsso%2Fzoho%2Fredirect"
  );
});

// mock does not work with native fetch
/*
test("get access token", async () => {
  const code = "mycode";

  const r = await z.callback(code);

  expect(r).toEqual(accessToken);
});


test("get profile", async () => {
  const profile = await z.getProfile(accessToken);

  expect(profile).toEqual(profile);
});*/
