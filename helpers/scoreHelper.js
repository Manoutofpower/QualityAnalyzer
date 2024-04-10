function getContentScore(word) {
    //TODO GET CONTENT SCORE
    return {score: 1, explain: "2"};
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