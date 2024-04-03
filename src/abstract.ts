export default abstract class OAuth2<Profile, CallbackResponse = string> {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];

  constructor(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    scopes: string[] = []
  ) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
    this.scopes = scopes;
  }

  abstract callback(code: string): Promise<CallbackResponse>;

  abstract oAuthUrl(state?: string, scopes?: string[]): string;

  abstract getProfile(token: string): Promise<Profile>;
}
