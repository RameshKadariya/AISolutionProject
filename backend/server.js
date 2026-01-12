/**
 * AI-Solution Backend Server
 * Express server with ChatGPT-like API for testing
 */

const express = require('express');
const cors = require('cors');
// Import chatbot routes
let chatbotRoutes;
try {
    chatbotRoutes = require('./routes/chatbot');
    console.log('✅ Chatbot routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading chatbot routes:', error.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
if (chatbotRoutes) {
    app.use('/api/chatbot', chatbotRoutes);
    console.log('✅ Chatbot routes registered at /api/chatbot');
} else {
    console.log('❌ Chatbot routes not available');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI-Solution Backend API',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: {
            chatbot: '/api/chatbot/*',
            health: '/api/health'
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AI-Solution Backend API',
        version: '1.0.0',
        documentation: {
            chatbot: {
                post_message: 'POST /api/chatbot/message',
                get_health: 'GET /api/chatbot/health',
                get_models: 'GET /api/chatbot/models'
            },
            health: 'GET /api/health'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        available_endpoints: [
            'GET /',
            'GET /api/health',
            'POST /api/chatbot/message',
            'GET /api/chatbot/health',
            'GET /api/chatbot/models'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI-Solution Backend API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Chatbot API: http://localhost:${PORT}/api/chatbot/message`);
});

module.exports = app;