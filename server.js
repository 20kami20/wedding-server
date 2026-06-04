const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = "8662104987:AAE8FBN2bWoKuZ-Q-cYsXRnuf2f1wllHWeI";
const CHAT_ID = "822403920";

app.post("/send-rsvp", async (req, res) => {

    try {

        const { name, attendance } = req.body;

        const path = require("path");

        const guestsFile = path.join(
            __dirname,
            "guests.json"
        );

        const guests = JSON.parse(
            fs.readFileSync(guestsFile, "utf8")
        );

        const alreadyExists = guests.find(
            guest =>
                guest.name.toLowerCase() ===
                name.toLowerCase()
        );

        if (alreadyExists) {

            return res.status(400).json({
                success: false,
                message: "Этот гость уже отправил ответ"
            });

        }

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

        const newGuest = {
            name,
            attendance,
            date: new Date().toISOString()
        };

        guests.push(newGuest);

        fs.writeFileSync(
            "guests.json",
            JSON.stringify(guests, null, 4)
        );

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

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

app.listen(3000, () => {
    console.log("SERVER STARTED");
});