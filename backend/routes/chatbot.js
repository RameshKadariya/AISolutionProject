/**
 * ChatGPT-like API Endpoint for Testing
 * Mock AI chatbot API for Postman testing
 */

const express = require('express');
const router = express.Router();

// Mock ChatGPT responses
const mockResponses = [
    "I'm an AI assistant here to help you with your questions about our services.",
    "Thank you for your inquiry. Our team specializes in AI solutions for businesses.",
    "I can help you understand our portfolio and services. What would you like to know?",
    "Our AI solutions have helped many companies improve their efficiency and productivity.",
    "Feel free to ask me about our projects, technologies, or how we can help your business."
];

// Simulate processing delay
const getRandomDelay = () => Math.floor(Math.random() * 2000) + 500; // 500-2500ms

// POST /api/chatbot/message
router.post('/message', async (req, res) => {
    try {
        const { message, conversation_id, user_id } = req.body;
        
        // Validate input
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Message is required',
                code: 'INVALID_INPUT'
            });
        }
        
        if (message.length > 1000) {
            return res.status(400).json({
                error: 'Message too long (max 1000 characters)',
                code: 'MESSAGE_TOO_LONG'
            });
        }
        
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
        
        // Generate contextual response based on input
        let response;
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            response = "Our pricing varies based on project scope and requirements. I'd be happy to connect you with our sales team for a detailed quote.";
        } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            response = "We provide comprehensive AI solutions including machine learning, data analytics, automation, and custom AI development for businesses.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
            response = "You can reach us through our contact form, email us directly, or schedule a consultation. Our team typically responds within 24 hours.";
        } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('projects')) {
            response = "Our portfolio includes AI solutions for healthcare, finance, retail, and technology sectors. Each project is customized to meet specific business needs.";
        } else {
            // Random response for general queries
            response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        }
        
        // Return structured response
        res.json({
            success: true,
            data: {
                message: response,
                conversation_id: conversation_id || `conv_${Date.now()}`,
                user_id: user_id || 'anonymous',
                timestamp: new Date().toISOString(),
                response_time_ms: getRandomDelay(),
                model: 'ai-solution-chatbot-v1.0',
                tokens_used: Math.floor(Math.random() * 100) + 20
            },
            metadata: {
                api_version: '1.0',
                endpoint: '/api/chatbot/message',
                rate_limit: {
                    remaining: 95,
                    reset_time: new Date(Date.now() + 3600000).toISOString()
                }
            }
        });
        
    } catch (error) {
        console.error('Chatbot API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'SERVER_ERROR',
            message: 'An unexpected error occurred while processing your request'
        });
    }
});

// GET /api/chatbot/health
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI Chatbot API',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/chatbot/message',
            'GET /api/chatbot/health',
            'GET /api/chatbot/models'
        ]
    });
});

// GET /api/chatbot/models
router.get('/models', (req, res) => {
    res.json({
        models: [
            {
                id: 'ai-solution-chatbot-v1.0',
                name: 'AI Solution Chatbot',
                description: 'Custom trained model for business inquiries',
                max_tokens: 1000,
                response_time_avg: '1.2s'
            }
        ],
        default_model: 'ai-solution-chatbot-v1.0'
    });
});

module.exports = router;