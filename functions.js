const AppFunctions = {
    sendMessage: async function() {
        const userInput = document.getElementById('userInput');
        const chatArea = document.getElementById('chatArea');
        const message = userInput.value;

        if (!message) return;

        try {
            chatArea.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
            chatArea.innerHTML += `<p class="loading">AI is thinking...</p>`;
            userInput.value = '';

            // API call and message handling
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: message }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            chatArea.innerHTML = chatArea.innerHTML.replace('<p class="loading">AI is thinking...</p>', '');
            
            if (data.candidates && data.candidates[0].content) {
                chatArea.innerHTML += `<p><strong>Red AI:</strong> ${data.candidates[0].content.parts[0].text}</p>`;
            }

        } catch (error) {
            chatArea.innerHTML = chatArea.innerHTML.replace('<p class="loading">AI is thinking...</p>', '');
            chatArea.innerHTML += `<p class="error">حدث خطأ في الاتصال</p>`;
        }

        chatArea.scrollTop = chatArea.scrollHeight;
    },

    toggleSidebar: function() {
        document.querySelector('.sidebar').classList.toggle('active');
    },

    showSettings: function() {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('settingsOverlay').style.display = 'block';
    },

    closeSettings: function() {
        document.getElementById('settingsModal').style.display = 'none';
        document.getElementById('settingsOverlay').style.display = 'none';
    }
};

// تصدير الوظائف للنافذة
window.sendMessage = AppFunctions.sendMessage;
window.toggleSidebar = AppFunctions.toggleSidebar;
window.showSettings = AppFunctions.showSettings;
window.closeSettings = AppFunctions.closeSettings;
