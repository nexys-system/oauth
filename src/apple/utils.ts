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
