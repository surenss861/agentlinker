# 📧 Email Confirmation Setup Guide

## 🚀 **Quick Setup Options**

### **Option 1: EmailJS (Recommended - Free & Easy)**

1. **Sign up at [EmailJS.com](https://www.emailjs.com/)**
   - Free tier: 200 emails/month
   - No server setup required

2. **Create Email Service**
   - Go to "Email Services" → "Add New Service"
   - Choose Gmail, Outlook, or any email provider
   - Connect your email account

3. **Create Email Template**
   - Go to "Email Templates" → "Create New Template"
   - Template ID: `booking_confirmation`
   - Use this template:
   ```
   Subject: Booking Request Confirmed - {{property}}
   
   Hello {{client_name}},
   
   Your showing request has been successfully sent to {{agent_name}}.
   
   BOOKING DETAILS:
   Property: {{property}}
   Date: {{date}}
   Time: {{time}}
   Agent: {{agent_name}}
   
   You'll receive another email once the agent confirms your booking.
   
   Best regards,
   The AgentLinker Team
   ```

4. **Get Your Keys**
   - Service ID: Copy from your service
   - Template ID: `booking_confirmation`
   - Public Key: Copy from account settings

5. **Add to Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

---

### **Option 2: Gmail SMTP (Free)**

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password**
   - Go to Google Account → Security → App passwords
   - Generate password for "Mail"

3. **Add to Environment Variables**
   ```bash
   # .env.local
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

---

### **Option 3: SendGrid (Free Tier)**

1. **Sign up at [SendGrid.com](https://sendgrid.com/)**
   - Free tier: 100 emails/day

2. **Create API Key**
   - Go to Settings → API Keys
   - Create new key with "Mail Send" permissions

3. **Add to Environment Variables**
   ```bash
   # .env.local
   SENDGRID_API_KEY=your_api_key
   FROM_EMAIL=your-verified-email@domain.com
   ```

---

## 🔧 **Installation**

Add the email service package:

```bash
npm install @emailjs/browser
```

## ✅ **Testing**

1. **Test Email Sending**
   - Go to your agent profile page
   - Book a showing
   - Check console for "✅ Confirmation email sent successfully"

2. **Check Email Delivery**
   - Look for the confirmation email in the client's inbox
   - Verify all details are correct

## 🎯 **Features**

- ✅ **Automatic confirmation emails** when bookings are created
- ✅ **Beautiful HTML email templates** with your branding
- ✅ **Fallback handling** - booking succeeds even if email fails
- ✅ **Multiple email service options** (EmailJS, SMTP, SendGrid)
- ✅ **No server setup required** for EmailJS option

## 📊 **Email Limits**

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| EmailJS | 200/month | $15/month for 10K |
| Gmail SMTP | Unlimited | Free |
| SendGrid | 100/day | $19.95/month for 50K |

---

## 🚀 **Quick Start (EmailJS)**

1. Sign up at emailjs.com
2. Create service + template
3. Add environment variables
4. Run: `npm install @emailjs/browser`
5. Test a booking!

**That's it! Your confirmation emails will work immediately.** 🎉
