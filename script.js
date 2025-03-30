// Self-executing encrypted wrapper
(function() {
    'use strict';
    
    const API_KEY = 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo';
    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

    // تعريف المتغيرات العامة
    window.API_KEY = API_KEY;
    window.API_URL = API_URL;

    // Anti-debugging
    (function antiDebug() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            window.location.href = "about:blank";
        }
    })();

    // Disable DevTools
    function disableDevTools() {
        Object.defineProperty(window, 'console', {
            get: function() {
                return {
                    log: function() {},
                    warn: function() {},
                    error: function() {}
                };
            }
        });
    }

    disableDevTools();

    // تعريف الوظائف العامة قبل التشفير
    function toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('active');
    }

    function showSettings() {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('settingsOverlay').style.display = 'block';
    }

    function closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
        document.getElementById('settingsOverlay').style.display = 'none';
    }

    function changeFontSize(size) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);
        localStorage.setItem('fontSize', size);
    }

    // تصدير الوظائف للنطاق العام
    window.toggleSidebar = toggleSidebar;
    window.showSettings = showSettings;
    window.closeSettings = closeSettings;
    window.changeFontSize = changeFontSize;
    window.sendMessage = sendMessage;
    window.editChatTitle = editChatTitle;
    window.deleteChat = deleteChat;
    window.loadChat = loadChat;
    window.copyCode = copyCode;

    // منع التعديل على الوظائف المصدرة
    Object.keys(window).forEach(key => {
        if (typeof window[key] === 'function') {
            const originalFunc = window[key];
            Object.defineProperty(window, key, {
                value: originalFunc,
                writable: false,
                configurable: false
            });
        }
    });

    // Encrypt original code
    const code = function() {
        let aiConfig = {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 0.9,
            presencePenalty: 0.6,
            frequencyPenalty: 0.5
        };

        const AI_PERSONA = {
            name: "Red AI",
            personality: "مساعد ذكي متعدد المهارات",
            capabilities: {
                programming: ["JavaScript", "Python", "Java", "C++", "PHP", "SQL"],
                webDev: ["Frontend", "Backend", "DevOps", "Security"],
                aiMl: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
                dataScience: ["Analysis", "Visualization", "Big Data", "Statistics"],
                softwareEngineering: ["Design Patterns", "Architecture", "Testing", "Agile"],
                // إضافة قدرات جديدة
                education: ["Teaching", "Learning Strategies", "Academic Research", "Course Design"],
                business: ["Management", "Marketing", "Finance", "Strategy"],
                writing: ["Content Creation", "Technical Writing", "Creative Writing", "Translation"],
                science: ["Physics", "Chemistry", "Biology", "Mathematics"],
                arts: ["Digital Art", "Design", "Music", "Photography"],
                health: ["Medical Information", "Fitness", "Nutrition", "Mental Health"],
                languages: ["Arabic", "English", "French", "Spanish", "German"],
                research: ["Academic", "Market Research", "Data Analysis", "Scientific Method"]
            },
            contextMemory: [],
            knowledgeBase: {
                general: [/* General knowledge topics */],
                technical: [/* Technical topics */],
                academic: [/* Academic subjects */],
                cultural: [/* Cultural topics */]
            }
        };

        const CODE_TEMPLATES = {
            fullstack: {
                react: {
                    app: `// React App with TypeScript, Redux, and GraphQL
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const client = new ApolloClient({
    uri: 'YOUR_GRAPHQL_ENDPOINT',
    cache: new InMemoryCache()
});

const store = configureStore({
    reducer: rootReducer,
    middleware: [...defaultMiddleware]
});

export const App = () => (
    <ApolloProvider client={client}>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </ApolloProvider>
);`,
                },
                nodejs: {
                    server: `// Express.js Server with TypeScript and MongoDB
import express from 'express';
import { connect } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './schema';
import { authMiddleware, errorHandler } from './middleware';

async function startServer() {
    const app = express();
    const apollo = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: authMiddleware 
    });

    await connect(process.env.MONGODB_URI);
    await apollo.start();
    
    apollo.applyMiddleware({ app });
    app.use(errorHandler);
    
    return app;
}`
                }
            }
        };

        function parseComplexRequest(message) {
            const features = {
                auth: /auth|login|تسجيل|مصادقة/i,
                database: /database|db|قاعدة.*بيانات/i,
                api: /api|واجهة|endpoint/i,
                ui: /interface|ui|واجهة/i,
                testing: /test|اختبار/i
            };

            const requirements = Object.entries(features)
                .filter(([_, pattern]) => pattern.test(message))
                .map(([feature]) => feature);

            return {
                features: requirements,
                isFullstack: requirements.length > 2,
                complexity: requirements.length * 2,
                needsTypescript: message.includes('type') || message.includes('typescript')
            };
        }

        function analyzeRequest(message) {
            const topics = {
                tech: /\b(برمجة|تقنية|تكنولوجيا|software|programming)\b/i,
                science: /\b(علوم|فيزياء|كيمياء|biology|physics)\b/i,
                business: /\b(أعمال|تسويق|إدارة|business|marketing)\b/i,
                education: /\b(تعليم|دراسة|مدرسة|education|study)\b/i,
                arts: /\b(فن|تصميم|موسيقى|art|design|music)\b/i,
                health: /\b(صحة|طب|تغذية|health|medical)\b/i,
                languages: /\b(لغة|ترجمة|قواعد|language|translation)\b/i
            };

            return Object.entries(topics)
                .filter(([_, pattern]) => pattern.test(message))
                .map(([topic]) => topic);
        }

        function generateComplexCode(analysis) {
            let code = '';
            const { features, isFullstack } = analysis;

            if (isFullstack) {
                code += CODE_TEMPLATES.fullstack.react.app + '\n\n';
                code += CODE_TEMPLATES.fullstack.nodejs.server;
            }

            features.forEach(feature => {
                code += generateFeatureCode(feature, analysis);
            });

            return code;
        }

        function generateFeatureCode(feature, analysis) {
            const templates = {
                auth: `
    // Authentication Service
    export class AuthService {
        async login(credentials: LoginDTO): Promise<AuthResponse> {
            const user = await this.validateUser(credentials);
            return this.generateTokens(user);
        }

        private generateTokens(user: User): AuthTokens {
            return {
                access: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
                refresh: this.generateRefreshToken(user)
            };
        }
    }`,
                database: `
    // Database Schema and ORM Model
    @Entity()
    export class DataModel {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column({ unique: true })
        name: string;

        @OneToMany(() => RelatedEntity, entity => entity.parent)
        relations: RelatedEntity[];
        
        @BeforeInsert()
        async validate() {
            // Custom validation logic
        }
    }`
            };

            return templates[feature] || '';
        }

        async function enhanceAIResponse(text, codeAnalysis) {
            const requirements = parseComplexRequest(text);
            
            if (requirements.isFullstack || requirements.complexity > 3) {
                const complexCode = generateComplexCode(requirements);
                text = text.replace('```', `\`\`\`typescript\n${complexCode}\n`);
            }

            text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                const enhancedCode = improveCodeQuality(code, requirements);
                return '```' + (lang || 'typescript') + '\n' + enhancedCode + '\n```';
            });

            return text;
        }

        function improveCodeQuality(code, requirements) {
            if (requirements.needsTypescript) {
                code = addTypeScript(code);
            }
            
            // Add error handling
            if (!code.includes('try')) {
                code = addErrorHandling(code);
            }
            
            // Add comments and documentation
            if (!code.includes('/**')) {
                code = addDocumentation(code);
            }

            return code;
        }

        function createContext(message) {
            return {
                timestamp: Date.now(),
                message: message,
                metadata: {
                    sentiment: analyzeSentiment(message),
                    topics: extractTopics(message),
                    complexity: assessComplexity(message)
                }
            };
        }

        function analyzeSentiment(text) {
            const positiveWords = /\b(ممتاز|رائع|جيد|شكرا|نعم)\b/gi;
            const negativeWords = /\b(سيء|خطأ|مشكلة|لا|صعب)\b/gi;
            
            const positiveScore = (text.match(positiveWords) || []).length;
            const negativeScore = (text.match(negativeWords) || []).length;
            
            return (positiveScore - negativeScore) / (positiveScore + negativeScore + 1);
        }

        function extractTopics(text) {
            const topics = [];
            const technicalPattern = /\b(برمجة|جافا|بايثون|كود|database|api|html|css|javascript)\b/gi;
            const conceptPattern = /\b(مفهوم|كيف|لماذا|شرح|تعليم|مثال)\b/gi;
            
            if (technicalPattern.test(text)) topics.push('technical');
            if (conceptPattern.test(text)) topics.push('educational');
            
            return topics;
        }

        function assessComplexity(text) {
            const words = text.split(/\s+/).length;
            const technicalTerms = text.match(/\b(api|function|code|programming|database|algorithm)\b/gi) || [];
            
            return {
                wordCount: words,
                complexity: (technicalTerms.length / words) * 10,
                requiresCode: technicalTerms.length > 0
            };
        }

        function analyzeCodeRequest(message) {
            const patterns = {
                javascript: /\b(js|javascript|node|react|vue|angular)\b/i,
                python: /\b(python|django|flask|pandas|numpy)\b/i,
                database: /\b(sql|mysql|mongodb|database|query)\b/i,
                general: /\b(code|algorithm|function|class|method)\b/i
            };

            const analysis = {
                language: Object.keys(patterns).find(lang => patterns[lang].test(message)) || 'general',
                complexity: message.length > 200 ? 'advanced' : 'basic',
                needsExample: /\b(example|how|كيف|مثال)\b/i.test(message),
                isDebugging: /\b(error|bug|debug|مشكلة|خطأ)\b/i.test(message),
                conceptual: /\b(explain|concept|شرح|مفهوم)\b/i.test(message)
            };

            return analysis;
        }

        function generateCodeExample(analysis, topic) {
            const examples = {
                javascript: {
                    api: `async function fetchData() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }`,
                    class: `class Example {
        constructor() {
            this.data = [];
        }
        
        async initialize() {
            // Implementation
        }
    }`,
                },
                python: {
                    // Python examples...
                }
            };

            return examples[analysis.language]?.[topic] || examples[analysis.language]?.default;
        }

        function improveCodeResponse(response, analysis) {
            let improved = response;

            if (analysis.needsExample) {
                const example = generateCodeExample(analysis, 'example');
                if (example) {
                    improved += `\n\nإليك مثال توضيحي:\n\`\`\`${analysis.language}\n${example}\n\`\`\``;
                }
            }

            if (analysis.isDebugging) {
                improved += '\n\nنصائح للتصحيح:\n1. تحقق من الأخطاء الشائعة\n2. استخدم أدوات التصحيح\n3. راجع التوثيق';
            }

            if (analysis.conceptual) {
                improved += '\n\nمصادر إضافية للتعلم:\n• التوثيق الرسمي\n• MDN Web Docs\n• GitHub Examples';
            }

            return improved;
        }

        function improveResponse(response, context) {
            let improved = response;

            if (context.metadata.topics.includes('educational')) {
                improved += '\n\nمثال توضيحي:\n```javascript\n// كود توضيحي\n```';
            }

            if (context.metadata.requiresCode) {
                improved = improved.replace(/`([^`]+)`/g, '```javascript\n$1\n```');
            }

            if (context.metadata.complexity.complexity > 5) {
                improved += '\n\nمصادر إضافية للقراءة:\n• مستندات MDN\n• Stack Overflow\n';
            }

            return improved;
        }

        function formatCode(text) {
            if (text.includes('```')) {
                return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => `
                    <div class="code-block">
                        <button class="copy-button" onclick="copyCode(this)">
                            <i class="fas fa-copy"></i>
                        </button>
                        <pre><code>${escapeHtml(code.trim())}</code></pre>
                    </div>
                `);
            }
            return text;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function copyCode(button) {
            const code = button.nextElementSibling.textContent;
            navigator.clipboard.writeText(code);
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }

        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        let currentChatId = null;

        function saveChat(messages) {
            if (!currentChatId) {
                currentChatId = Date.now();
                const firstMessage = messages.match(/<strong>You:<\/strong> (.*?)<\/p>/);
                const title = firstMessage ? firstMessage[1].substring(0, 30) + '...' : 'محادثة جديدة';
                
                chats.push({
                    id: currentChatId,
                    title: title,
                    date: new Date().toLocaleDateString('ar'),
                    messages: messages
                });
                localStorage.setItem('chats', JSON.stringify(chats));
                updateChatList();
            } else {
                const chatIndex = chats.findIndex(chat => chat.id === currentChatId);
                if (chatIndex !== -1) {
                    chats[chatIndex].messages = messages;
                    localStorage.setItem('chats', JSON.stringify(chats));
                }
            }
        }

        function updateChatList() {
            const chatList = document.getElementById('chatList');
            chatList.innerHTML = chats.map(chat => `
                <div class="chat-item">
                    <div onclick="loadChat(${chat.id})">
                        <i class="fas fa-comment action-icon"></i>${chat.title}
                    </div>
                    <div class="chat-item-controls">
                        <button onclick="editChatTitle(${chat.id})">
                            <i class="fas fa-edit"></i>تعديل
                        </button>
                        <button onclick="deleteChat(${chat.id})">
                            <i class="fas fa-trash"></i>حذف
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function loadChat(chatId) {
            const chat = chats.find(c => c.id === chatId);
            if (chat) {
                currentChatId = chatId;
                const chatArea = document.getElementById('chatArea');
                chatArea.innerHTML = chat.messages;
            }
        }

        function editChatTitle(chatId) {
            const chat = chats.find(c => c.id === chatId);
            const newTitle = prompt('أدخل العنوان الجديد:', chat.title);
            if (newTitle) {
                chat.title = newTitle;
                localStorage.setItem('chats', JSON.stringify(chats));
                updateChatList();
            }
        }

        function deleteChat(chatId) {
            if (confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
                chats = chats.filter(chat => chat.id !== chatId);
                localStorage.setItem('chats', JSON.stringify(chats));
                if (currentChatId === chatId) {
                    currentChatId = null;
                    document.getElementById('chatArea').innerHTML = '';
                }
                updateChatList();
            }
        }

        function clearAllChats() {
            if (confirm('هل أنت متأكد من حذف جميع المحادثات؟')) {
                chats = [];
                localStorage.removeItem('chats');
                currentChatId = null;
                document.getElementById('chatArea').innerHTML = '';
                updateChatList();
            }
        }

        function updateTemperature(value) {
            const temp = value / 100;
            aiConfig.temperature = temp;
            document.getElementById('temperatureValue').textContent = temp.toFixed(2);
            localStorage.setItem('aiConfig', JSON.stringify(aiConfig));
        }

        function updateMaxTokens(value) {
            aiConfig.maxTokens = parseInt(value);
            localStorage.setItem('aiConfig', JSON.stringify(aiConfig));
        }

        async function sendMessage() {
            const userInput = document.getElementById('userInput');
            const chatArea = document.getElementById('chatArea');
            const message = userInput.value;

            if (!message) return;

            chatArea.innerHTML += `
                <p>
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="message-content">
                        <strong>You:</strong> ${message}
                    </div>
                </p>
            `;
            
            chatArea.innerHTML += `
                <p class="loading">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        AI is thinking...
                    </div>
                </p>
            `;
            
            userInput.value = '';

            try {
                const context = createContext(message);
                const codeAnalysis = analyzeCodeRequest(message);
                
                const enhancedPrompt = `
                    ${AI_PERSONA.personality}
                    
                    خبرات في: ${AI_PERSONA.capabilities[codeAnalysis.language]?.join(', ')}
                    
                    تحليل الطلب:
                    - اللغة: ${codeAnalysis.language}
                    - المستوى: ${codeAnalysis.complexity}
                    - نوع الطلب: ${codeAnalysis.needsExample ? 'يحتاج مثال' : 'شرح عام'}
                    
                    السياق السابق:
                    ${AI_PERSONA.contextMemory.slice(-3).map(c => c.message).join('\n')}
                    
                    الرسالة الحالية: ${message}
                `;

                const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: enhancedPrompt }]
                        }],
                        generationConfig: {
                            temperature: codeAnalysis.complexity === 'advanced' ? 0.3 : 0.7,
                            maxOutputTokens: Math.max(2048, message.length * 2),
                            topP: 0.95,
                            presencePenalty: 0.6,
                            frequencyPenalty: 0.5
                        }
                    })
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('نموذج Gemini غير متوفر / Model not available');
                    } else if (response.status === 401) {
                        throw new Error('خطأ في مفتاح API / Invalid API key');
                    } else {
                        throw new Error(`خطأ في الاتصال: ${response.status} / HTTP error: ${response.status}`);
                    }
                }

                const data = await response.json();
                
                chatArea.innerHTML = chatArea.innerHTML.replace('<p class="loading">AI is thinking...</p>', '');

                if (data.candidates && data.candidates[0].content) {
                    let aiResponse = data.candidates[0].content.parts[0].text;
                    aiResponse = await enhanceAIResponse(aiResponse, codeAnalysis);
                    aiResponse = improveCodeResponse(aiResponse, codeAnalysis);
                    chatArea.innerHTML = chatArea.innerHTML.replace(
                        /<p class="loading">[\s\S]*?<\/p>/,
                        `<p>
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <strong>Red AI:</strong> ${aiResponse}
                            </div>
                        </p>`
                    );
                }
            } catch (error) {
                chatArea.innerHTML = chatArea.innerHTML.replace('<p class="loading">AI is thinking...</p>');
                chatArea.innerHTML += `<p class="error">${error.message}</p>`;
                console.error('Error:', error);
            }
            
            chatArea.scrollTop = chatArea.scrollHeight;

            setTimeout(() => {
                const chatArea = document.getElementById('chatArea');
                chatArea.scrollTop = chatArea.scrollHeight + 100;
                const lastMessage = chatArea.lastElementChild;
                if (lastMessage) {
                    lastMessage.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center'
                    });
                }
            }, 100);

            saveChat(chatArea.innerHTML);
        }

        function exportChats() {
            const data = JSON.stringify(chats, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'red-ai-chats.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const fontSize = localStorage.getItem('fontSize') || 'medium';
            const themeStyle = localStorage.getItem('themeStyle') || 'default';
            
            document.getElementById('fontSize').value = fontSize;
            document.getElementById('themeStyle').value = themeStyle;
            
            changeFontSize(fontSize);
            changeThemeStyle(themeStyle);

            const savedAIConfig = localStorage.getItem('aiConfig');
            if (savedAIConfig) {
                aiConfig = JSON.parse(savedAIConfig);
                document.getElementById('temperature').value = aiConfig.temperature * 100;
                document.getElementById('temperatureValue').textContent = aiConfig.temperature.toFixed(2);
                document.getElementById('maxTokens').value = aiConfig.maxTokens;
            }
        });

        updateChatList();
    };

    // تنفيذ الكود المشفر
    try {
        (new Function(code.toString()))();
    } catch (error) {
        console.error('Error initializing application');
    }
})();

// Additional protection layer
window.addEventListener('DOMContentLoaded', function() {
    if (window.innerHeight === 0 || 
        window.innerWidth === 0 || 
        window.outerWidth === 0 || 
        window.outerHeight === 0) {
        window.location.href = "about:blank";
    }
});