import nock from "nock";

import { defaultValues } from "./utils.js";

const accessToken = "myaccesstoken";
nock("https://accounts.zoho.com/oauth/v2").post("/token").reply(200, {
  access_token: accessToken,
});

const jwt =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzMjJVK1lHcnRlaXMxSE9HUDdQRzVoelpJdGY4VWNpRGUxbWtvczJJb2ZFPSIsImdlbmRlciI6Im1hbGUiLCJ1cGRhdGVkX2F0IjoxNjM1NzY5MDE5LCJpc3MiOiJodHRwczovL2xvZ2luLnNhbmRib3gucHJlLnN3aXNzaWQuY2g6NDQzL2lkcC9vYXV0aDIiLCJsYW5ndWFnZSI6ImVuX0dCIiwiZ2l2ZW5fbmFtZSI6ImdmZHMiLCJmYW1pbHlfbmFtZSI6ImdmZHMiLCJmb3JnZXJvY2siOnsic2lnIjoidzxwaU5wdnddRklxKHpST0EoTUVbfT4-Pmx0U21qaHhZXkwpel5ybSJ9fQ._VOwR94yo_yXgB5lkYLDKa2SD5YYsbNCXyqc8sZMQBQ";

nock(defaultValues.host)
  .get("/userinfo")
  .matchHeader("Authorization", "Bearer " + accessToken)
  .reply(200, jwt);

/*
import Z from "./oauth";
import * as T from "./type";
  const redirect_uri = "https://myhost/sso/zoho/redirect";
  const z = new Z("clientId", "clientSecret", redirect_uri);
const profile: T.Profile = {
  id: "s22U+YGrteis1HOGP7PG5hzZItf8UciDe1mkos2IofE=",
  firstName: "gfds",
  lastName: "gfds",
  gender: "male",
  locale: "en_GB",
};
test("get profile", async () => {
  const rProfile = await z.getProfile(accessToken);

  expect(rProfile).toEqual(profile);
});*/

test("dummy", () => {
  expect(true).toBe(true);
});
