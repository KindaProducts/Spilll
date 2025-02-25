import { VercelRequest, VercelResponse } from '@vercel/node';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
  url: 'https://api.mailgun.net',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || 'spillling.com';
const FROM_EMAIL = `noreply@${DOMAIN}`;
const APP_URL = process.env.VERCEL_URL || 'https://spilll.io';

// This should be imported from create-account.ts in a real application
declare const verificationTokens: Map<string, { email: string; password: string }>;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    const userData = verificationTokens.get(token);
    if (!userData) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // In a real application, you would:
    // 1. Create the user in your database
    // 2. Hash the password
    // 3. Set up any necessary user roles/permissions
    // 4. Create a session or JWT token

    // Remove the verification token
    verificationTokens.delete(token);

    // Send welcome email with improved branding and styling
    const emailData = {
      from: FROM_EMAIL,
      to: [userData.email],
      subject: 'Welcome to Spilll! Your Account is Ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Spilll</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9fafb;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 20px;
            }
            .content {
              padding: 30px 20px;
              background-color: #ffffff;
            }
            h1 {
              color: #1e40af;
              margin-top: 0;
              font-size: 24px;
            }
            p {
              margin-bottom: 20px;
              color: #4b5563;
            }
            .button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #2563eb;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
            .steps {
              margin: 30px 0;
              padding: 0;
            }
            .step {
              display: flex;
              align-items: flex-start;
              margin-bottom: 15px;
            }
            .step-number {
              background-color: #3b82f6;
              color: white;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 10px;
              flex-shrink: 0;
            }
            .step-content {
              flex: 1;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${APP_URL}/logo.png" alt="Spilll Logo" class="logo">
              <h1>Welcome to Spilll!</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Your account has been successfully created and verified. You're now ready to start using Spilll's AI-powered preset generator!</p>
              
              <div class="steps">
                <div class="step">
                  <div class="step-number">✓</div>
                  <div class="step-content">
                    <strong>Payment Completed</strong>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">✓</div>
                  <div class="step-content">
                    <strong>Account Created</strong>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">✓</div>
                  <div class="step-content">
                    <strong>Email Verified</strong>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <strong>Access Your Account</strong> - Click the button below to log in
                  </div>
                </div>
              </div>
              
              <p>Click the button below to log in and start creating amazing presets:</p>
              
              <div style="text-align: center;">
                <a href="${APP_URL}/login" class="button">Log In to Your Account</a>
              </div>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@spilll.io.</p>
              
              <p>Best regards,<br>The Spilll Team</p>
            </div>
            <div class="footer">
              <p>© 2023 Spilll. All rights reserved.</p>
              <p>This email was sent to ${userData.email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await mg.messages.create(DOMAIN, emailData);

    return res.status(200).json({
      success: true,
      message: 'Email verified and account created',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify email',
    });
  }
} 