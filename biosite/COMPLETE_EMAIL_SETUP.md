# 🚀 Complete Email Setup Guide - contact@agentlinker.ca

## 🎯 Goal: Send emails from contact@agentlinker.ca

### ✅ What I've Fixed:

1. **Signup Flow Updated:**
   - Users must confirm email before onboarding
   - Shows confirmation screen instead of immediate redirect
   - "I've Confirmed My Email" button to continue
   - Resend confirmation email option

2. **Custom Email API Created:**
   - `/api/auth-email` endpoint for server-side email sending
   - Handles both confirmation and password reset emails

## 📧 Step 1: Set Up Custom SMTP in Supabase

### Option A: SendGrid (Recommended)

1. **Create SendGrid Account:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up (100 emails/day free)
   - Verify domain `agentlinker.ca`

2. **Create API Key:**
   - Settings → API Keys
   - Create key with "Mail Send" permissions
   - Copy the API key

3. **Configure Supabase:**
   - Go to **Authentication** → **SMTP Settings**
   - **Enable Custom SMTP:**
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [your_sendgrid_api_key]
   SMTP Admin Email: contact@agentlinker.ca
   ```

### Option B: Gmail SMTP (Quick Setup)

1. **Create Gmail Account:**
   - Create `contact@agentlinker.ca` Gmail account
   - Enable 2-Factor Authentication
   - Generate App Password

2. **Configure Supabase:**
   - Go to **Authentication** → **SMTP Settings**
   - **Enable Custom SMTP:**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: contact@agentlinker.ca
   SMTP Password: [app_password]
   SMTP Admin Email: contact@agentlinker.ca
   ```

## 📧 Step 2: Update Email Templates

### Confirm Signup Template:
Copy this into **Authentication** → **Email Templates** → **Confirm signup**:

```html
<h2>Welcome to AgentLinker!</h2>

<p>Hello,</p>

<p>Thank you for signing up for AgentLinker! We're excited to help you turn every click into a client.</p>

<p>To complete your account setup, please confirm your email address by clicking the button below:</p>

<div style="text-align: center; margin: 20px 0;">
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirm Email Address</a>
</div>

<p><strong>What happens next?</strong></p>
<ul>
  <li>✅ Complete your agent profile</li>
  <li>✅ Add your first property listing</li>
  <li>✅ Start capturing leads automatically</li>
  <li>✅ Get 5-10 showing requests monthly</li>
</ul>

<p>If you didn't create an AgentLinker account, you can safely ignore this email.</p>

<p>Need help? Contact us at <a href="mailto:contact@agentlinker.ca">contact@agentlinker.ca</a></p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

<p style="color: #666; font-size: 14px;">
  © 2024 AgentLinker. All rights reserved.<br>
  Turn every click into a client.
</p>
```

### Reset Password Template:
Copy this into **Authentication** → **Email Templates** → **Reset Password**:

```html
<h2>Reset Your AgentLinker Password</h2>

<p>Hello,</p>

<p>We received a request to reset your password for your AgentLinker account.</p>

<p>Click the button below to reset your password:</p>

<div style="text-align: center; margin: 20px 0;">
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
</div>

<p><strong>This link will expire in 1 hour for security reasons.</strong></p>

<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

<p>Need help? Contact us at <a href="mailto:contact@agentlinker.ca">contact@agentlinker.ca</a></p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

<p style="color: #666; font-size: 14px;">
  © 2024 AgentLinker. All rights reserved.<br>
  Turn every click into a client.
</p>
```

## 📧 Step 3: Configure Site URL

**Go to:** Authentication → URL Configuration

**Set:**
```
Site URL: https://www.agentlinker.ca
```

**Add Redirect URLs:**
```
https://www.agentlinker.ca/onboarding
https://www.agentlinker.ca/reset-password
https://www.agentlinker.ca/dashboard
https://www.agentlinker.ca/auth/callback
```

## 🧪 Step 4: Test the Flow

1. **Test Signup:**
   - Go to `/signup`
   - Create account
   - Should see "Check Your Email" screen
   - Check email from `contact@agentlinker.ca`

2. **Test Confirmation:**
   - Click confirmation link in email
   - Should redirect to `/onboarding`

3. **Test Password Reset:**
   - Go to `/login`
   - Click "Forgot password?"
   - Check email from `contact@agentlinker.ca`

## 🚨 Troubleshooting

### Emails not sending:
1. Check SMTP settings in Supabase
2. Verify domain authentication (SendGrid)
3. Check spam folder
4. Test from Supabase dashboard directly

### Wrong sender email:
1. Ensure SMTP Admin Email is set to `contact@agentlinker.ca`
2. Verify domain authentication
3. Check email templates don't override sender

### Confirmation not working:
1. Check Site URL is set correctly
2. Verify redirect URLs are added
3. Test confirmation link manually

---

**All code is ready - you just need to configure Supabase SMTP settings!** 🚀
