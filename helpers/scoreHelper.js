import AWL from '../data/awl.js'
import dictionary from "../data/dictionary.js"
import coherenceWords from "../data/coherenceWords.js";
import stopwords from "../data/stopwords.js";
import nlp from 'compromise'

function getContentScore(userAnswer, topic) {
    const topics = topic.split('|');
    let allRelatedWordsSet = new Set();

    for (const keyword of topics) {
        allRelatedWordsSet.add(keyword);
        // Syn
        const synonyms = getRelatedWords(keyword, 'rel_syn');
        synonyms.forEach(word => allRelatedWordsSet.add(word));
        // Ant
        const antonyms = getRelatedWords(keyword, 'rel_ant');
        antonyms.forEach(word => allRelatedWordsSet.add(word));
    }

    // Remove punctuation from user's answer and convert to lowercase, then split into words
    let cutoffComma = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
    let lowercase = cutoffComma.toLowerCase().split(/\s+/);

    // Join words back into a single string for NLP processing
    let preprocessedText = lowercase.join(' ');

    // Process text with NLP library
    let preprocessDoc = nlp(preprocessedText);

    // Extract verbs in infinitive form, nouns in singular form, adjectives, and adverbs
    let verbs = preprocessDoc.verbs().toInfinitive().out('array');
    let nouns = preprocessDoc.nouns().toSingular().out('array');
    let adjectives = preprocessDoc.adjectives().out('array');
    let adverbs = preprocessDoc.adverbs().out('array');

    // Combine all extracted words into one array
    let group = verbs.concat(nouns, adjectives, adverbs);

    let splitWords = group.flatMap(item => {
        // Separate by space
        let words = item.split(' ');
        return words.map(word => {
            // Get rid of "'s" and mul
            return word.replace(/'s$/, '').replace(/s'$/, '');
        });
    });

    //if no include in stopwords.js, add it in.
    let cutoffStopwords = splitWords.filter(word => !stopwords.includes(word));
    // Now all the non-stopwords here are processed.
    // Use the synonyms, antonyms obtained from processing all topics above for comparison.
    // Finally, obtain a count.
    let foundKeywordsCount = cutoffStopwords.filter(word => allRelatedWordsSet.has(word)).length;
    let proportion = (foundKeywordsCount / cutoffStopwords.length)*100;

    let score;
    let explain;

    if (proportion >= 60) {
        score = 9;
        explain = "Fully addresses the requirements of the task with complete and fully relevant responses.";
    } else if (proportion >= 50) {
        score = 8;
        explain = "Covers the task in detail with relevant, accurate content throughout.";
    } else if (proportion >= 40) {
        score = 7;
        explain = "Addresses all parts of the task, although some parts may be more fully covered than others.";
    } else if (proportion >= 30) {
        score = 6;
        explain = "Addresses the task adequately, but some key information may be inaccurately or incompletely covered.";
    } else if (proportion >= 20) {
        score = 5;
        explain = "Generally addresses the task; key information is presented but may lack detail.";
    } else if (proportion >= 10) {
        score = 4;
        explain = "Responds to the task only to a limited extent. Some key information may be missing.";
    } else if (proportion >= 7) {
        score = 3;
        explain = "Addresses the task only partially; the response is largely irrelevant.";
    } else if (proportion >= 4) {
        score = 2;
        explain = "Addresses the task only minimally with very limited relevance.";
    } else if (proportion < 4) {
        score = 1;
        explain = "Does not address the topic or task.";
    } else {
        score = 'invalid'
        explain = 'Somethings wrong, report to the administrator'
    }

    return {score: score, explain: explain};
}

function getRelatedWords(word, relType) {
    const wordEntry = dictionary.find(entry => entry.word === word);

    if (wordEntry && relType === 'rel_syn') {
        return wordEntry.synonyms.slice();
    } else if (wordEntry && relType === 'rel_ant') {
        return wordEntry.antonyms.slice();
    }
    return [];
}

