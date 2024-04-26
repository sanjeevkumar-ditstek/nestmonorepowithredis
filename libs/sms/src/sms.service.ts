import { TemplatesService } from '@lib/templates';
import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SmsService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async sendSMS(email: string, otp: number) {
    const html = new TemplatesService().otpTemplate(otp);
    try {
      const mail = {
        to: email,
        subject: 'Nest js tesing',
        from: process.env.SENDGRID_EMAIL, // Fill it with your validated email on SendGrid account
        text: 'Sendgrid',
        html,
      };
      await SendGrid.send(mail);
    } catch (error) {
      console.log('SendGrid Error', error);
    }
  }
}
