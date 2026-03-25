import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Array of recipient email addresses',
    example: ['recipient@example.com', 'another@example.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  to: string[];

  @ApiProperty({
    description: 'Email subject',
    example: 'Test Email from Graph API',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Email body content',
    example: 'สวัสดีครับ นี่คือข้อความทดสอบจาก NestJS และ Microsoft Graph API',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Array of CC recipient email addresses',
    example: ['cc@example.com'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiProperty({
    description: 'Array of BCC recipient email addresses',
    example: ['bcc@example.com'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];

  @ApiProperty({
    description: 'Whether the email body is HTML format',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isHtml?: boolean;
}
