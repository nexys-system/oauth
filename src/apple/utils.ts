import jwt from "jsonwebtoken";

export const secretFromPrivateKey = ({
  clientId,
  keyId,
  teamId,
  privateKey,
}: {
  clientId: string;
  keyId: string;
  teamId: string;
  privateKey: string;
}): string => {
  const now = Math.round(new Date().getTime() / 1000);
  const header = {
    alg: "ES256",
    kid: keyId,
  };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 180,
    aud: "https://appleid.apple.com",
    sub: clientId,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    header,
  });
};

export const toSecretb64 = (
  teamId: string,
  keyId: string,
  privateKey: string
): string => {
  const secret = [teamId, keyId, privateKey].join("**");
  return Buffer.from(secret).toString("base64");
};

export const fromSecretB64 = (secretb64: string) => {
  const [teamId, keyId, privateKey] = Buffer.from(secretb64, "base64")
    .toString("ascii")
    .split("**");

  return { teamId, keyId, privateKey };
};
