const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // للموقع

let currentCommand = { text: "", status: "empty" };

// الموقع يرسل الأمر هنا
app.post('/send-command', (req, res) => {
    currentCommand = { text: req.body.command, status: "pending" };
    console.log("تم استقبال أمر جديد: " + req.body.command);
    res.json({ success: true });
});

// روبلوكس تسحب الأمر من هنا
app.get('/get-command', (req, res) => {
    if (currentCommand.status === "pending") {
        res.json(currentCommand);
        currentCommand.status = "empty"; // تفريغ الأمر بعد سحبه
    } else {
        res.json({ status: "empty" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
