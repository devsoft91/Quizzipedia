/*
 * Nome del file: uploadManager.js
 * Percorso: app/controller/uploadManager.js
 * Autore: Vault-Tech
 * Data creazione:
 * E-mail: vaulttech.swe@gmail.com
 *
 *  Controller per la gestione degli allegati alle domande
 *
 * * Diario delle modifiche:
 *
 */

"use strict";

var config = require('../../config/upload'); // path delle cartelle upload

var multer = require('multer'); // si occupa del salvataggio
var glob = require("glob"); // pattern matching su fs
var mkdirp = require('mkdirp'); // crea la cartella se manca
var mime = require('mime'); // per l'estensione dei file
var fs = require('fs');

var author = 'tmpauthor@gmail.com';  //poi da cancellare e recuperare sempre da req.session.user._id

//set storage configuration
var storageTmp = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, config.pathTmpFiles);
        }
        , filename: function (req, file, cb) {
            // req.session.user._id
            cb(null, author + '_' + Date.now() + "_" + file.originalname);
        }
    });

exports.upload = function (req, res, next) {
    mkdirp(config.pathTmpFiles, function(err) {
        if(err) {
            console.log(err);
            res.send({ result: "error" });
        }
        else {
            multer({storage: storageTmp
                // , fileFilter: function(req, file, cb) {
                //     cb(null, true);
                // }
            }).single('file')(req, res, next);
            res.send({ result: "done" });
        }
    });
};

exports.remove = function (req, res, next) {
    // var user = req.session._id;
    var user = author;
    var pattern = config.pathTmpFiles + "/" + user + "_*";

    glob(pattern, { nodir: true }, function (err, files) {
        if(err) {
            console.log(err);
            res.send({ result: "error" });
        }
        else {
            console.log("deleting files :");
            console.log(files);

            files.forEach(function(file) {
                fs.unlink(file, function(err) {
                    if(err)
                        return console.log(err);
                });
            });
            res.send({ result: "done" });
        }
    });
};

// funzione usata da questionManager per salvare un allegato, ritorna il path o null se c'è stato un errore
exports.save = function(user, filename, questionId) {
    var newPathFile = config.pathFiles + "/" + questionId + "_" + Date.now() + "_" + filename;
    var pattern = config.pathTmpFiles + "/" + user + "_*_" + filename;

    // console.log("old pattern file : " + pattern);
    // console.log("new path file : " + newPathFile);

    mkdirp(config.pathFiles, function(err) {
        if (err) {
            console.log(err);
            return newPathFile = null
        }
        else {
            glob(pattern, function (err, matches) {
                if(err) {
                    console.log(err);
                    newPathFile = null;
                }
                else {
                    fs.rename(matches[0], newPathFile, function(err) {
                        if (err) {
                            console.log(err);
                            newPathFile = null;
                        }
                    });
                }
            });
        }
    });

    return newPathFile;
};

//profile image
var storageProfileImg = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, config.pathFiles);
    }
    , filename: function (req, file, cb) {
        // req.session.user._id
        cb(null, author + '.' + mime.extension(file.mimetype));
    }
});

exports.update_profile_image = function (req, res, next) {
    //delete old file, author da req.session.user._id
    var pattern = config.pathFiles + "/" + author + "*";

    mkdirp(config.pathFiles, function(err) {
        if(err) {
            console.log(err);
            res.send({ result: "error" });
        }
        else {
            glob(pattern, { nodir: true }, function (err, files) {
                if(err) {
                    console.log(err);
                    res.send({ result: "error" });
                }
                else {
                    console.log("deleting files :");
                    console.log(files);

                    files.forEach(function(file) {
                        fs.unlink(file, function(err) {
                            if(err)
                                return console.log(err);
                        });
                    });

                    multer({ storage: storageProfileImg }).single('file')(req, res, next);
                    res.send({ result: "done" });
                }
            });
        }
    });
};