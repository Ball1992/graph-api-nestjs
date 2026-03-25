import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send email',
    description: 'Send an email using Microsoft Graph API. Supports plain text and HTML formats, with optional CC and BCC recipients.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Email sent successfully',
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid email data',
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to send email',
  })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return await this.mailService.sendEmail(sendEmailDto);
  }

  @Post('send-with-attachment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send email with attachments',
    description: 'Send an email with file attachments using Microsoft Graph API. Attachments must be base64 encoded.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        emailData: {
          type: 'object',
          properties: {
            to: {
              type: 'array',
              items: { type: 'string' },
              example: ['recipient@example.com'],
            },
            subject: {
              type: 'string',
              example: 'Email with Attachment',
            },
            body: {
              type: 'string',
              example: 'กรุณาดูไฟล์แนบด้านล่าง',
            },
            isHtml: {
              type: 'boolean',
              example: false,
            },
            cc: {
              type: 'array',
              items: { type: 'string' },
            },
            bcc: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'example.txt',
              },
              contentBytes: {
                type: 'string',
                description: 'Base64 encoded file content',
                example: 'SGVsbG8gV29ybGQh',
              },
              contentType: {
                type: 'string',
                example: 'text/plain',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email with attachments sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Email with attachments sent successfully',
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid email data or attachments',
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to send email',
  })
  async sendEmailWithAttachment(
    @Body() body: { emailData: SendEmailDto; attachments?: Array<{ name: string; contentBytes: string; contentType: string }> },
  ) {
    return await this.mailService.sendEmailWithAttachment(body.emailData, body.attachments);
  }
}
