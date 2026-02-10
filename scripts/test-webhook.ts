
const fetch = require('node-fetch');

const args = process.argv.slice(2);
const webhookUrl = args[0];

if (!webhookUrl) {
    console.error('❌ Usage: npx ts-node scripts/test-webhook.ts <WEBHOOK_URL>');
    process.exit(1);
}

async function testWebhook() {
    console.log(`🚀 Sending test event to: ${webhookUrl}`);

    const payload = {
        event: "TEST_EVENT",
        timestamp: new Date().toISOString(),
        payload: {
            message: "Hello from The Engine Sphere",
            agentId: "agent-007",
            status: "online"
        }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Webhook delivered successfully!');
            console.log('Status:', response.status);
            const text = await response.text();
            console.log('Response:', text);
        } else {
            console.error('❌ Webhook failed.');
            console.error('Status:', response.status);
            console.error('Response:', await response.text());
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

testWebhook();
