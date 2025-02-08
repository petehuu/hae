const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Lisää oma henkilökohtainen käyttöoikeustunnus (PAT) tähän
const GITHUB_TOKEN = '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';

app.use(express.json());

app.post('/dispatch', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.post(`https://api.github.com/repos/petehuu/hae/actions/workflows/142889037/dispatches`, {
            ref: 'main',
            inputs: { url: url }
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        res.status(200).send('Request sent successfully!');
    } catch (error) {
        console.error(`Error sending the request: ${error.response.status} ${error.response.statusText}`);
        res.status(500).send(`Error sending the request: ${error.response.status} ${error.response.statusText}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
