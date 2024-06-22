const express = require('express');
const openai = require('openai');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
console.log(process.env.PORT);

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is missing or empty");
}

const openaiInstance = new openai({
  apiKey: apiKey
});

app.use(express.json());

app.post('/analyze-code', async (req, res) => {
  const code = req.body.code;
  console.log(typeof(code));
  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "You will be provided with code, and your task is to calculate its time complexity. Only Provide Time Complexity without explaination"
            }
          ]
        },
        {
          "role": "user",
          "content": code
          
        }
      ],
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(response);
    const timeComplexity = response.choices[0].message;

    res.json({ timeComplexity });
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).send('Error: Could not analyze code');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
