import { json } from '@vercel/edge';

export const config = { runtime: 'edge' };

export default function handler() {
  console.log('Vercel function API endpoint (edge)!');
  return json({message: "Hello World From Vercel Function (edge)"});
}
