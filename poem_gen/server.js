const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// A simple route to check server status
app.get('/ping', (req, res) => {
  res.send('Pong!');
});

// Serve environment variables to the client
app.get('/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_KEY  // It should be the public 'anon' key, not the secret key
  });
});



app.post('/generate-poem', async (req, res) => {
    const { name } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: `Create a heartwarming and humorous poem about a mother named ${name}, celebrating Mother's Day.`,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json({ poem: response.data.choices[0].text });
    } catch (error) {
        console.error('Error generating poem:', error);
        res.status(500).send('Failed to generate poem');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

