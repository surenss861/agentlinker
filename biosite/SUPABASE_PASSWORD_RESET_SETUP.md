# Supabase Password Reset Email Configuration

## 🔧 Required Supabase Settings

To enable password reset functionality, you need to configure the following in your Supabase dashboard:

### 1. Site URL Configuration

**Go to:** Authentication → URL Configuration

**Set Site URL to:**
```
https://www.agentlinker.ca
```

**Add Redirect URLs:**
```
https://www.agentlinker.ca/reset-password
https://www.agentlinker.ca/dashboard
https://www.agentlinker.ca/login
```

### 2. Email Templates Configuration

**Go to:** Authentication → Email Templates

#### Reset Password Template

**Subject:**
```
Reset Your AgentLinker Password
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { 
            display: inline-block; 
            background: #ef4444; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
        }
        .footer { background: #000; color: #fff; padding: 20px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AgentLinker</h1>
        </div>
        
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your AgentLinker account ({{ .Email }}).</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>
            
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <p>Need help? Contact us at <a href="mailto:contact@agentlinker.ca">contact@agentlinker.ca</a></p>
        </div>
        
        <div class="footer">
            <p>© 2024 AgentLinker. All rights reserved.</p>
            <p>Turn every click into a client.</p>
        </div>
    </div>
</body>
</html>
```

### 3. SMTP Configuration (Optional but Recommended)

**Go to:** Authentication → SMTP Settings

**Enable Custom SMTP** and configure:

**SMTP Host:** `smtp.gmail.com` (or your preferred email service)
**SMTP Port:** `587`
**SMTP User:** `noreply@agentlinker.ca` (or your domain email)
**SMTP Password:** Your email service password
**SMTP Admin Email:** `contact@agentlinker.ca`

### 4. Email Rate Limiting

**Go to:** Authentication → Settings

**Configure:**
- **Email confirmation:** Enabled
- **Password reset:** Enabled
- **Rate limiting:** Configure as needed (default is usually fine)

## 🚀 Testing the Password Reset Flow

1. **Test the flow:**
   - Go to `/login`
   - Click "Forgot password?"
   - Enter a valid email
   - Check email for reset link
   - Click link and set new password

2. **Verify redirects work:**
   - Reset link should go to `/reset-password`
   - After successful reset, should redirect to `/dashboard`

## 🔒 Security Notes

- **Site URL must match** your production domain exactly
- **Redirect URLs** should only include your trusted domains
- **Email templates** should not include sensitive information
- **Rate limiting** helps prevent abuse

## 📧 Email Service Recommendations

For production, consider using:
- **SendGrid** (recommended)
- **Mailgun**
- **Amazon SES**
- **Postmark**

These services provide better deliverability than basic SMTP.

---

**Next Steps:**
1. Update Supabase settings as outlined above
2. Test the password reset flow
3. Monitor email delivery rates
4. Consider setting up custom domain for emails (noreply@agentlinker.ca)
