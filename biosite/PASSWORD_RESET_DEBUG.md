# 🔍 Password Reset Troubleshooting Guide

## ✅ Your Email Template is Perfect!
The template looks great with AgentLinker branding and proper styling.

## 🔧 Let's Debug the Issue:

### Step 1: Check if Password Reset is Enabled
**Go to:** `Authentication → Emails` (where you found the template)

**Look for these settings:**
- ✅ **"Enable password reset"** should be ON
- ✅ **SMTP settings** should be configured with SendGrid
- ✅ **Sender email** should be `contact@agentlinker.ca`

### Step 2: Test from Supabase Dashboard
**Go to:** `Authentication → Users`
1. **Find any user** (or create a test user)
2. **Click the "..." menu** next to the user
3. **Click "Send password reset email"**
4. **Check if email arrives** from `contact@agentlinker.ca`

### Step 3: Check Console Logs
**Open browser console** on your login page:
1. **Go to** `localhost:3000/login`
2. **Open Developer Tools** (F12)
3. **Click "Forgot password?"**
4. **Check console** for any error messages

### Step 4: Verify SMTP Configuration
**In Supabase Emails section, check:**
- **Host:** `smtp.sendgrid.net`
- **Port:** `587`
- **Username:** `apikey`
- **Password:** Your SendGrid API key
- **From Email:** `contact@agentlinker.ca`

## 🧪 Quick Test:

1. **Try password reset** from your login page
2. **Check spam folder** for emails
3. **Check console** for error messages
4. **Test from Supabase dashboard** directly

## 🚨 Common Issues:

- **SMTP not properly configured**
- **SendGrid API key expired/invalid**
- **Email going to spam**
- **Supabase rate limits**
- **Wrong redirect URL**

---

**Let's debug this step by step!** 🔍
