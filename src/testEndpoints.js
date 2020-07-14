const express = require('express');
const app = new express();


//Returns valid range info data with 20% chance
app.get('/test/rangeInfo', async (req, res) => {
    if (Math.random() > 0.8) {
        res.json({ 'lower': 1, 'upper': 100 });
    } else {
        res.json({ error: 'Something weng wrong' });
    }
});

//Returns valid divisor info data with 20% chance
app.get('/test/divisorInfo', async (req, res) => {
    if (Math.random() > 0.8) {
        res.json({
            outputDetails: [
                {
                    'divisor': 3,
                    'output': 'Boss'
                },
                {
                    'divisor': 5,
                    'output': 'Hogg'
                }
            ]
        });
    } else {
        res.json({ error: 'Something weng wrong' });
    }
});

//Returns textToSearch with 20% chance
app.get('/test/textToSearch', async (req, res) => {
    if (Math.random() > 0.8) {
        res.json({ text: "Peter told me (actually he slurrred) that peter the pickle piper piped a pitted pickle before he petered out." });
    } else {
        res.json({ error: 'Something weng wrong' });
    }
});

//Returns subTexts with 20% chance
app.get('/test/subTexts', async (req, res) => {
    if (Math.random() > 0.8) {
        res.json({
            subTexts: [
                "Peter",
                "peter",
                "Pick",
                "Pi",
                "Z"
            ]
        });
    } else {
        res.json({ error: 'Something weng wrong' });
    }
});



const listener = app.listen(9998, () => { console.log('Mock endpoints are listening on port ' + listener.address().port) });