# Spilll - AI-Powered Lightroom Preset Generator

A modern web application that generates custom Lightroom presets using AI technology.

## Features

- Landing page with free preset pack offer
- Email collection and drip campaign
- Subscription-based access to preset generator
- Drag-and-drop image upload
- AI-powered preset generation
- Export to Lightroom-compatible format

## Tech Stack

- Frontend: React.js with TypeScript
- Styling: Tailwind CSS
- Authentication: Firebase
- Payment Processing: Stripe
- Email Marketing: SendGrid
- Hosting: Vercel
- Storage: AWS S3

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spilll.git
cd spilll
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_AWS_REGION=your_aws_region
REACT_APP_S3_BUCKET=your_s3_bucket
```

4. Start the development server:
```bash
npm start
```

## Deployment

### Vercel Setup

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
vercel link
```

4. Add environment variables to Vercel:
```bash
vercel env add
```

5. Deploy:
```bash
vercel --prod
```

### GitHub Actions Setup

1. Go to your GitHub repository settings
2. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID

The deployment will automatically trigger on push to the main branch.

## Apple Design Guidelines

The UI follows Apple's design principles:

- Rounded corners (border-radius: 12px)
- Clear visual hierarchy
- Generous padding and spacing
- Smooth transitions and animations
- Clear feedback states
- Native-feeling interactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information. 