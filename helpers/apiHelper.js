import axios from "axios";
import Logger from "rklogger";

/**
 * CHECK GRAMMAR RESULT FROM GRAMMARBOT
 * @param word  Testing Text
 * @param cb    CALLBACK
 */
function checkGrammar(word, cb) {
    const encodedParams = new URLSearchParams();
    encodedParams.set('text', word);
    encodedParams.set('language', 'en-US');

    axios.request({
        method: 'POST', url: 'https://grammarbot.p.rapidapi.com/check', headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.RAPID_KEY,
            'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com'
        }, data: encodedParams,
    }).then((response) => {
        Logger.printDebug('[TEXT] checkGrammar response');
        cb(response.data);
    }).catch((error) => {
        Logger.printError('[TEXT] getGrammarResult Error：' + error);
        cb(error);
    });
}

const ApiHelper = {
    checkGrammar
};

export default ApiHelper;