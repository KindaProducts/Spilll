declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MAILGUN_API_KEY: string;
      MAILGUN_DOMAIN: string;
      VERCEL_URL: string;
      SUPPORT_EMAIL: string;
    }
  }
}

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

interface EmailTemplate {
  subject: string;
  html: string;
}

const templates = {
  welcome: (name: string): EmailTemplate => ({
    subject: 'Welcome to Spilll - Your Free Presets Are Here!',
    html: `
      <h1>Welcome to Spilll!</h1>
      <p>Thank you for joining us! Here are your 10 free AI-generated Lightroom presets.</p>
      <p><a href="${process.env.VERCEL_URL}/download-presets" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block;">Download Your Presets</a></p>
      <p>These presets are just the beginning. With a Spilll subscription, you can:</p>
      <ul>
        <li>Generate unlimited custom presets</li>
        <li>Access advanced AI features</li>
        <li>Get priority support</li>
      </ul>
      <p>Ready to take your photography to the next level?</p>
      <p><a href="${process.env.VERCEL_URL}/subscribe" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block;">Subscribe Now</a></p>
    `,
  }),

  subscriptionConfirmation: (name: string): EmailTemplate => ({
    subject: 'Welcome to Spilll Premium!',
    html: `
      <h1>Thank You for Subscribing to Spilll!</h1>
      <p>We're excited to have you on board! You now have unlimited access to our AI-powered preset generator.</p>
      <p><a href="${process.env.VERCEL_URL}/dashboard" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block;">Start Creating Presets</a></p>
      <p>Here's what you can do now:</p>
      <ul>
        <li>Generate unlimited custom presets</li>
        <li>Access advanced AI features</li>
        <li>Get priority support</li>
      </ul>
      <p>Need help getting started? Check out our <a href="${process.env.VERCEL_URL}/guides">guides</a> or contact our support team.</p>
    `,
  }),

  contact: (data: { name: string; subject: string; message: string }): EmailTemplate => ({
    subject: `[Contact Form] ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
    `,
  }),
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, templateName, name = '', data = {} } = req.body;

  if (!to || !templateName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!templates[templateName as keyof typeof templates]) {
    return res.status(400).json({ error: 'Invalid template name' });
  }

  try {
    const template = templates[templateName as keyof typeof templates](
      templateName === 'contact' ? data : name
    );
    
    const emailData = {
      from: FROM_EMAIL,
      to: templateName === 'contact' ? process.env.SUPPORT_EMAIL : [to],
      subject: template.subject,
      html: template.html,
      ...(templateName === 'contact' && {
        'h:Reply-To': to
      })
    };

    const response = await mg.messages.create(DOMAIN, emailData);
    return res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
} 