function getCoherenceScore(userAnswer) {
    const coherenceWordsSet = new Set(coherenceWords);

    const paragraphSplit = userAnswer.split('\n');
    let paragraphs = [];

    for (let i = 0; i < paragraphSplit.length; i++) {
        let paragraph = paragraphSplit[i];
        if (paragraph.trim() !== '') {
            paragraphs.push(paragraph);
        }
    }

    let totalPercentage = 0;
    let totalWords = [];

    paragraphs.forEach(paragraph => {
        const cleanedParagraph = paragraph.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        let paragraphWords = cleanedParagraph.split(/\s+/);
        totalWords.push(...paragraphWords);
        let matchCount = 0;

        coherenceWordsSet.forEach(cohesionPhrase => {
            const pattern = new RegExp("\\b" + cohesionPhrase + "\\b", "g");
            const match = cleanedParagraph.match(pattern);
            if (match) {
                matchCount += match.length;
            }
        });

        let percentage = 0;
        if (paragraphWords.length > 0) {
            percentage = (matchCount / paragraphWords.length) * 100;
        }
        totalPercentage += percentage;
    });

    let averagePercentage = 0;
    if (paragraphs.length > 0) {
        averagePercentage = totalPercentage / paragraphs.length;
    }

    let score;
    let explain;

    if (averagePercentage < 1) {
        score = 1;
        explain = "Oh Bro";
    } else if (averagePercentage < 3) {
        score = 2;
        explain = "Shows some attempt to organize ideas, but connections between sentences are flawed or non-existent.";
    } else if (averagePercentage < 5) {
        score = 3;
        explain = "Presents some coherent organisation, but the use of cohesive devices is often mechanical or inappropriate.";
    } else if (averagePercentage < 10) {
        score = 4;
        explain = "Exhibits a basic organisation structure, but the usage of cohesive devices and paragraphing may be inadequate.";
    } else if (averagePercentage < 15) {
        score = 5;
        explain = "Demonstrates a generally clear organisation of ideas, but with occasional misuse of cohesive devices.";
    } else if (averagePercentage < 20) {
        score = 6;
        explain = "Presents a clear overall organisation, but may show some underuse or overuse of cohesive devices.";
    } else if (averagePercentage < 25) {
        score = 7;
        explain = "Shows a good control over organisation and cohesion, with varied and appropriate use of cohesive devices.";
    } else if (averagePercentage < 30) {
        score = 8;
        explain = "Manages coherence and cohesion very effectively, with skillful use of paragraphs and cohesive devices.";
    } else if (averagePercentage < 35) {
        score = 9;
        explain = "Expertly manages both coherence and cohesion, with seamless integration of ideas across the text.";
    } else {
        score = 'invalid';
        explain = "Something's wrong, report to the administrator";
    }

    return {score: score, explain: explain};
}

function getLexicalScore(userAnswer) {
    const awlSet = new Set(AWL);

    const cleanedAnswer = userAnswer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
    const words = cleanedAnswer.split(/\s+/);

    let matchCount = 0;

    words.forEach(word => {
        if (awlSet.has(word)) {
            matchCount++;
        }
    });

    const percentage = (matchCount / words.length) * 100;

    let score;
    let explain;

    if (percentage < 3) {
        score = 2;
        explain = "Shows limited vocabulary; frequent errors in word choice cause confusion and detract from clarity.";
    } else if (percentage < 5) {
        score = 3;
        explain = "Demonstrates a limited range of vocabulary, with repetitive and basic word choices; makes noticeable errors that affect comprehension.";
    } else if (percentage < 10) {
        score = 4;
        explain = "Utilizes a limited but effective range of vocabulary; some errors still occur, but they do not significantly hinder communication.";
    } else if (percentage < 15) {
        score = 5;
        explain = "Displays a reasonable range of vocabulary; may make mistakes, but unlikely to cause misunderstanding.";
    } else if (percentage < 20) {
        score = 6;
        explain = "Shows a good range of vocabulary for familiar topics; some inaccuracies occur, but errors rarely reduce communication.";
    } else if (percentage < 25) {
        score = 7;
        explain = "Exhibits a broad lexical repertoire and flexibility in topic-specific vocabulary; occasional inaccuracies are present but do not impede communication.";
    } else if (percentage < 30) {
        score = 8;
        explain = "Demonstrates a wide range of vocabulary fluently and flexibly; uses rare minor errors or inappropriacies.";
    } else if (percentage >= 30) {
        score = 9;
        explain = "Uses a wide range of vocabulary with very natural and sophisticated control of lexical features; errors are rare and difficult to spot.";
    } else {
        score = 1;
        explain = "Uses an extremely limited range of vocabulary; errors in word choice are pervasive and impede understanding.";
    }

    return {score: score, explain: explain};
}

function getGrammarScore(error) {
    let errorCount = error.filter(error => "message" in error).length;
    // Initial 9
    let initialScore = 9;

    let score = initialScore - errorCount;
    if (score <= 1) {
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