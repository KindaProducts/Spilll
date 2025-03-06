import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// Test user credentials
const TEST_USER = {
  email: 'test@spillling.com',
  password: 'testuser123',
};

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = 'test-secret-key-123';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Received login request:', {
    method: req.method,
    body: req.body,
    headers: req.headers,
  });

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('Validating credentials:', { email, password });

    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Validate test user credentials
    const isValidEmail = email === TEST_USER.email;
    const isValidPassword = password === TEST_USER.password;
    console.log('Credential validation:', { isValidEmail, isValidPassword });

    if (isValidEmail && isValidPassword) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          email: TEST_USER.email,
          role: 'test_user',
          isSubscribed: true
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Login successful, generating token');
      return res.status(200).json({
        success: true,
        token,
        user: {
          email: TEST_USER.email,
          role: 'test_user',
          isSubscribed: true
        }
      });
    }

    console.log('Invalid credentials provided');
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to log in'
    });
  }
} 