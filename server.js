const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/send-rsvp", async (req, res) => {

    try {

        const { name, attendance } = req.body;

        let answer = "";

        if (attendance === "alone") {
            answer = "Да, приду один(одна)";
        }

        if (attendance === "couple") {
            answer = "Да, приду с супругом(-ой)";
        }

        if (attendance === "no") {
            answer = "Нет, не смогу прийти";
        }

        const message =
            "💍 НОВОЕ ПОДТВЕРЖДЕНИЕ\n\n" +
            "👤 Гость: " + name + "\n\n" +
            "📋 Ответ: " + answer;

        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: message
            }
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error.response?.data || error);

        res.status(500).json({
            success: false
        });

    }

});

app.listen(process.env.PORT || 3000, () => {
    console.log("SERVER STARTED");
});
