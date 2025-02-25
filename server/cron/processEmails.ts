import { CronJob } from 'cron';
import { EmailCampaignManager } from '../services/emailCampaign';

const emailManager = new EmailCampaignManager();

// Run every 5 minutes
const job = new CronJob('*/5 * * * *', async () => {
  console.log('Processing scheduled emails...');
  try {
    await emailManager.processScheduledEmails();
    console.log('Finished processing scheduled emails');
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
  }
});

export function startEmailProcessor() {
  job.start();
  console.log('Email processor started');
} 