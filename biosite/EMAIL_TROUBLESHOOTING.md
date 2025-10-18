# 🔧 Supabase Email Not Sending - Troubleshooting Guide

## 🚨 Immediate Steps to Fix Email Issues

### 1. Check Supabase Dashboard Settings

**Go to your Supabase project dashboard:**
1. Navigate to **Authentication** → **Settings**
2. Check if **Email confirmation** is enabled
3. Verify **Password reset** is enabled

### 2. Configure Site URL (CRITICAL)

**Go to:** Authentication → URL Configuration

**Set these EXACTLY:**
```
Site URL: https://www.agentlinker.ca
```

**Add these Redirect URLs:**
```
https://www.agentlinker.ca/reset-password
https://www.agentlinker.ca/dashboard
https://www.agentlinker.ca/login
https://www.agentlinker.ca/auth/callback
```

### 3. Check Email Templates

**Go to:** Authentication → Email Templates

**Verify Reset Password template exists and is enabled**

### 4. Test with Supabase's Built-in Email Service

**First, try using Supabase's default email service:**

1. **Go to:** Authentication → SMTP Settings
2. **Disable** "Enable custom SMTP" (use Supabase's default)
3. **Test** password reset again

### 5. Check Spam/Junk Folders

- Check your **spam/junk folder**
- Check **promotions tab** (Gmail)
- Check **all mail** folder

### 6. Verify User Email is Confirmed

**In Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Find your user account
3. Check if **Email Confirmed** is `true`
4. If not, manually confirm it or resend confirmation

## 🔍 Debug Steps

### Step 1: Test in Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Find your user
3. Click **"Send password reset email"** button
4. Check if email arrives

### Step 2: Check Browser Console

1. Open browser dev tools (F12)
2. Go to **Console** tab
3. Try password reset
4. Look for any error messages

### Step 3: Check Supabase Logs

1. Go to **Logs** in Supabase dashboard
2. Look for **Auth** logs
3. Check for any errors during password reset

## 🛠️ Quick Fixes

### Fix 1: Reset Supabase Email Settings

1. **Go to:** Authentication → SMTP Settings
2. **Disable** custom SMTP
3. **Save** settings
4. **Test** password reset

### Fix 2: Update Environment Variables

**Check your `.env.local` file has:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://kjmnomtndntstbhpdklv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://www.agentlinker.ca
```

### Fix 3: Test with Different Email

Try password reset with:
- Different email provider (Gmail, Outlook, etc.)
- Different email address
- Check if it's email provider specific

## 🚀 Production Email Setup (Recommended)

### Option 1: SendGrid (Recommended)

1. **Create SendGrid account**
2. **Get API key**
3. **In Supabase:** Authentication → SMTP Settings
4. **Enable custom SMTP:**
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [your_sendgrid_api_key]
   SMTP Admin Email: contact@agentlinker.ca
   ```

### Option 2: Gmail SMTP

1. **Enable 2FA** on Gmail account
2. **Generate App Password**
3. **In Supabase:**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your_email@gmail.com
   SMTP Password: [app_password]
   SMTP Admin Email: contact@agentlinker.ca
   ```

## 🧪 Testing Checklist

- [ ] Site URL is set correctly
- [ ] Redirect URLs are added
- [ ] Email templates are enabled
- [ ] User email is confirmed
- [ ] Checked spam folder
- [ ] Tested with different email
- [ ] Checked Supabase logs
- [ ] Tested from Supabase dashboard

## 📞 If Still Not Working

1. **Check Supabase Status:** https://status.supabase.com
2. **Contact Supabase Support** with your project details
3. **Try different email service** (SendGrid, Mailgun)
4. **Check domain reputation** if using custom domain

---

**Most Common Issue:** Site URL not set correctly in Supabase dashboard!

**Quick Test:** Try password reset from Supabase dashboard directly (Authentication → Users → Send password reset email)
