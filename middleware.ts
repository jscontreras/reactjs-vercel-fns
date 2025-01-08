import { createRemoteJWKSet, jwtVerify } from 'jose';

// Define constants for audience and required scope
const AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN || '';
const JWKS_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const AUDIENCE = process.env.VITE_AUTH0_AUDIENCE || '';
const ISSUER = `https://${AUTH0_DOMAIN}/`; // Auth0 issuer


// Helper function that validates Auth0 token
async function validateToken(token: string) {
  if (!token) {
    return new Response(JSON.stringify({ message: "Token is missing" }), { status: 401 });
  }
  try {
    // Create a JWKS client
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['RS256'], // Ensure RS256 is used
    });
    return payload;
  }
  catch (error) {
    console.error(error.message);
    return new Response(JSON.stringify({ message: error.message}), { status: 401 });
  };
}

export default async function middleware(request: Request) {
  console.log('Middleware: Incoming request!');
  console.log(request.url)
  if (request.url.includes('/api/nodejs/hello-auth')) {
    console.log('Middleware: Validating Auth')
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || ""; // Extract the Bearer token
    // Validate token
    await validateToken(token);
  }
}

export const config = {
  matcher: ['/api/:path*']
};
