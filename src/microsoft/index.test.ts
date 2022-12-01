// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
import M from "./index";

const clientId = "myclientId";
const clientSecret = "clientSecret";
const redirectUrl = "https://myapp.com/redirect";

const m = new M(clientId, clientSecret, redirectUrl);

test("url", () => {
  expect(m.oAuthUrl()).toBe(
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=myclientId&scope=user.read&response_type=code&redirect_uri=https%3A%2F%2Fmyapp.com%2Fredirect"
  );
  expect(m.oAuthUrl(JSON.stringify({ instance: "mine" }))).toBe(
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=myclientId&scope=user.read&response_type=code&redirect_uri=https%3A%2F%2Fmyapp.com%2Fredirect&state=%7B%22instance%22%3A%22mine%22%7D"
  );
});
