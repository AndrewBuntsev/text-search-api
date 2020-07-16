const fetch = require('node-fetch');

const { MAX_ATTEMPT } = require('../const');
const { RANGE_INFO_ENDPOINT, DIVISOR_INFO_ENDPOINT } = require('../urls');

module.exports = (app) => {
    app.get('/', async (req, res) => {
        //Get the range info
        let attemptsLeft = MAX_ATTEMPT;
        let rangeInfo;
        do {
            if (rangeInfo && rangeInfo.error) {
                console.warn(`RangeInfo endpoint returned the error: ${rangeInfo.error}. ${attemptsLeft} attempyts left`);
            }
            rangeInfo = await getRangeInfo();
            attemptsLeft--;
        } while (rangeInfo.error && attemptsLeft)

        if (rangeInfo.error) {
            res.json({ error: rangeInfo.error });
            return;
        }

        //Get the divisor info
        attemptsLeft = MAX_ATTEMPT;
        let divisorArray;
        do {
            if (divisorArray && divisorArray.error) {
                console.warn(`DivisorInfo endpoint returned the error: ${divisorArray.error}. ${attemptsLeft} attempyts left`);
            }
            divisorArray = await getDivisorArray();
            attemptsLeft--;
        } while (divisorArray.error && attemptsLeft)

        if (divisorArray.error) {
            res.json({ error: divisorArray.error });
            return;
        }

        const { lower, upper } = rangeInfo;
        let resultString = '';
        for (let div = lower; div <= upper; div++) {
            resultString += `${div}: ${divisorArray.filter(d => div % d.divisor == 0).reduce((acc, d) => acc + d.output, '')}<br />`;
        }

        res.send(resultString);

    });
};


//Returns the range info if possible, otherwise returns error
async function getRangeInfo() {
    try {
        //Fetch data from the endpoint
        const rangeInfo = await fetch(RANGE_INFO_ENDPOINT).then(result => result.json());

        //Check if the data is valid
        const { lower, upper } = rangeInfo;
        if (isNaN(lower) || isNaN(upper) || lower > upper) {
            return { error: 'Invalid Range Info' };
        }

        //The data is valid
        return rangeInfo;
    }
    catch (err) {
        //Something is wrong with the data
        return { error: err };
    }
}

//Returns the divisor info if possible, otherwise returns error
async function getDivisorArray() {
    try {
        //Fetch data from the endpoint
        const divisorInfo = await fetch(DIVISOR_INFO_ENDPOINT).then(result => result.json());

        //Check if the data is valid
        const divisorArray = Array.from(divisorInfo.outputDetails);
        if (!Array.isArray(divisorArray)) {
            return { error: 'Invalid Divisor Info' };
        }

        //The data is valid
        return divisorArray;
    }
    catch (err) {
        return { error: err };
    }
}

