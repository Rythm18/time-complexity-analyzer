const express = require('express');
const openAI = require('openai'); 

const apiKey = process.env.OPENAI_API_KEY;

openAI.apiKey = apiKey;

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json()); // Parse JSON request bodies


app.post('/analyze-code', async (req, res) => {
  try {
    const code = req.body.code;

    console.log('Analyzing code:', code);

    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "You will be provided with code, and your task is to calculate its time complexity.",
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": code
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const data = response.json();
    const timeComplexity = data.choices[0].text.trim(); // Extract time complexity from the response

    res.json({ timeComplexity }); // Send time complexity data back
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).send('Error: Could not analyze code'); // Handle errors gracefully
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
