//region USER RELATED

import Services from "../services/index.js";
import Logger from "rklogger";

/**
 *
 * @param uName
 * @param uPassword
 * @param callback
 */
function userRegister(uName, uPassword, callback) {
    Services.MySQLService.query(`INSERT INTO user (\`uName\`, \`uPassword\`, \`uStatus\`)
                                 VALUES (?, ?, ?)`, [uName, uPassword, 1], (err, data) => {
        if (err) {
            Logger.printError(`[MySQL] DATABASE MYSQL ERROR userRegister: ${err.message}`);
            callback(false);
        } else {
            callback(true);
        }

    });
}

/**
 *
 * @param uName
 * @param uPassword
 * @param callback
 * TODO: Use Password Hash instead of Original Password
 */
function userLogin(uName, uPassword, callback) {
    Services.MySQLService.query(`SELECT uID FROM user WHERE uName = ? AND uPassword = ?`, [uName, uPassword], (err, data) => {
        if (err) {
            Logger.printError(`[MySQL] MYSQL ERROR userLogin: ${err.message}`);
            callback(false);
        } else {
            callback(data);
        }
    });
}

//endregion

//region QUESTION RELATED

/**
 *
 * @param callback
 */
function fetchQuestions(callback) {
    Services.MySQLService.query(`SELECT qID, qTitle
                                 FROM question`, (err, data) => {
        if (err) {
            Logger.printError(`[MySQL] MYSQL ERROR fetchQuestions: ${err.message}`);
            callback(null);
        } else {
            callback(data);
        }
    });
}

/**
 *
 * @param qID
 * @param callback
 */
function getQuestion(qID, callback) {
    Services.MySQLService.query(`SELECT *
                                 FROM question
                                 WHERE qID = ?`, [qID], (err, data) => {
        if (err) {
            Logger.printError(`[MySQL] MYSQL ERROR getQuestion: ${err.message}`);
            callback(null);
        } else {
            callback(data);
        }
    });
}

//endregion


const MySQLHelper = {
    userRegister,
    userLogin,
    fetchQuestions,
    getQuestion
};

export default MySQLHelper;