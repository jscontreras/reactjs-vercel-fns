import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (request: VercelRequest, response: VercelResponse) {
  console.log('Vercel function API endpoint (nodejs)!')
  return response.json({ message: "Hello World From Vercel Function (nodejs)" });
}
