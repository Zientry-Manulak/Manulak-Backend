import crypto from "crypto";

export const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};