const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let currentCommand = { text: "", status: "empty" };

// مفتاح Gemini اللي عطيته لي
const GEMINI_API_KEY = "AIzaSyBK0Pli2s1GnA0-JQbEvGGfqmCzTOi3GYo"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post('/send-command', async (req, res) => {
    const userPrompt = req.body.command;
    
    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `أنت Antigravity، خبير برمجة Roblox Luau ومساعد المطور مجود. 
                        استخدم معايير Strict Luau و task library. 
                        صمم الأنظمة لـ Time Bomb Duels. 
                        رد بالكود فقط مع شرح بسيط جداً بالعربي. 
                        الطلب الحالي: ${userPrompt}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // تخزين الرد لروبلوكس
        currentCommand = { text: aiResponse, status: "pending" };
        res.json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("خطأ في Gemini:", error);
        res.status(500).json({ error: "فشل الاتصال بالذكاء الاصطناعي" });
    }
});

app.get('/get-command', (req, res) => {
    if (currentCommand.status === "pending") {
        res.json(currentCommand);
        currentCommand.status = "empty";
    } else {
        res.json({ status: "empty" });
    }
});

app.listen(port, () => console.log(`Galaxy AI is Live on port ${port}!`));
