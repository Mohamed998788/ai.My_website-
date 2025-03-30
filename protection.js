(function() {
    'use strict';

    const Protection = {
        init() {
            this.setupAntiDebug();
            this.setupAntiTampering();
            this.protectGlobalObjects();
            this.startMonitoring();
        },

        setupAntiDebug() {
            // منع أدوات المطور
            const handlers = {
                keydown: e => {
                    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && 
                        (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
                        e.preventDefault();
                        return false;
                    }
                },
                contextmenu: e => e.preventDefault(),
                selectstart: e => e.preventDefault(),
            };

            Object.entries(handlers).forEach(([event, handler]) => {
                document.addEventListener(event, handler, { passive: false });
            });

            setInterval(() => {
                debugger;
                if (window.outerHeight - window.innerHeight > 100 || 
                    window.outerWidth - window.innerWidth > 100) {
                    this.handleTampering();
                }
            }, 1000);
        },

        setupAntiTampering() {
            const originalFunctions = {
                eval: window.eval,
                Function: window.Function,
                fetch: window.fetch,
                XMLHttpRequest: window.XMLHttpRequest,
                WebSocket: window.WebSocket
            };

            // حماية الدوال الأساسية
            Object.entries(originalFunctions).forEach(([key, value]) => {
                Object.defineProperty(window, key, {
                    value: value,
                    writable: false,
                    configurable: false
                });
            });
        },

        protectGlobalObjects() {
            const protect = obj => {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'function') {
                        const original = obj[key];
                        Object.defineProperty(obj, key, {
                            value: function(...args) {
                                if (Protection.isValidCall()) {
                                    return original.apply(this, args);
                                }
                                return null;
                            },
                            writable: false,
                            configurable: false
                        });
                    }
                });
            };

            protect(window);
            protect(document);
        },

        startMonitoring() {
            // مراقبة تغييرات DOM
            const observer = new MutationObserver(() => {
                this.checkIntegrity();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // مراقبة الشبكة
            this.interceptNetworkRequests();
        },

        checkIntegrity() {
            // التحقق من سلامة العناصر الرئيسية
            const criticalElements = ['chatArea', 'userInput', 'settingsModal'];
            if (!criticalElements.every(id => document.getElementById(id))) {
                this.handleTampering();
            }
        },

        interceptNetworkRequests() {
            const original = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (Protection.isValidRequest(url)) {
                    return original.apply(this, arguments);
                }
                return false;
            };
        },

        isValidRequest(url) {
            // التحقق من صحة الطلبات
            const allowedDomains = [
                'generativelanguage.googleapis.com',
                'fonts.googleapis.com',
                'cdnjs.cloudflare.com'
            ];
            try {
                const urlObj = new URL(url);
                return allowedDomains.some(domain => urlObj.hostname.includes(domain));
            } catch {
                return false;
            }
        },

        isValidCall() {
            // التحقق من مصدر الاستدعاء
            const stack = new Error().stack;
            return !stack.includes('debugger') && !stack.includes('eval');
        },

        handleTampering() {
            try {
                // تسجيل محاولة التلاعب
                const attempts = parseInt(localStorage.getItem('securityAttempts') || '0') + 1;
                localStorage.setItem('securityAttempts', attempts);

                // إذا تجاوزت المحاولات 3 مرات
                if (attempts > 3) {
                    localStorage.clear();
                    sessionStorage.clear();
                    document.documentElement.innerHTML = `
                        <div style="text-align: center; padding: 50px; direction: rtl;">
                            <h1 style="color: #ff0000;">تم إيقاف التطبيق</h1>
                            <p>تم اكتشاف محاولات متكررة للتلاعب بالتطبيق</p>
                            <p>يرجى إعادة تشغيل المتصفح للمتابعة</p>
                        </div>`;
                    
                    // تعطيل جميع الوظائف
                    window.onload = null;
                    window.onunload = null;
                    window.onbeforeunload = null;
                    
                    // منع إعادة التحميل التلقائي
                    window.location.replace('about:blank');
                } else {
                    alert(`تحذير: تم اكتشاف محاولة تلاعب! (${attempts}/3)`);
                    window.location.reload();
                }
            } catch (error) {
                window.location.href = 'about:blank';
            }
        },

        enhancedProtection() {
            // التحقق من سلامة localStorage
            const validateStorage = () => {
                try {
                    const data = localStorage.getItem('chats');
                    if (data && (data.includes('<script') || data.includes('javascript:'))) {
                        return false;
                    }
                    return true;
                } catch {
                    return false;
                }
            };

            // التحقق من نزاهة DOM
            const validateDOM = () => {
                const scripts = document.getElementsByTagName('script');
                for (let script of scripts) {
                    if (!script.hasAttribute('src') || 
                        !this.isValidScript(script.getAttribute('src'))) {
                        return false;
                    }
                }
                return true;
            };

            setInterval(() => {
                if (!validateStorage() || !validateDOM()) {
                    this.handleTampering();
                }
            }, 1000);
        },

        isValidScript(src) {
            const allowedScripts = [
                'protection.js',
                'functions.js',
                'chats.js',
                'script.js',
                'https://cdnjs.cloudflare.com'
            ];
            return allowedScripts.some(script => src.includes(script));
        }
    };

    // تشغيل الحماية
    Protection.init();
    Protection.enhancedProtection();
})();
