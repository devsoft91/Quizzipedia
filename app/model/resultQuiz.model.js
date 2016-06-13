/*
 * Nome del file: resultQuiz.model.js
 * Percorso: app/model/resultQuiz.model.js
 * Autore: Vault-Tech
 * Data creazione:
 * E-mail: vaulttech.swe@gmail.com
 *
 *  Model che rappresenta i risultati dei quiz nel database e vari metodi associati
 *
 * * Diario delle modifiche:
 *
 */

'use strict';

//declare required
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//answer question
var answerQuestionSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId
        ,required: [true, 'question is required']
    }
    ,qml: {
        type: String
        ,required: [true, 'qml question with answer is required']
        }
    ,solution: Boolean
}, { strict: true });

//answer quiz
var resultQuizSchema = new Schema({
    user: {
        type: String
        ,required: [true, 'user is required']
    }
    ,date: {
        type: Date
        ,required: [true, 'date is required']
    }
    ,answers: [answerQuestionSchema]
    ,quiz: {
        type: Schema.Types.ObjectId
        ,required: [true, 'quiz is required']
    }
}, { strict: true });

// //result, return [total, passed]
// resultQuizSchema.virtual('result').get(function () {
//     var result_q = 0;
//     var tot_q = 0;
//
//     this.answers.forEach(function(entry) {
//         tot_q++;
//         if(entry.solution)
//             result_q++;
//     });
//
//     return {
//         total: tot_q
//         ,passed: result_q
//     };
// });

// //find results Question, return [total, passed] (scope = collection)
// resultQuizSchema.statics.findMeanResultsQuestion = function(question) {
//     if(question.constructor.name != 'ObjectID')
//         question = question._id;
//
//     var result_q = 0;
//     var tot_q = 0;
//
//     this.find({}, 'answers', function(err, answers) {
//         answers.forEach(function(entry) {
//             entry.forEach(function(answer) {
//                 if(answer.question == question) {
//                     tot_q++;
//
//                     if(answer.question == true)
//                         result_q++;
//                 }
//             });
//         });
//     });
//     return {
//         total: tot_q
//         ,passed: result_q
//     };
// };
//
// //find Tot results Quiz, return number (scope = collection)
// resultQuizSchema.statics.findTotResultsQuiz = function(quiz) {
//     if (quiz.constructor.name !== 'ObjectID')
//         quiz = quiz._id;
//     this.count({ quiz: quiz }, function(err, number) {
//         return number;
//     });
// };
//
// //find mean results Quiz, return [total, passed] (scope = collection)
// resultQuizSchema.statics.findMeanResultsQuestion = function (quiz) {
//     if(quiz.constructor.name != 'ObjectID')
//         quiz = quiz._id;
//
//     var result_q = 0;
//     var tot_q = 0;
//
//     this.find({ quiz: quiz }, 'answers', function(err, answers) {
//         answers.forEach(function(entry) {
//             entry.forEach(function(answer) {
//                 tot_q++;
//
//                 if(answer.question == true)
//                     result_q++;
//             });
//         });
//     });
//
//     return {
//         total: tot_q
//         ,passed: result_q
//     };
// };
//
// //find Users mean Results Quiz, return [user, total, passed ] (scope = collection)
// resultQuizSchema.statics.findUsersMeanResultsQuiz = function(quiz) {
//     if(quiz.constructor.name != 'ObjectID')
//         quiz = quiz._id;
//
//     var results = {};
//     this.find({ quiz: quiz }, function(err, quizs) {
//         quizs.forEach(function(entry) {
//             var result_q = 0;
//             var tot_q = 0;
//
//             entry.answers.forEach(function(entry) {
//                 entry.forEach(function(answer) {
//                     tot_q++;
//                     if(answer.question == true)
//                         result_q++;
//                 });
//             });
//
//             results.push({
//                 user: entry.user
//                 ,total: tot_q
//                 ,passed: result_q
//             });
//         });
//     });
//     return results;
// };
//
// //find resultQuiz with user
// resultQuizSchema.statics.findResultQuizByUser = function(user) {
//   return this.find({ user: user });
// };
//
// //find results with Quiz
// resultQuizSchema.statics.findResultQuizByUser = function(user) {
//   return this.find({ user: user });
// };

//export
module.exports = mongoose.model('ResultQuiz', resultQuizSchema);