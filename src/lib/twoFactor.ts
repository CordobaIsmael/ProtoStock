import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export function generate2FASecret(username: string) {
  const secret = generateSecret();
  const otpauth = generateURI({
    secret,
    label: username,
    issuer: "ProtoStock SaaS",
  });
  return { secret, otpauth };
}

export async function generateQRCodeDataURL(otpauthUrl: string): Promise<string> {
  return await QRCode.toDataURL(otpauthUrl);
}

export function verify2FAToken(token: string, secret: string): boolean {
  try {
    const cleanToken = token.trim().replace(/\s+/g, "");
    const result = verify({
      token: cleanToken,
      secret,
    });
    if (typeof result === "boolean") return result;
    return (result as any)?.valid === true;
  } catch (error) {
    return false;
  }
}
