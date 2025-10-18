# 🚨 Email Rate Limit Fix Guide

## ⚠️ Issue: "Email rate limit exceeded"

This happens when Supabase's built-in email service hits rate limits. Since you're using SendGrid, we need to disable Supabase's built-in email service.

## 🔧 Quick Fix:

### 1. Disable Built-in Email Service
**Go to:** Authentication → Settings

**Disable these:**
- ❌ **Email confirmation** (turn OFF)
- ❌ **Password reset** (turn OFF)

### 2. Use Custom Email Only
Since you have SendGrid configured, we'll handle all emails through our custom API.

### 3. Update Signup Flow
The signup will now work without email confirmation, but we can still send welcome emails through SendGrid.

## 🚀 Alternative Solution:

### Option A: Increase Rate Limits
**Go to:** Authentication → Rate Limits
- Increase email sending limits
- Set higher intervals between emails

### Option B: Use SendGrid Directly
- Bypass Supabase email service entirely
- Send emails directly through SendGrid API
- Handle confirmation manually

## 🧪 Test After Fix:

1. **Try signup again** - should work without rate limit error
2. **Check if emails still send** from contact@agentlinker.ca
3. **Verify onboarding** works properly

---

**The rate limit error should disappear after disabling built-in email service!** 🎯
