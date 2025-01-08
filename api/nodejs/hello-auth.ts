import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Define constants for audience and required scope
const auth0Domain = process.env.VITE_AUTH0_DOMAIN || '';
const auth0Audience = process.env.VITE_AUTH0_AUDIENCE || '';
const auth0Scope = process.env.VITE_AUTH0_SCOPE || '';

// Create a JWKS client to fetch signing keys
const client = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`, // Replace with your JWKS URI
});

// Helper function to get the signing key
async function getSigningKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(" ")[1] || ""; // Extract the Bearer token

    if (!token) {
      throw new Error("Token is missing");
    }

    // Decode the token without verifying to extract header information
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token format");
    }

    const { kid } = decodedHeader.header; // Get Key ID (kid)
    if (!kid) {
      throw new Error("Token header missing 'kid'");
    }

    // Fetch the signing key using the kid
    const signingKey = await getSigningKey(kid);

    // Verify the token's signature and decode it
    const decodedToken = jwt.verify(token, signingKey) as JwtPayload;

    // Validate audience
    if (!decodedToken.aud?.includes(auth0Audience)) {
      throw new Error("Invalid audience");
    }

    // // Validate scopes
    const scopes = decodedToken.scope?.split(" ") || [];
    if (auth0Scope.split(" ").some((scope) => !scopes.includes(scope))) {
      throw new Error("Insufficient scope");
    }

    // Get info from AUTH0
    const userDetails = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }});

    const {name} = await userDetails.json() as any;

    // If all checks pass, return success response
    return response.status(200).json({ message: `Hello ${name}! (via OAUTH protected Vercel Function)`, claims: decodedToken });
  } catch (error: any) {
    return response.status(401).json({ message: error.message });
  }
}