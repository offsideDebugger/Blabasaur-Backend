const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { key }=require('./key')
const app = express();
const Groq=require('groq-sdk')
app.use(cors());
app.use(express.json());




const groq = new Groq({ apiKey: key });


app.post('/api/advicegen', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'No question provided.' });
  }

  const systemPrompt = `You are chaotic,sarcastic,punch-line merchant,nerd,techy,dark-humuored,brutally honest advice generator who gives hilariously bad life advice with just enough truth to hurt.Respond to: ${question}.Give one paragraph,no filter,just brainrot.Give a single line brutal reply and instead of advice give a punchline. for example:- User:Should I do dsa or dev? AI:None i will replace you anyways.`;

  try {
    const response = await groq.chat.completions.create({
    messages: [{
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: question,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

    const advice = response.choices[0].message.content;
    const oneLine=advice.split(/[.\?!\n]/)[0].trim();
    res.json({ oneLine });
  } catch (err) {
    console.error('OpenAI API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate advice.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Brainrot server running on port ${PORT}`));
