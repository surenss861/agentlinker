# 🔧 Supabase SMTP Configuration with Your SendGrid Key

## ✅ Your SendGrid API Key:
```
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
```

## 📧 Step-by-Step Supabase Configuration:

### 1. Go to Supabase Dashboard
- Navigate to your project: `https://supabase.com/dashboard/project/kjmnomtndntstbhpdklv`

### 2. Configure SMTP Settings
**Go to:** Authentication → SMTP Settings

**Enable Custom SMTP and enter these EXACT values:**

```
✅ Enable Custom SMTP: ON

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: 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
SMTP Admin Email: contact@agentlinker.ca
```

### 3. Save Settings
- Click **"Save"** or **"Update"**
- Wait for confirmation that settings are saved

### 4. Test Email Sending
**Go to:** Authentication → Users
- Find any user
- Click **"Send password reset email"**
- Check if email arrives from `contact@agentlinker.ca`

## 🚨 Important Notes:

### Domain Authentication (Optional but Recommended):
1. **Go to SendGrid Dashboard**
2. **Settings** → **Sender Authentication**
3. **Authenticate Your Domain** → `agentlinker.ca`
4. **Add DNS records** to your domain
5. **Verify domain** (this improves deliverability)

### Email Templates:
Make sure you've updated the email templates in Supabase:
- **Authentication** → **Email Templates**
- **Confirm signup** and **Reset Password**
- Use the templates from `COMPLETE_EMAIL_SETUP.md`

## 🧪 Testing Checklist:

- [ ] SMTP settings saved in Supabase
- [ ] Test password reset from Supabase dashboard
- [ ] Check email arrives from `contact@agentlinker.ca`
- [ ] Test signup flow on your website
- [ ] Verify confirmation emails work
- [ ] Check spam folder if emails don't arrive

## 🚀 Expected Result:

After configuration:
- ✅ **All emails sent from** `contact@agentlinker.ca`
- ✅ **Professional branded** email templates
- ✅ **Email confirmation required** before onboarding
- ✅ **Password reset** works properly

---

**Your SendGrid API key is ready to use! Just configure Supabase SMTP settings with the values above.** 🎉
