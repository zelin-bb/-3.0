document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // API配置
    const API_KEY = 'sk-buvxqwnqaimhgdgoxleqybsoyahkbvgjdfvxwcucpyvsgsqu'; // SiliconFlow API密钥
    const API_URL = 'http://localhost:3000/api/chat';  // 使用完整的服务器地址

    // 添加消息到聊天界面
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'master'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // 滚动到最新消息
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 添加思考中的状态
    function addThinkingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message master';
        messageDiv.id = 'thinking-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = '思考中<span class="dot-animation">...</span>';
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // 滚动到最新消息
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }

    // 移除思考中的状态
    function removeThinkingMessage() {
        const thinkingMessage = document.getElementById('thinking-message');
        if (thinkingMessage) {
            thinkingMessage.remove();
        }
    }

    // 调用API
    async function getMasterResponse(userMessage) {
        try {
            console.log('准备发送请求...');
            const requestBody = {
                messages: [
                    {
                        role: "system",
                        content: "你是一位智慧的禅师，善于用禅宗的智慧帮助人们解决困惑。你的回答应该富有哲理，平和宁静，引导人们思考。每次回答都要用禅宗的方式，帮助人们放下执念，看破红尘。"
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                model: "deepseek-ai/DeepSeek-V3", // SiliconFlow推荐的模型
                temperature: 0.7,
                top_p: 0.7,
                max_tokens: 512,
                stream: false,
                api_key: API_KEY
            };

            console.log('发送请求体:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('收到响应状态:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API错误响应:', errorText);
                throw new Error(`请求失败: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);

            if (data.error) {
                throw new Error(data.error.message || '未知错误');
            }

            // 适配不同的API响应格式
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                return content;
            } else {
                throw new Error('响应格式异常');
            }
        } catch (error) {
            console.error('API调用错误:', error);
            return `阿弥陀佛，禅房暂时无法回应。请稍后再来。(${error.message})`;
        }
    }

    // 发送消息
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // 禁用输入和发送按钮
        userInput.disabled = true;
        sendButton.disabled = true;

        try {
            // 添加用户消息
            addMessage(message, true);
            userInput.value = '';

            // 显示思考中状态
            const thinkingMessage = addThinkingMessage();

            // 获取并添加禅师回复
            const response = await getMasterResponse(message);
            
            // 移除思考中状态
            removeThinkingMessage();
            
            // 显示回复
            addMessage(response, false);
        } catch (error) {
            console.error('发送消息错误:', error);
            
            // 移除思考中状态
            removeThinkingMessage();
            
            addMessage(`阿弥陀佛，禅房暂时无法回应。请稍后再来。(${error.message})`, false);
        } finally {
            // 启用输入和发送按钮
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // 事件监听
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .dot-animation {
            display: inline-block;
            animation: dotAnimation 1.5s infinite;
        }
        
        @keyframes dotAnimation {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
        }
    `;
    document.head.appendChild(style);
}); 