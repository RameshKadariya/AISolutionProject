import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './AIChatbot.css';

const AIChatbot = () => {
    const { isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    // Debug log to make sure component is rendering
    console.log('AIChatbot component is rendering!');
    console.log('API Key available:', process.env.REACT_APP_OPENAI_API_KEY ? 'YES' : 'NO');
    console.log('API Key starts with:', process.env.REACT_APP_OPENAI_API_KEY ? process.env.REACT_APP_OPENAI_API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm ARIA, your AI assistant from AI-Solution. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Enhanced AI Knowledge Base
    const aiKnowledge = {
        services: {
            keywords: ['service', 'services', 'solution', 'solutions', 'offer', 'what do you do', 'help with', 'provide', 'what can you do', 'capabilities', 'products'],
            responses: [
                "We offer 5 main AI solutions:\n\n🔹 **AI-Powered Analytics** - Transform data into insights\n🔹 **Intelligent Automation** - Automate complex processes\n🔹 **Computer Vision** - Visual recognition systems\n🔹 **Natural Language Processing** - Text & speech analysis\n🔹 **Custom AI Solutions** - Tailored to your needs\n\nWhich one interests you most?",
                "AI-Solution specializes in transforming businesses with AI! We help with data analytics, process automation, computer vision, NLP, and custom AI development. What's your biggest business challenge?",
                "Our AI services include predictive analytics, intelligent automation, visual recognition, conversational AI (like me!), and custom solutions. What industry are you in?"
            ]
        },
        analytics: {
            keywords: ['analytic', 'data', 'insight', 'predict', 'trend', 'dashboard'],
            responses: [
                "Our AI-Powered Analytics transforms raw data into actionable insights! We offer real-time processing, predictive analytics, custom dashboards, and anomaly detection. Perfect for Finance, Healthcare, Retail & Manufacturing.",
                "With our analytics platform, you can predict trends, identify patterns, and make data-driven decisions. We've helped clients increase efficiency by 35% on average!",
                "Our analytics solution includes machine learning algorithms that learn from your data patterns. Want to see how it could work for your business?"
            ]
        },
        automation: {
            keywords: ['automat', 'process', 'workflow', 'rpa', 'robot'],
            responses: [
                "Our Intelligent Automation combines RPA with AI to create systems that learn and adapt! We handle workflow automation, document processing, and cognitive decision-making.",
                "Imagine your repetitive tasks running themselves while getting smarter over time. That's our automation solution! We've helped companies save 40+ hours per week.",
                "Our automation integrates seamlessly with your existing systems and scales with your business. Which processes would you like to automate?"
            ]
        },
        vision: {
            keywords: ['vision', 'image', 'visual', 'camera', 'detect', 'recognize'],
            responses: [
                "Our Computer Vision systems help machines see and understand visual information! We do object detection, image classification, visual inspection, and facial recognition.",
                "From quality control in manufacturing to security systems, our vision AI has 94% accuracy rates. We've prevented millions in defects for our clients!",
                "Computer vision is perfect for Security, Manufacturing, Retail, and Healthcare. What visual challenges does your business face?"
            ]
        },
        nlp: {
            keywords: ['nlp', 'language', 'text', 'chat', 'chatbot', 'sentiment', 'translate', 'natural language', 'processing', 'conversation'],
            responses: [
                "**Natural Language Processing (NLP)** is one of our specialties! 🗣️\n\nOur NLP solutions include:\n• Sentiment analysis of customer feedback\n• Intelligent chatbots (like me!)\n• Text classification and extraction\n• Language translation\n• Voice recognition\n\nPerfect for customer service, marketing, and content analysis. What's your use case?",
                "NLP is amazing for understanding human language! We've built chatbots, sentiment analyzers, and text processors that have improved customer satisfaction by 28% for our clients. What kind of text/language challenge do you have?",
                "Our NLP solutions help businesses understand and respond to human language automatically. Great for customer service automation, content analysis, and building conversational AI. Interested in a demo?"
            ]
        },
        contact: {
            keywords: ['contact', 'reach', 'talk', 'meeting', 'demo', 'quote'],
            responses: [
                "I'd love to connect you with our team! You can fill out our contact form below, or I can help you get started right now. What's your main challenge?",
                "Ready to transform your business with AI? Our experts are standing by! Use our contact form or tell me about your project and I'll make sure you get priority attention.",
                "Let's get you connected! Our consultation is free and we typically respond within 2 hours. What industry are you in and what's your biggest pain point?"
            ]
        },
        pricing: {
            keywords: ['price', 'cost', 'budget', 'expensive', 'cheap', 'afford'],
            responses: [
                "Our AI solutions are designed to be cost-effective and ROI-focused! Most clients see returns within 3-6 months. Pricing depends on your specific needs - shall we discuss your requirements?",
                "We offer flexible pricing models including project-based, subscription, and custom enterprise packages. Our solutions typically pay for themselves through efficiency gains!",
                "Investment in AI varies by scope, but our clients average 300% ROI in the first year. Let's discuss your budget and find the perfect solution for you!"
            ]
        },
        greeting: {
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            responses: [
                "Hello! Great to meet you! I'm ARIA, your AI assistant from AI-Solution. I'm here to help you discover how AI can transform your business. What brings you here today?",
                "Hi there! Welcome to AI-Solution! I'm excited to help you explore our AI services. Are you looking to solve a specific business challenge?",
                "Hey! Thanks for stopping by! I'm ARIA, and I love talking about AI solutions. What's your biggest business challenge right now?"
            ]
        },
        thanks: {
            keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
            responses: [
                "You're very welcome! I'm here whenever you need help. Is there anything else about our AI solutions you'd like to know?",
                "Happy to help! That's what I'm here for. Feel free to ask me anything about AI-Solution's services anytime!",
                "My pleasure! I love helping people discover how AI can transform their business. What else can I assist you with?"
            ]
        },
        default: [
            "That's an interesting question! While I specialize in AI-Solution's services, I'd love to help you find the right AI solution for your needs. Can you tell me more about your business challenge?",
            "I'm still learning, but I'm great at discussing our AI services! Could you rephrase that or ask me about our analytics, automation, computer vision, or NLP solutions?",
            "Hmm, I want to make sure I give you the best answer! Are you asking about our AI services, pricing, or would you like to speak with our human experts?",
            "Let me connect you with the right information! Are you interested in learning about our AI solutions, seeing case studies, or getting a consultation?"
        ]
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // OpenAI API Integration - Use environment variable
    const callOpenAI = async (userMessage) => {
        // Use the API key from environment variable
        const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

        console.log('🚀 Calling OpenAI API for:', userMessage);
        console.log('🔑 Using API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'NOT FOUND');

        if (!API_KEY) {
            throw new Error('OpenAI API key not found in environment variables');
        }

        try {

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are ARIA, an intelligent AI assistant for AI-Solution company. 

                            COMPANY INFO:
                            - AI-Solution is a cutting-edge AI startup
                            - We provide AI services to businesses worldwide
                            - Our pricing ranges from $5,000 to $500,000+ depending on project scope
                            - We have offices in Tech City and serve global clients
                            
                            OUR AI SERVICES:
                            - AI-Powered Analytics: $10,000-$50,000 (Transform data into insights)
                            - Intelligent Automation: $15,000-$100,000 (Automate business processes)  
                            - Computer Vision: $20,000-$200,000 (Visual recognition systems)
                            - Natural Language Processing: $8,000-$80,000 (Text & speech analysis)
                            - Custom AI Solutions: $25,000-$500,000+ (Tailored development)
                            
                            PERSONALITY:
                            - Be conversational, helpful, and intelligent
                            - Give specific, detailed answers about our services
                            - Handle pricing questions with realistic ranges
                            - Be understanding of different budgets
                            - Always try to find solutions within customer budgets
                            - Vary your responses - never give the same answer twice
                            
                            IMPORTANT: Always give unique, varied responses. Never repeat the same answer pattern.`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.8
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI API Error:', response.status, errorText);
                throw new Error(`OpenAI API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content.trim();
            console.log('✅ OpenAI Response:', aiResponse);
            return aiResponse;

        } catch (error) {
            console.error('❌ OpenAI API Error:', error);

            // Handle specific error types
            if (error.message.includes('429')) {
                return "I'm getting too many requests right now! Please wait a few seconds and try again. Our AI services are in high demand! 😊";
            } else if (error.message.includes('401')) {
                return "There's an authentication issue with my AI connection. Let me help you with our services the traditional way!";
            } else {
                return `I'm having a small technical hiccup. Error: ${error.message}. But I'm still here to help with your AI needs!`;
            }
        }
    };

    // Fallback function for when OpenAI fails
    const findBestResponse = (userMessage) => {
        const message = userMessage.toLowerCase();
        
        // Check each category for keyword matches
        for (const [category, data] of Object.entries(aiKnowledge)) {
            if (category === 'default') continue;
            
            const hasKeyword = data.keywords.some(keyword => 
                message.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Return random default response
        const defaultResponses = aiKnowledge.default;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Add delay to prevent rate limiting - increased delay
        const thinkingTime = Math.random() * 4000 + 3000; // 3-7 seconds

        setTimeout(async () => {
            try {
                // Use local responses primarily (they're very good!)
                console.log('🤖 Using local knowledge base for:', inputText);
                const localResponse = findBestResponse(inputText);
                
                const botMessage = {
                    id: Date.now() + 1,
                    text: localResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                
                // Optionally try OpenAI in background for future improvements
                // (but don't show the result to avoid confusion)
                try {
                    await callOpenAI(inputText);
                    console.log('✅ OpenAI also worked (background check)');
                } catch (bgError) {
                    console.log('ℹ️ OpenAI still having issues (background check)');
                }
                
            } catch (error) {
                console.error('❌ Chat error:', error);
                
                // Fallback to a default response
                const botMessage = {
                    id: Date.now() + 1,
                    text: "I'm here to help with your AI needs! Could you tell me more about what you're looking for? I can discuss our services, pricing, or schedule a consultation.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            } finally {
                setIsTyping(false);
            }
        }, thinkingTime);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickActions = [
        "Tell me about your services",
        "How can AI help my business?",
        "I need a consultation",
        "What's your pricing?"
    ];

    return (
        <>
            {/* Simple Test Chat Bubble */}
            <div
                className="chat-bubble"
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff9900, #ffb84d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 9999,
                    boxShadow: '0 8px 25px rgba(255, 153, 0, 0.3)',
                    fontSize: '24px'
                }}
            >
                🤖
            </div>

            {/* Simple Test Chat Window */}
            {isOpen && (
                <div
                    className="chat-window"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '30px',
                        width: '380px',
                        height: '500px',
                        borderRadius: '20px',
                        background: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ff9900',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Simple Header */}
                    <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #ff9900, #ffb84d)',
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '20px' }}>🤖</div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>ARIA</h4>
                                <span style={{ fontSize: '12px', opacity: 0.8 }}>AI Assistant • Online</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                color: 'black',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Enhanced Messages */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        background: isDarkMode ? 'rgba(20, 20, 20, 0.5)' : 'rgba(250, 250, 250, 0.5)'
                    }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                            >
                                <div style={{
                                    padding: '14px 18px',
                                    borderRadius: message.sender === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    background: message.sender === 'user'
                                        ? 'linear-gradient(135deg, #ff9900, #ffb84d)'
                                        : isDarkMode ? 'rgba(70, 70, 70, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                    color: message.sender === 'user' ? 'black' : isDarkMode ? '#ffffff' : '#333333',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: message.sender === 'bot' ? `1px solid ${isDarkMode ? 'rgba(255, 153, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}` : 'none',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {message.sender === 'bot' && <span style={{ fontSize: '16px', marginRight: '8px' }}>🤖</span>}
                                    {message.text}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    padding: '0 8px'
                                }}>
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start' }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '18px',
                                    background: isDarkMode ? 'rgba(60, 60, 60, 0.9)' : 'rgba(240, 240, 240, 0.9)',
                                    color: isDarkMode ? 'white' : 'black'
                                }}>
                                    Typing...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions for first interaction */}
                    {messages.length === 1 && (
                        <div style={{
                            padding: '0 20px 15px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ fontSize: '12px', color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', marginBottom: '5px' }}>
                                Quick questions:
                            </div>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInputText(action);
                                        setTimeout(() => handleSendMessage(), 100);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: `1px solid #ff9900`,
                                        color: '#ff9900',
                                        padding: '8px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#ff9900';
                                        e.target.style.color = 'black';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#ff9900';
                                    }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Enhanced Input */}
                    <div style={{
                        padding: '20px',
                        background: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderTop: `2px solid #ff9900`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                        <input
                            type="text"
                            placeholder={isTyping ? "ARIA is thinking..." : "Ask me about AI solutions..."}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                            style={{
                                flex: 1,
                                padding: '14px 18px',
                                border: `2px solid ${isDarkMode ? 'rgba(255, 153, 0, 0.5)' : '#ff9900'}`,
                                borderRadius: '25px',
                                background: isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'white',
                                color: isDarkMode ? 'white' : 'black',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#ff9900';
                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 153, 0, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = isDarkMode ? 'rgba(255, 153, 0, 0.5)' : '#ff9900';
                                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isTyping}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: (!inputText.trim() || isTyping)
                                    ? 'rgba(255, 153, 0, 0.3)'
                                    : 'linear-gradient(135deg, #ff9900, #ffb84d)',
                                border: 'none',
                                color: 'black',
                                fontSize: '18px',
                                cursor: (!inputText.trim() || isTyping) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: (!inputText.trim() || isTyping) ? 'none' : '0 4px 12px rgba(255, 153, 0, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!(!inputText.trim() || isTyping)) {
                                    e.target.style.transform = 'scale(1.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            {isTyping ? '⏳' : '➤'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;