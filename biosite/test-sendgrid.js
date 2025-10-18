// Test script to verify SendGrid configuration
// Run this in your browser console on your website to test email sending

async function testSendGridEmail() {
    try {
        console.log('🧪 Testing SendGrid email configuration...')

        // Test password reset email
        const response = await fetch('/api/auth-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'your-email@example.com', // Replace with your email
                type: 'reset'
            })
        })

        const result = await response.json()

        if (result.success) {
            console.log('✅ Email sent successfully!')
            console.log('Check your inbox for email from contact@agentlinker.ca')
        } else {
            console.error('❌ Email failed:', result.error)
        }
    } catch (error) {
        console.error('❌ Test failed:', error)
    }
}

// Run the test
testSendGridEmail()
