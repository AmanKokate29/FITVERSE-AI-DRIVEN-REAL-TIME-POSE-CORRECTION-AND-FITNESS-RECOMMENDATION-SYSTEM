# Email Setup Guide for Coaching Form

## Overview
The coaching form now sends submissions directly to **team.fitverse@gmail.com** via email.

## Setup Instructions

### 1. Create Environment File
1. Navigate to the `backend` folder
2. Copy `.env.example` to create a new file named `.env`
3. **Important:** Make sure `.env` is listed in your `.gitignore` file (don't commit passwords to Git!)

### 2. Get Gmail App Password
Since you're using Gmail, you need to generate an **App Password** (not your regular Gmail password):

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google," make sure **2-Step Verification** is enabled
   - If not, enable it first
4. After 2-Step Verification is enabled, go back to Security
5. Under "How you sign in to Google," click **App passwords**
6. Select:
   - App: **Mail**
   - Device: Select your device or choose **Other** and name it "FitVerse"
7. Click **Generate**
8. Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)
9. **Copy this password** - you won't see it again!

### 3. Configure .env File
Open your `.env` file and add:

```env
EMAIL_HOST_USER=team.fitverse@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password-here
```

Replace `your-16-character-app-password-here` with the app password from step 2.

### 4. Test the Setup

#### Start the Backend:
```bash
cd backend
python manage.py runserver
```

#### Start the Frontend:
```bash
cd frontend
npm run dev
```

#### Test the Form:
1. Go to http://localhost:5173/coaching
2. Fill out the consultation form
3. Click "Submit Consultation Request"
4. Check the email inbox at **team.fitverse@gmail.com**

## For Development/Testing

If you want to test without sending real emails, you can use Django's console email backend:

In `backend/fitverse/settings.py`, comment out the SMTP backend and uncomment:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

This will print emails to the console instead of sending them.

## Email Format

When a user submits the form, you'll receive an email with:
- Client name, email, and phone
- Fitness level and goals
- Preferred coaching type
- Preferred contact time
- Any additional messages
- Submission timestamp

## Troubleshooting

### "SMTPAuthenticationError"
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google account
- Double-check the password in your `.env` file (no extra spaces)

### "Connection refused" or timeout errors
- Check your internet connection
- Some networks block port 587 - try a different network
- Gmail might temporarily block if you send too many test emails

### Email not received
- Check spam/junk folder
- Verify the email address in the code is correct
- Check Django console for error messages

## Security Notes

- **Never commit your `.env` file to Git**
- The `.env` file contains sensitive passwords
- Keep your App Password secret
- Rotate (change) your App Password if it's ever exposed
