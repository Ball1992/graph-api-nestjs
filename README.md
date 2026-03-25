# Microsoft Graph API - Send Email with NestJS

โปรแกรมตัวอย่างการส่งเมลผ่าน Microsoft Graph API โดยใช้ NestJS

## การติดตั้ง

```bash
npm install
```

## การตั้งค่า

ข้อมูลการเชื่อมต่อ Microsoft Graph API ถูกเก็บไว้ในไฟล์ `.env`:

```env
# Microsoft Graph API Credentials
CLIENT_ID=
TENANT_ID=
CLIENT_SECRET=
TARGET_GROUP=EMAIL_ADDRESS_OF_TARGET_GROUP
PORT=3000
```

## การรันโปรแกรม

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

แอปพลิเคชันจะรันที่ `http://localhost:3000`

## Swagger API Documentation

เข้าถึง Swagger UI สำหรับ interactive API documentation ที่:
```
http://localhost:3000/api
```

Swagger UI ให้คุณ:
- 📖 ดูรายละเอียด API endpoints ทั้งหมด
- 🧪 ทดสอบ API โดยตรงจากเบราว์เซอร์
- 📋 ดูตัวอย่าง request/response
- 🔍 ตรวจสอบ schema และ validation rules

## API Endpoints

### 1. ส่งอีเมลทั่วไป

**Endpoint:** `POST http://localhost:3000/mail/send`

**Request Body:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Test Email from Graph API",
  "body": "นี่คือข้อความทดสอบจาก NestJS และ Microsoft Graph API",
  "isHtml": false
}
```

**ตัวอย่างการส่งอีเมล HTML:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "HTML Email Test",
  "body": "<h1>สวัสดีครับ</h1><p>นี่คือข้อความ <strong>HTML</strong></p>",
  "isHtml": true,
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

### 2. ส่งอีเมลพร้อมไฟล์แนบ

**Endpoint:** `POST http://localhost:3000/mail/send-with-attachment`

**Request Body:**
```json
{
  "emailData": {
    "to": ["recipient@example.com"],
    "subject": "Email with Attachment",
    "body": "กรุณาดูไฟล์แนบด้านล่าง",
    "isHtml": false
  },
  "attachments": [
    {
      "name": "example.txt",
      "contentBytes": "SGVsbG8gV29ybGQh",
      "contentType": "text/plain"
    }
  ]
}
```

**หมายเหตุ:** `contentBytes` ต้องเป็น Base64 encoded string

## ตัวอย่างการใช้งานด้วย cURL

### ส่งอีเมลทั่วไป:
```bash
curl -X POST http://localhost:3000/mail/send \
  -H "Content-Type: application/json" \
  -d "{\"to\":[\"recipient@example.com\"],\"subject\":\"Test Email\",\"body\":\"Hello from NestJS!\",\"isHtml\":false}"
```

### ส่งอีเมล HTML:
```bash
curl -X POST http://localhost:3000/mail/send \
  -H "Content-Type: application/json" \
  -d "{\"to\":[\"recipient@example.com\"],\"subject\":\"HTML Test\",\"body\":\"<h1>Hello</h1><p>This is HTML email</p>\",\"isHtml\":true}"
```

## ตัวอย่างการใช้งานด้วย JavaScript/TypeScript

```typescript
// ส่งอีเมลทั่วไป
const response = await fetch('http://localhost:3000/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: ['recipient@example.com'],
    subject: 'Test Email',
    body: 'สวัสดีครับ นี่คือข้อความทดสอบ',
    isHtml: false,
  }),
});

const result = await response.json();
console.log(result);
```

## โครงสร้างโปรเจค

```
.
├── src/
│   ├── config/
│   │   └── environment.config.ts    # การตั้งค่าจาก .env
│   ├── mail/
│   │   ├── dto/
│   │   │   └── send-email.dto.ts   # Data Transfer Object
│   │   ├── mail.controller.ts      # Controller สำหรับ API endpoints
│   │   ├── mail.service.ts         # Service สำหรับ Graph API
│   │   └── mail.module.ts          # Module definition
│   ├── app.module.ts               # Root module
│   └── main.ts                     # Entry point
├── .env                             # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Features

- ✅ ส่งอีเมลผ่าน Microsoft Graph API
- ✅ รองรับการส่งอีเมลแบบ Plain Text และ HTML
- ✅ รองรับ CC และ BCC
- ✅ รองรับการแนบไฟล์
- ✅ Validation ด้วย class-validator
- ✅ ใช้ Environment Variables เก็บ credentials อย่างปลอดภัย
- ✅ Logging สำหรับติดตามการทำงาน

## การแก้ไขปัญหา

### ถ้า Graph API ส่งกลับ error 401 (Unauthorized):
- ตรวจสอบว่า `CLIENT_ID`, `TENANT_ID`, และ `CLIENT_SECRET` ถูกต้อง
- ตรวจสอบว่า App Registration มี permissions ที่จำเป็น (Mail.Send)
- ตรวจสอบว่า Admin ได้ทำ Grant consent แล้ว

### ถ้า Graph API ส่งกลับ error 403 (Forbidden):
- ตรวจสอบว่า `TARGET_GROUP` มีสิทธิ์ส่งเมล
- ตรวจสอบว่า mailbox มีอยู่จริงและ active

## License

MIT
