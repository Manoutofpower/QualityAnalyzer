import AWL from '../data/awl.js'
import dictionary from "../data/dictionary.js"
import coherenceWords from "../data/coherenceWords.js";
import stopwords from "../data/stopwords.js";
import nlp from 'compromise'

// Function to compute content score based on user's answer and provided topic keywords
function getContentScore(userAnswer, topic) {
    const topics = topic.split('|'); // Split topic string into individual keywords
    let allRelatedWordsSet = new Set(); // Create a set to store unique related words

    // Populate the set with synonyms and antonyms for each topic keyword
    for (const keyword of topics) {
        allRelatedWordsSet.add(keyword); // Add the keyword itself
        // Add synonyms of the keyword
        const synonyms = getRelatedWords(keyword, 'rel_syn');
        synonyms.forEach(word => allRelatedWordsSet.add(word));
        // Add antonyms of the keyword
        const antonyms = getRelatedWords(keyword, 'rel_ant');
        antonyms.forEach(word => allRelatedWordsSet.add(word));
    }

    // Remove punctuation from user's answer, convert to lowercase, then split into words
    let cutoffComma = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
    let lowercase = cutoffComma.toLowerCase().split(/\s+/);

    // Join words for NLP processing
    let preprocessedText = lowercase.join(' ');

    // Process text using NLP to extract different parts of speech
    let preprocessDoc = nlp(preprocessedText);
    let verbs = preprocessDoc.verbs().toInfinitive().out('array'); // Convert verbs to infinitive form
    let nouns = preprocessDoc.nouns().toSingular().out('array'); // Convert nouns to singular form
    let adjectives = preprocessDoc.adjectives().out('array'); // Extract adjectives
    let adverbs = preprocessDoc.adverbs().out('array'); // Extract adverbs

    // Combine extracted words into one array
    let group = verbs.concat(nouns, adjectives, adverbs);

    // Split compound words and remove possessive endings
    let splitWords = group.flatMap(item => {
        let words = item.split(' ');
        return words.map(word => word.replace(/'s$/, '').replace(/s'$/, ''));
    });

    // Filter out stopwords
    let cutoffStopwords = splitWords.filter(word => !stopwords.includes(word));
    // Calculate the count of relevant keywords found in the user's answer
    let foundKeywordsCount = cutoffStopwords.filter(word => allRelatedWordsSet.has(word)).length;
    let proportion = (foundKeywordsCount / cutoffStopwords.length) * 100; // Calculate proportion as a percentage

    // Determine score based on the proportion of relevant keywords
    let score, explain;
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
        score = 'invalid';
        explain = "Somethings wrong, report to the administrator";
    }

    return { score: score, explain: explain };
}

// Function to retrieve related words (synonyms or antonyms) from the dictionary
function getRelatedWords(word, relType) {
    const wordEntry = dictionary.find(entry => entry.word === word); // Find the word in the dictionary

    // Return synonyms or antonyms based on relType
    if (wordEntry && relType === 'rel_syn') {
        return wordEntry.synonyms.slice();
    } else if (wordEntry && relType === 'rel_ant') {
        return wordEntry.antonyms.slice();
    }
    return [];
}

// Function to evaluate coherence and cohesion of user's written response
function getCoherenceScore(userAnswer) {
    // Initialize a set with predefined coherence words for easy lookup
    const coherenceWordsSet = new Set(coherenceWords);

    // Split user's answer into paragraphs based on newline characters
    const paragraphSplit = userAnswer.split('\n');
    let paragraphs = [];

    // Filter out empty paragraphs and trim spaces
    for (let i = 0; i < paragraphSplit.length; i++) {
        let paragraph = paragraphSplit[i];
        if (paragraph.trim() !== '') {
            paragraphs.push(paragraph);
        }
    }

    let totalPercentage = 0; // Sum of percentages of coherence words used across all paragraphs
    let totalWords = []; // Array to store all words from all paragraphs for further analysis

    // Process each paragraph to find coherence words and calculate their frequency
    paragraphs.forEach(paragraph => {
        // Clean paragraph by lowering case and removing punctuation
        const cleanedParagraph = paragraph.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        let paragraphWords = cleanedParagraph.split(/\s+/); // Split into words by spaces
        totalWords.push(...paragraphWords); // Add to total words list
        let matchCount = 0; // Counter for matched coherence words

        // Check each coherence word against the cleaned paragraph
        coherenceWordsSet.forEach(cohesionPhrase => {
            // Create a regular expression to find whole words only, avoiding partial matches
            const pattern = new RegExp("\\b" + cohesionPhrase + "\\b", "g");
            const match = cleanedParagraph.match(pattern);
            if (match) {
                matchCount += match.length; // Increment match count by the number of times the coherence word appears
            }
        });

        let percentage = 0; // Percentage of coherence words in the current paragraph
        if (paragraphWords.length > 0) {
            percentage = (matchCount / paragraphWords.length) * 100;
        }
        totalPercentage += percentage; // Add current paragraph's percentage to total
    });

    let averagePercentage = 0; // Average percentage of coherence word usage across all paragraphs
    if (paragraphs.length > 0) {
        averagePercentage = totalPercentage / paragraphs.length; // Calculate average
    }

    // Determine the coherence score based on the average percentage of coherence words used
    let score, explain; // Variables for score and explanation
    if (averagePercentage < 1) {
        score = 1;
        explain = "Oh Bro"; // Example placeholder text, likely needs replacement
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

    // Return an object with the calculated score and the corresponding explanation
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