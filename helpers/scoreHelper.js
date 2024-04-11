function getContentScore(userAnswer, topic) {
    const topics = topic.split('|');
    let score = 1;

    let cutoffComma = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"");
    let lowercase = cutoffComma.toLowerCase().split(/\s+/);
    let splitWords = lowercase.map(word => {
        // Get Rid of all "'s" and "s'"
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


function getCoherenceScore(userAnswer) {
    const coherenceWords = new Set([
        // The word set
        "and", "but", "or", "nor", "for", "yet", "so",
        "therefore", "however", "moreover", "furthermore", "thus", "consequently", "accordingly", "hence", "meanwhile", "nonetheless",
        "because", "since", "unless", "although", "even though", "while", "when", "whereas", "despite", "in spite of", "regardless",
        "after", "before", "once", "until", "whenever", "during", "as soon as", "by the time",
        "if", "only if", "unless", "until", "provided that", "assuming that", "even if", "in case",
        "as", "like", "such as", "for example", "for instance", "namely", "to illustrate"
    ]);

    const words = userAnswer.toLowerCase().split(/\b\s+/);
    let matchCount = 0;

    words.forEach(word => {
        // Delete possible commas.
        const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        if (coherenceWords.has(cleanedWord)) {
            matchCount += 1;
        }
    });

    // Calculate percentage
    const percentage = (matchCount / words.length) * 100;
    let score;

    // Percentage to Score
    if (percentage < 0) {
        score = 1;
    } else if (percentage < 3) {
        score = 2;
    } else if (percentage < 5) {
        score = 3;
    } else if (percentage < 10) {
        score = 4;
    } else if (percentage < 15) {
        score = 5;
    } else if (percentage < 20) {
        score = 6;
    } else if (percentage < 25) {
        score = 7;
    } else if (percentage < 30) {
        score = 8;
    } else {
        score = 9;
    }

    let explain;
    switch (score) {
        case 1:
            explain = "The text lacks logical organisation and clear paragraphs, making it confusing and difficult to follow.";
            break;
        case 2:
            explain = "Shows some attempt to organize ideas, but connections between sentences are flawed or non-existent.";
            break;
        case 3:
            explain = "Presents some coherent organisation, but the use of cohesive devices is often mechanical or inappropriate.";
            break;
        case 4:
            explain = "Exhibits a basic organisation structure, but the usage of cohesive devices and paragraphing may be inadequate.";
            break;
        case 5:
            explain = "Demonstrates a generally clear organisation of ideas, but with occasional misuse of cohesive devices.";
            break;
        case 6:
            explain = "Presents a clear overall organisation, but may show some underuse or overuse of cohesive devices.";
            break;
        case 7:
            explain = "Shows a good control over organisation and cohesion, with varied and appropriate use of cohesive devices.";
            break;
        case 8:
            explain = "Manages coherence and cohesion very effectively, with skillful use of paragraphs and cohesive devices.";
            break;
        case 9:
            explain = "Expertly manages both coherence and cohesion, with seamless integration of ideas across the text.";
            break;
        default:
            explain = "Invalid score.";
            break;
    }

    return {score: score, explain: explain};
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