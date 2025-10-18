# 🔧 Custom Email Setup Guide - contact@agentlinker.ca

## 🚨 Critical: Email Must Come From contact@agentlinker.ca

To send emails from `contact@agentlinker.ca` instead of Supabase's default, you need to set up **Custom SMTP**.

## 📧 Option 1: SendGrid (Recommended)

### Step 1: Create SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day free)
3. Verify your domain `agentlinker.ca`

### Step 2: Create API Key
1. Go to **Settings** → **API Keys**
2. Create new key with **"Mail Send"** permissions
3. Copy the API key

### Step 3: Configure Supabase SMTP
**Go to:** Authentication → SMTP Settings

**Enable Custom SMTP:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [your_sendgrid_api_key]
SMTP Admin Email: contact@agentlinker.ca
```

## 📧 Option 2: Gmail SMTP (Quick Setup)

### Step 1: Create Gmail Account
1. Create `contact@agentlinker.ca` Gmail account
2. Enable 2-Factor Authentication
3. Generate App Password

### Step 2: Configure Supabase SMTP
**Go to:** Authentication → SMTP Settings

**Enable Custom SMTP:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: contact@agentlinker.ca
SMTP Password: [app_password]
SMTP Admin Email: contact@agentlinker.ca
```

## 🔧 Email Confirmation Required Before Onboarding

### Current Issue:
- Users get redirected to onboarding immediately
- They can skip email confirmation
- This causes password reset issues

### Solution:
- Require email confirmation before onboarding
- Show confirmation screen instead of redirecting
- Only redirect after email is confirmed

---

**Next Steps:**
1. Set up custom SMTP (SendGrid or Gmail)
2. Update signup flow to require confirmation
3. Test email delivery from contact@agentlinker.ca
