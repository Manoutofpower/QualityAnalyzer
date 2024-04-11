function getContentScore(userAnswer, topic) {
    const topics = topic.split('|');
    let score = 1;

    let cutoffComma = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"");
    let lowercase = cutoffComma.toLowerCase().split(/\s+/);
    let splitWords = lowercase.map(word => {
        // Get Rid of all 's and s'
        return word.replace(/'s$/, '').replace(/s'$/, '');
    });

    topics.forEach(topicWord => {
        if (splitWords.includes(topicWord)){
            score += 1;
        }
    });

    let explain;
    switch (score) {
        case 1:
            explain = "Does not address the topic or task.";
            break;
        case 2:
            explain = "Addresses the task only minimally with very limited relevance.";
            break;
        case 3:
            explain = "Addresses the task only partially; the response is largely irrelevant.";
            break;
        case 4:
            explain = "Responds to the task only to a limited extent. Some key information may be missing.";
            break;
        case 5:
            explain = "Generally addresses the task; key information is presented but may lack detail.";
            break;
        case 6:
            explain = "Addresses the task adequately, but some key information may be inaccurately or incompletely covered.";
            break;
        case 7:
            explain = "Addresses all parts of the task, although some parts may be more fully covered than others.";
            break;
        case 8:
            explain = "Covers the task in detail with relevant, accurate content throughout.";
            break;
        case 9:
            explain = "Fully addresses the requirements of the task with complete and fully relevant responses.";
            break;
        default:
            explain = "Score";
            break;
    }

    return {score: score, explain: explain};
}


function getCoherenceScore(word) {
    //TODO GET COHERENCE SCORE
    return {score: 1, explain: "2"};
}

function getLexicalScore(word) {
    //TODO GET LEXICAL SCORE
    return {score: 1, explain: "2"};
}

function getGrammarScore(word) {
    //TODO GET GRAMMAR SCORE
    return {score: 1, explain: "2"};
}

const ScoreHelper = {
    getContentScore, getCoherenceScore, getLexicalScore, getGrammarScore
};

export default ScoreHelper;