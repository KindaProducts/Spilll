import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the order_id from the query parameters
  const { order_id } = req.query;
  
  // Redirect to the success page with the order_id
  const redirectUrl = order_id 
    ? `/success?order_id=${order_id}` 
    : '/success';
    
  return res.redirect(302, redirectUrl);
} 