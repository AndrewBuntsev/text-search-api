const fetch = require('node-fetch');

const { MAX_ATTEMPT } = require('../const');
const { TEXT_TO_SEARCH_ENDPOINT, SUBTEXTS_ENDPOINT, SEARCH_TEXT_SUBMIT } = require('../urls');

module.exports = (app) => {
    app.get('/searchText', async (req, res) => {
        //Get the text to search
        let attemptsLeft = MAX_ATTEMPT;
        let textToSearch;
        do {
            if (textToSearch && textToSearch.error) {
                console.warn(`textToSearch endpoint returned the error: ${textToSearch.error}. ${attemptsLeft} attempyts left`);
            }
            textToSearch = await getTextToSearch();
            attemptsLeft--;
        } while (textToSearch.error && attemptsLeft)

        if (textToSearch.error) {
            res.json({ error: textToSearch.error });
            return;
        }

        //Get the subtexts
        attemptsLeft = MAX_ATTEMPT;
        let subTextsArray;
        do {
            if (subTextsArray && subTextsArray.error) {
                console.warn(`subTexts endpoint returned the error: ${subTextsArray.error}. ${attemptsLeft} attempyts left`);
            }
            subTextsArray = await getSubtexts();
            attemptsLeft--;
        } while (subTextsArray.error && attemptsLeft)

        if (subTextsArray.error) {
            res.json({ error: subTextsArray.error });
            return;
        }

        //Compose the final object
        const result = {
            candidate: 'Andrei Buntsev',
            text: textToSearch,
            results: []
        };
        const textToSearchUpper = textToSearch.toUpperCase();

        subTextsArray.forEach(subText => {
            //Create an array of indices for every subText
            const arr = search(textToSearchUpper, subText.toUpperCase());
            const arrString = arr.length == 0 ? '<No Output>' : arr.reduce((acc, el) => `${acc}${el}, `, '').slice(0, -2);
            result.results.push({
                subtext: subText,
                result: arrString
            });
        });

        console.log(result);

        //Post the result
        attemptsLeft = MAX_ATTEMPT;
        let submitResponse;
        do {
            if (submitResponse && submitResponse.error) {
                console.warn(`Submit endpoint returned the error: ${submitResponse.error}. ${attemptsLeft} attempts left`);
            }
            submitResponse = await postResult(result);
            attemptsLeft--;
        } while (submitResponse.error && attemptsLeft)

        if (submitResponse.error) {
            res.json({ error: submitResponse.error });
            return;
        }

        //Phew! We successfully submitted the data..
        res.json(submitResponse);
    });
};


//Returns the TextToSearch if possible, otherwise returns error
async function getTextToSearch() {
    try {
        //Fetch data from the endpoint
        const { text } = await fetch(TEXT_TO_SEARCH_ENDPOINT).then(result => result.json());;
        //Check if the data is valid
        if (!text) {
            return { error: 'Invalid Text to Search' };
        }

        //The data is valid
        return text;
    }
    catch (err) {
        //Something is wrong with the data
        return { error: err };
    }
}

//Returns the Subtexts if possible, otherwise returns error
async function getSubtexts() {
    try {
        //Fetch data from the endpoint
        const { subTexts } = await fetch(SUBTEXTS_ENDPOINT).then(result => result.json());
        const subTextsArray = Array.from(subTexts);
        //Check if the data is valid
        if (!Array.isArray(subTextsArray)) {
            return { error: 'Invalid Sun Texts' };
        }

        //The data is valid
        return subTextsArray;
    }
    catch (err) {
        //Something is wrong with the data
        return { error: err };
    }
}

//Posts the result to the provided endpoint
async function postResult(data) {
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        const result = fetch(SEARCH_TEXT_SUBMIT, options).then((response) => response.json());
        return result;
    }
    catch (err) {
        //Something is wrong with the endpoint
        return { error: err };
    }
}

//Return the array of indeces like [0,12,23]
function search(text, pattern) {
    if (!text || !pattern) {
        return [];
    }

    let arr = [];

    for (let i = 0; i < text.length; i++) {
        let j = 0;
        while (i + j < text.length && j < pattern.length && text.charAt(i + j) == pattern.charAt(j)) {
            j++;
        }
        if (j == pattern.length) {
            arr.push(i + 1);
            i += (j - 1);
        }
    }

    return arr;
}