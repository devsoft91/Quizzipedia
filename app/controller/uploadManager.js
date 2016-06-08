"use strict";

var config = require('../../config/upload'); // path delle cartelle upload

var multer = require('multer'); // si occupa del salvataggio
var glob = require("glob"); // pattern matching su fs
var mkdirp = require('mkdirp'); // crea la cartella se manca




//set storage configuration
var storageTmp = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, config.pathTmpFiles);
        }
        , filename: function (req, file, cb) {
            // req.session.user._id
            cb(null, "nome.utente" + '_' + Date.now() + "_" + file.originalname);
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

exports.remove = function (req, res) {
    // var user = req.session._id;
    var user = "nome.utente";
    var pattern = config.pathTmpFiles + user + "_*";

    glob(pattern, { nodir: true }, function (err, files) {
        if(err)
            return console.log(err);
        files.forEach(function(file) {
            fs.unlink(file, function(err) {
                if(err)
                    return console.log(err);
            });
        });
    });

    res.send("done");
};

// funzione usata da questionManager per salvare un allegato
exports.save = function(user, filename, questionId) {
    var newPathFile = config.pathFiles + questionId + "_" + Date.now() + "_" + filename;
    var pattern = config.pathTmpFiles + user + "_*_" + filename;

    console.log("old pattern file : " + pattern);
    console.log("new path file : " + newPathFile);

    mkdirp(config.pathFiles, function(err) {
        if (err)
            console.log(err);

        glob(pattern, { nodir: true }, function (err, files) {
            if(err)
                return console.log(err);

            fs.renameSync(files[0], newPathFile, function(err) {
                if (err)
                    return console.log(err);
            });
        });
    });

    return newPathFile;
};
