interface EmailResponse {
  success: boolean;
  error?: string;
}

interface ContactFormData {
  name: string;
  subject: string;
  message: string;
}

export const sendEmail = async (
  email: string,
  type: 'welcome' | 'contact',
  data?: ContactFormData
): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        templateName: type,
        data: type === 'contact' ? data : undefined,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to send email');
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

export const startDripCampaign = async (email: string) => {
  // TODO: Implement drip campaign logic using Mailgun's campaigns feature
  // This would include scheduling follow-up emails, tracking opens/clicks, etc.
}; 