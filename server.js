const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // ملفات الموقع (الصفحة البنفسجية)

let lastAiResponse = { text: "", status: "empty" };

// مفتاح Gemini اللي جبته
const GEMINI_API_KEY = "AIzaSyBK0Pli2s1GnA0-JQbEvGGfqmCzTOi3GYo"; 

app.post('/send-command', async (req, res) => {
    const userPrompt = req.body.command;
    
    // جالاكسي يكلم Gemini بتقنيات أنتيقرافتي
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `أنت Antigravity، خبير Luau. برمج لمجود: ${userPrompt}` }] }]
        })
    });

    const data = await response.json();
    const aiCode = data.candidates[0].content.parts[0].text;

    // تخزين الكود في "صندوق البريد" للبلوقن
    lastAiResponse = { text: aiCode, status: "pending" };
    res.json({ success: true, reply: aiCode });
});

// هذا الرابط اللي البلوقن بيشيك عليه كل 3 ثواني
app.get('/get-command', (req, res) => {
    res.json(lastAiResponse);
    if (lastAiResponse.status === "pending") lastAiResponse.status = "empty"; 
});

app.listen(port, () => console.log("Galaxy Server Live!"));
