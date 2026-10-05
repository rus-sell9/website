#!/usr/bin/env node
/**
 * Generate ACCESS_CODE_HASH, TOTP_SECRET, SESSION_SECRET for Vercel env vars.
 * Also prints a QR code you can scan with Google Authenticator / Authy.
 *
 * Usage:
 *   node scripts/generate-auth.mjs
 *   node scripts/generate-auth.mjs "your-access-code-here"
 */
import { randomBytes, scryptSync } from "node:crypto";
import { authenticator } from "otplib";
import qrcode from "qrcode";

const accessCode = process.argv[2] || randomBytes(9).toString("base64url");
const salt = randomBytes(16);
const hash = scryptSync(accessCode, salt, 64);
const accessCodeHash = `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;

const totpSecret = authenticator.generateSecret();
const sessionSecret = randomBytes(48).toString("base64url");

const issuer = "SL Cleaning Admin";
const account = "admin@slcleaningservices.online";
const otpauth = authenticator.keyuri(account, issuer, totpSecret);

console.log("\n=== Copy these into Vercel → Project → Settings → Environment Variables ===\n");
console.log(`ACCESS_CODE_HASH=${accessCodeHash}`);
console.log(`TOTP_SECRET=${totpSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log("\n(Also set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID yourself.)");
console.log("\n=== Your access code (store offline — never in the repo) ===\n");
console.log(accessCode);
console.log("\n=== Scan this QR with Google Authenticator / Authy ===\n");
console.log(otpauth);
console.log("");

const ascii = await qrcode.toString(otpauth, { type: "terminal", small: true });
console.log(ascii);
console.log("\nDone. Keep the access code and authenticator app safe.\n");
