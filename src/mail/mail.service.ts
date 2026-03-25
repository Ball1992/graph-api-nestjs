import { Injectable, Logger } from '@nestjs/common';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { getEnvironmentConfig } from '../config/environment.config';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private graphClient: Client;
  private config = getEnvironmentConfig();

  constructor() {
    this.initializeGraphClient();
  }

  private initializeGraphClient() {
    try {
      const credential = new ClientSecretCredential(
        this.config.tenantId,
        this.config.clientId,
        this.config.clientSecret,
      );

      const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
      });

      this.graphClient = Client.initWithMiddleware({
        authProvider,
      });

      this.logger.log('Graph API client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Graph API client', error);
      throw error;
    }
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<any> {
    try {
      this.logger.log(`Sending email to: ${sendEmailDto.to.join(', ')}`);

      const message = {
        message: {
          subject: sendEmailDto.subject,
          body: {
            contentType: sendEmailDto.isHtml ? 'HTML' : 'Text',
            content: sendEmailDto.body,
          },
          toRecipients: sendEmailDto.to.map((email) => ({
            emailAddress: {
              address: email,
            },
          })),
          ...(sendEmailDto.cc && sendEmailDto.cc.length > 0
            ? {
                ccRecipients: sendEmailDto.cc.map((email) => ({
                  emailAddress: {
                    address: email,
                  },
                })),
              }
            : {}),
          ...(sendEmailDto.bcc && sendEmailDto.bcc.length > 0
            ? {
                bccRecipients: sendEmailDto.bcc.map((email) => ({
                  emailAddress: {
                    address: email,
                  },
                })),
              }
            : {}),
        },
        saveToSentItems: true,
      };

      // Send email from the target group
      await this.graphClient
        .api(`/users/${this.config.targetGroup}/sendMail`)
        .post(message);

      this.logger.log('Email sent successfully');
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendEmailWithAttachment(
    sendEmailDto: SendEmailDto,
    attachments?: Array<{ name: string; contentBytes: string; contentType: string }>,
  ): Promise<any> {
    try {
      this.logger.log(`Sending email with attachments to: ${sendEmailDto.to.join(', ')}`);

      const message = {
        message: {
          subject: sendEmailDto.subject,
          body: {
            contentType: sendEmailDto.isHtml ? 'HTML' : 'Text',
            content: sendEmailDto.body,
          },
          toRecipients: sendEmailDto.to.map((email) => ({
            emailAddress: {
              address: email,
            },
          })),
          ...(sendEmailDto.cc && sendEmailDto.cc.length > 0
            ? {
                ccRecipients: sendEmailDto.cc.map((email) => ({
                  emailAddress: {
                    address: email,
                  },
                })),
              }
            : {}),
          ...(sendEmailDto.bcc && sendEmailDto.bcc.length > 0
            ? {
                bccRecipients: sendEmailDto.bcc.map((email) => ({
                  emailAddress: {
                    address: email,
                  },
                })),
              }
            : {}),
          ...(attachments && attachments.length > 0
            ? {
                attachments: attachments.map((attachment) => ({
                  '@odata.type': '#microsoft.graph.fileAttachment',
                  name: attachment.name,
                  contentBytes: attachment.contentBytes,
                  contentType: attachment.contentType,
                })),
              }
            : {}),
        },
        saveToSentItems: true,
      };

      await this.graphClient
        .api(`/users/${this.config.targetGroup}/sendMail`)
        .post(message);

      this.logger.log('Email with attachments sent successfully');
      return {
        success: true,
        message: 'Email with attachments sent successfully',
      };
    } catch (error) {
      this.logger.error('Failed to send email with attachments', error);
      throw error;
    }
  }
}
