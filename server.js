const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 禅师模拟回复功能
function getZenResponse(userMessage) {
  // 一些禅师风格的回复
  const zenResponses = [
    "静心观照自己的内心，答案往往就在不言中。",
    "放下执念，心如明镜，自然能见本来面目。",
    "万法皆空，心若无物，困惑自解。",
    "烦恼即是菩提，修行在于日常。",
    "人生如梦，得失随缘，心安即是归处。",
    "不执着于外相，返照内心，智慧自现。",
    "一花一世界，一叶一菩提，看破执念，方能自在。",
    "心若平静如水，映照万物本来面目。",
    "活在当下，不念过去，不畏将来，便是修行。",
    "万事皆有因果，心平气和，自然明了。"
  ];
  
  // 简单的关键词匹配
  if (userMessage.includes("痛苦") || userMessage.includes("苦恼")) {
    return "痛苦来源于执着，放下执念，自得清净。";
  } else if (userMessage.includes("烦恼") || userMessage.includes("困扰")) {
    return "烦恼即是菩提，转念即是觉悟。";
  } else if (userMessage.includes("迷茫") || userMessage.includes("不知所措")) {
    return "心若不动，水波不兴。静下心来，方向自现。";
  } else if (userMessage.includes("压力") || userMessage.includes("焦虑")) {
    return "一切皆是幻相，不必太过认真，随缘而行，自在无忧。";
  }
  
  // 随机返回一个禅师回复
  return zenResponses[Math.floor(Math.random() * zenResponses.length)];
}

// 代理API请求
app.post('/api/chat', async (req, res) => {
    try {
        const { api_key, ...requestBody } = req.body;
        const userMessage = requestBody.messages.find(msg => msg.role === "user")?.content || "";
        
        console.log('收到用户消息:', userMessage);
        
        // 尝试调用SiliconFlow API
        try {
            console.log('尝试连接SiliconFlow API...');
            
            // 使用SiliconFlow API端点
            const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
            
            // 准备请求体
            const apiRequestBody = {
                model: "deepseek-ai/DeepSeek-V3", // 使用文档推荐的模型
                messages: requestBody.messages,
                temperature: requestBody.temperature || 0.7,
                top_p: requestBody.top_p || 0.7,
                max_tokens: requestBody.max_tokens || 512,
                stream: false
            };
            
            console.log('发送请求体:', JSON.stringify(apiRequestBody, null, 2));
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}` // 使用环境变量中的API密钥
                },
                body: JSON.stringify(apiRequestBody),
                timeout: 10000
            });
            
            console.log('API响应状态:', response.status);
            
            // 检查响应内容类型和状态
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('API响应数据:', data);
                
                if (response.ok) {
                    return res.json(data);
                } else {
                    console.log('API返回错误:', data);
                    throw new Error(`API错误: ${data.error?.message || '未知错误'}`);
                }
            } else {
                const textResponse = await response.text();
                console.log('API返回非JSON响应:', textResponse);
                throw new Error('API返回格式错误');
            }
            
        } catch (apiError) {
            console.log('API调用异常，切换到模拟响应:', apiError.message);
            
            // 使用模拟回复
            const zenResponse = getZenResponse(userMessage);
            
            // 返回格式化的模拟响应（符合SiliconFlow响应格式）
            return res.json({
                id: `zen-${Date.now()}`,
                choices: [{
                    message: {
                        role: "assistant",
                        content: zenResponse
                    },
                    finish_reason: "stop"
                }],
                usage: {
                    prompt_tokens: userMessage.length,
                    completion_tokens: zenResponse.length,
                    total_tokens: userMessage.length + zenResponse.length
                },
                created: Math.floor(Date.now() / 1000),
                model: "local-zen-master",
                object: "chat.completion"
            });
        }
        
    } catch (error) {
        console.error('服务器错误:', error);
        res.status(500).json({ 
            error: { 
                message: `服务暂时不可用，请稍后再试`
            } 
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`禅师智慧服务已启动，访问 http://localhost:${PORT}`);
}); 