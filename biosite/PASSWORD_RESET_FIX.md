# 🔐 Password Reset Fix Guide

## ⚠️ Current Issue:
Password reset isn't working because we disabled Supabase's built-in email service.

## 🔧 Solution: Enable Password Reset Only

### Step 1: Go to Supabase Settings
**Navigate to:** `https://supabase.com/dashboard/project/kjmnomtndntstbhpdklv/auth/settings`

### Step 2: Configure Email Settings
**Enable these:**
- ✅ **"Enable password reset"** (turn ON)
- ❌ **"Enable email confirmations"** (keep OFF for signup)

### Step 3: Configure SMTP (Already Done)
Your SendGrid SMTP is already configured:
- **Host:** `smtp.sendgrid.net`
- **Port:** `587`
- **User:** `apikey`
- **Password:** Your SendGrid API key
- **From:** `contact@agentlinker.ca`

### Step 4: Update Email Templates
**Go to:** `Authentication → Email Templates`

**Update "Reset Password" template:**
```html
<h2>Reset Your AgentLinker Password</h2>
<p>Hello,</p>
<p>We received a request to reset your password for your AgentLinker account.</p>
<p>Click the button below to reset your password:</p>
<div style="text-align: center; margin: 20px 0;">
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
</div>
<p><strong>This link will expire in 1 hour for security reasons.</strong></p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
<p>Need help? Contact us at <a href="mailto:contact@agentlinker.ca">contact@agentlinker.ca</a></p>
<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
<p style="color: #666; font-size: 14px;">
  © 2024 AgentLinker. All rights reserved.<br>
  Turn every click into a client.
</p>
```

## 🚀 How It Works:

1. **User clicks "Forgot password?"** on login page
2. **Supabase generates reset link** with tokens
3. **SendGrid sends email** from `contact@agentlinker.ca`
4. **User clicks link** → goes to `/reset-password`
5. **Page extracts tokens** from URL
6. **User sets new password** → redirects to dashboard

## 🧪 Test the Flow:

1. **Go to login page**
2. **Click "Forgot password?"**
3. **Enter email address**
4. **Check email** from `contact@agentlinker.ca`
5. **Click reset link**
6. **Set new password**
7. **Should redirect to dashboard**

---

**This approach gives you the best of both worlds:**
- ✅ **No email confirmation** for signup (no rate limits)
- ✅ **Password reset works** through SendGrid
- ✅ **Professional emails** from `contact@agentlinker.ca`
