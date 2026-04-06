app.post('/send-command', async (req, res) => {
    const { command, history } = req.body;

    // إرسال التاريخ كامل لـ Gemini عشان يعرف سياق السوالف
    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: history.map(h => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }]
            }))
        })
    });

    const data = await response.json();
    const aiReply = data.candidates[0].content.parts[0].text;

    // إذا الرد فيه كود، نخزنه للبلوقن
    if (aiReply.includes("```lua")) {
        lastAiResponse = { text: aiReply, status: "pending" };
    }

    res.json({ success: true, reply: aiReply });
});
