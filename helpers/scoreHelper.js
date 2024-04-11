import AWL from '../data/awl.js'
import score from "../data/score.js";

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

function getLexicalScore(userAnswer) {
    const words = userAnswer.toLowerCase().match(/\b(\w+)\b/g);
    let matchCount = 0;

    const awlSet = new Set(AWL);

    words.forEach(word => {
        if (awlSet.has(word)) {
            matchCount++;
        }
    });

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
            explain = "Uses an extremely limited range of vocabulary; errors in word choice are pervasive and impede understanding.";
            break;
        case 2:
            explain = "Shows limited vocabulary; frequent errors in word choice cause confusion and detract from clarity.";
            break;
        case 3:
            explain = "Demonstrates a limited range of vocabulary, with repetitive and basic word choices; makes noticeable errors that affect comprehension.";
            break;
        case 4:
            explain = "Utilizes a limited but effective range of vocabulary; some errors still occur, but they do not significantly hinder communication.";
            break;
        case 5:
            explain = "Displays a reasonable range of vocabulary; may make mistakes, but unlikely to cause misunderstanding.";
            break;
        case 6:
            explain = "Shows a good range of vocabulary for familiar topics; some inaccuracies occur, but errors rarely reduce communication.";
            break;
        case 7:
            explain = "Exhibits a broad lexical repertoire and flexibility in topic-specific vocabulary; occasional inaccuracies are present but do not impede communication.";
            break;
        case 8:
            explain = "Demonstrates a wide range of vocabulary fluently and flexibly; uses rare minor errors or inappropriacies.";
            break;
        case 9:
            explain = "Uses a wide range of vocabulary with very natural and sophisticated control of lexical features; errors are rare and difficult to spot.";
            break;
        default:
            explain = "Invalid score.";
            break;
    }

    return {score: score, explain: explain};
}

function getGrammarScore(error) {
    let errorCount = error.filter(error => "message" in error).length;
    // Initial 9
    let initialScore = 9;

    let score = initialScore - errorCount;
    if (score <= 1){
        score = 1;
    }

    let explain;
    switch (score) {
        case 1:
            explain = "Displays virtually no ability to control grammatical structures; errors are pervasive and severely impede understanding.";
            break;
        case 2:
            explain = "Can only use a very limited range of grammatical structures with repeated errors that seriously affect comprehension.";
            break;
        case 3:
            explain = "Manages only a limited number of basic grammatical structures; makes frequent errors that are often serious.";
            break;
        case 4:
            explain = "Utilizes a limited range of grammatical structures sufficient to convey basic meaning, despite some errors.";
            break;
        case 5:
            explain = "Demonstrates a reasonable range of grammatical control; though errors may occur, they rarely impede understanding.";
            break;
        case 6:
            explain = "Uses a mix of simple and complex grammatical structures; while some errors are present, they usually do not hinder communication.";
            break;
        case 7:
            explain = "Shows good control of a broad range of grammatical structures; errors are present but do not lead to misunderstanding.";
            break;
        case 8:
            explain = "Displays a wide range of grammatical structures with high accuracy; makes only occasional minor errors.";
            break;
        case 9:
            explain = "Has a full operational command of the grammar system; errors are rare and difficult to spot.";
            break;
        default:
            explain = "Default Score";
            break;
    }

    return {score: score, explain: explain};
}

const ScoreHelper = {
    getContentScore, getCoherenceScore, getLexicalScore, getGrammarScore
};

export default ScoreHelper;