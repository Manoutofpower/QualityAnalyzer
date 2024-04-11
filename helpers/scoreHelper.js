function getContentScore(userAnswer, topic) {
    const topics = topic.split('|');

    let score = 1;
    let explain = "Your answer not relevant to topic.";

    if (score > 1) {
        explain = "Your answer is relevant to the topic.";
    }

    for (let i = 0; i < topics.length; i++) {
        if (userAnswer.includes(topics[i])) {
            score += 1;
        }
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