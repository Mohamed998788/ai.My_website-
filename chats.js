const ChatManager = {
    chats: JSON.parse(localStorage.getItem('chats')) || [],
    currentChatId: null,

    init() {
        try {
            const savedChats = localStorage.getItem('chats');
            if (savedChats) {
                this.chats = this.decryptData(savedChats);
                
                // تحميل آخر محادثة
                if (this.chats.length > 0) {
                    const lastChat = this.chats[0];
                    this.loadChat(lastChat.id);
                }
            }
            this.updateSidebar();
            
            // إضافة مراقب للتخزين المحلي
            window.addEventListener('storage', (e) => {
                if (e.key === 'chats') {
                    this.validateLocalStorage();
                }
            });
        } catch (error) {
            console.error('Error initializing chats:', error);
            this.handleTampering();
        }
    },

    loadChats() {
        try {
            const savedChats = localStorage.getItem('chats');
            if (savedChats) {
                this.chats = this.decryptData(savedChats);
            }
        } catch (error) {
            console.error('Error loading chats');
            this.chats = [];
        }
        this.updateSidebar();
    },

    encryptData(data) {
        // تشفير بسيط للبيانات
        return btoa(JSON.stringify(data));
    },

    decryptData(encrypted) {
        // فك تشفير البيانات
        return JSON.parse(atob(encrypted));
    },

    validateLocalStorage() {
        const currentData = localStorage.getItem('chats');
        const savedHash = localStorage.getItem('chatsHash');
        if (currentData && savedHash && this.generateHash(currentData) !== savedHash) {
            // تم اكتشاف تلاعب
            this.handleTampering();
        }
    },

    generateHash(data) {
        // إنشاء hash بسيط للبيانات
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString();
    },

    handleTampering() {
        try {
            // حذف البيانات المخزنة
            this.chats = [];
            localStorage.removeItem('chats');
            localStorage.removeItem('chatsHash');
            
            // إرسال إشعار للحماية
            Protection.handleTampering();
            
            // تنظيف واجهة المستخدم
            const chatArea = document.getElementById('chatArea');
            if (chatArea) chatArea.innerHTML = '';
            this.updateSidebar();
        } catch {
            window.location.reload();
        }
    },

    startNewChat() {
        this.currentChatId = null;
        document.getElementById('chatArea').innerHTML = '';
        document.getElementById('userInput').value = '';
        this.updateSidebar();
    },

    updateSidebar() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = this.chats
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map(chat => `
                <div class="chat-item ${chat.id === this.currentChatId ? 'active' : ''}">
                    <div class="chat-item-header" onclick="ChatManager.loadChat(${chat.id})">
                        <i class="fas fa-comments"></i>
                        <span class="chat-title">${chat.title}</span>
                    </div>
                    <div class="chat-actions">
                        <button onclick="event.stopPropagation(); ChatManager.editChatTitle(${chat.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); ChatManager.deleteChat(${chat.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    },

    editChatTitle(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        const currentTitle = chat.title;
        const newTitle = prompt('أدخل العنوان الجديد:', currentTitle);
        
        if (newTitle && newTitle !== currentTitle) {
            chat.title = newTitle;
            chat.lastUpdated = Date.now();
            const encryptedData = this.encryptData(this.chats);
            localStorage.setItem('chats', encryptedData);
            localStorage.setItem('chatsHash', this.generateHash(encryptedData));
            this.updateSidebar();
        }
    },

    loadChat(chatId) {
        try {
            const chat = this.chats.find(c => c.id === chatId);
            if (chat) {
                this.currentChatId = chatId;
                const chatArea = document.getElementById('chatArea');
                chatArea.innerHTML = this.decryptData(chat.messages);
                
                // تحديث حالة النشاط في القائمة الجانبية
                this.updateSidebar();
                
                // تمرير للرسالة الأخيرة
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    },

    deleteChat(chatId) {
        // Delete chat logic
    },

    saveChat(messages) {
        try {
            if (!this.currentChatId) {
                this.currentChatId = Date.now();
                const firstMessage = messages.match(/<strong>You:<\/strong>(.*?)<\/p>/);
                const title = firstMessage ? 
                    firstMessage[1].trim().substring(0, 30) + '...' : 
                    'محادثة جديدة';

                this.chats.unshift({
                    id: this.currentChatId,
                    title: title,
                    date: new Date().toLocaleDateString('ar'),
                    messages: this.encryptData(messages),
                    lastUpdated: Date.now()
                });
            } else {
                const chatIndex = this.chats.findIndex(c => c.id === this.currentChatId);
                if (chatIndex !== -1) {
                    this.chats[chatIndex].messages = this.encryptData(messages);
                    this.chats[chatIndex].lastUpdated = Date.now();
                }
            }

            const encryptedChats = this.encryptData(this.chats);
            localStorage.setItem('chats', encryptedChats);
            localStorage.setItem('chatsHash', this.generateHash(encryptedChats));
            this.updateSidebar();
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    }
};

// تصدير الوظائف للنطاق العام
window.startNewChat = () => ChatManager.startNewChat();
window.editChatTitle = (id) => ChatManager.editChatTitle(id);
window.deleteChat = (id) => ChatManager.deleteChat(id);
window.loadChat = (id) => ChatManager.loadChat(id);

// تهيئة المدير عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    ChatManager.init();
});
