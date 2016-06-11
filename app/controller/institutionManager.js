var async = require('async');
var Organization = require('../model/organization.model');
var User = require('../model/user.model');

var callback = function(){ //callback fake per sincronismo
}

exports.fetchAllInstInfos = function (req,res) {

		var results = [];
		Organization.find(function (err,orgs) {
			if (err) {
            console.log('error: ' + err);
            res.redirect('/');
      }
      else{
       	if(orgs){
       		for(var i=0;i<orgs.length;i++){
       			var numTeachers = 0;
       			var numStudents = 0;
       			var date = orgs[i].creationDate.toString().substring(0,15);
       			for(var j=0;j<orgs[i].users.length;j++){
       				if(orgs[i].users[j].state == 'allowed'){
       					if(orgs[i].users[j].role == 'teacher')
	       					numTeachers++;
	     					if(orgs[i].users[j].role == 'student')
	     						numStudents++;
       				}
       			}
       			results.push({
       				orgName: orgs[i].name,
       				teachers: numTeachers,
       				students: numStudents,
       				creationDate: date
       			});
       		}
       		res.send(results);
       	}
       	else{
       		console.log('Nessun ente trovato');
       		res.send('Null');
       	}
			}
		});
}

exports.fetchUserInst = function (req, res) {

		var results = [];
		if(req.session.user){
			Organization.find(function (err,orgs){
				if (err) {
	            console.log('error: ' + err);
	            res.redirect('/');
	      }
	      else{
	       	if(orgs){
	       		console.log('sto cercando nelle organizzazioni');
	       		for(var i=0;i<orgs.length;i++){
        			var org = orgs[i];
							if(org.director == req.session.user._id){
		            results.push({
		                institution_name: org.name
		                ,role : 'director'
		            });
			         }
			        else {
			        	org.users.forEach(function(result,index){
                  if(result['user'] === req.session.user._id && result['state'] === 'allowed' && result['role'] === 'student') {
                    results.push({
	                    institution_name: org.name
	                    ,role: 'student'
	                	});
                	}
			        	});
		            org.users.forEach(function(result,index){
                  if(result['user'] === req.session.user._id && result['state'] === 'allowed' && result['role'] === 'teacher') {
                    results.push({
	                    institution_name: org.name
	                    ,role: 'teacher'
	                	});
                	}
		          	});
			        }
			      } //fine ciclo for
						res.send(results);
			    }
			    else{
       			console.log('error no istitutions found');
       			res.redirect('/');
       		}
       	}	       		
	    });
		}
};

exports.fetchUsersInInst = function (req, res) {

		var results = [];
		if(req.session.user && req.session.user.role == 'director'){
			async.series([
				function(callback){
					console.log('comincia find Organization');
					Organization.findOne({ 'name': req.session.user.institution }, function (err,org){
						if (err) {
			            console.log('error: ' + err);
			            res.redirect('/');
			      }
			      else{
			       	if(org){
			       		console.log('sto cercando nell\'organizzazione ' + req.session.user.institution + ' con ruolo direttore');
		       			for(var i=0;i<org.users.length;i++){
		       				result.push(org.users[i]);
		       			}
								callback();
		       		}
		       		else{
		       			console.log('Organizzazione non trovata');
		       		}
				    }
			    });
				},

				function(callback){
					console.log('comincia find User');
					console.log(results.length);
					User.find(function (err,users){
						if (err) {
		            console.log('error: ' + err);
		            res.redirect('/');
			      }
			      else{
			       	if(users){
			       		for(var i=0;i<users.length;i++){
			       			for(var j=0;j<results.length;j++){
			       				if(results[j].user == users[i]._id){
			       					results[j].firstName = users[i].firstName;
			       					results[j].lastName = users[i].lastName;
			       				}
			       			}
			       		}
			       		callback();
			       	}
						}
					});
				}],function(err){
					if(err)
						console.log(err);
					else{
						res.send(results);
					}
				});
		}
		else res.redirect('/');
}

exports.fetchNoUserInst = function (req, res) {

		var results = [];
		if(req.session.user){
			Organization.find(function (err,orgs){
				if (err) {
	            console.log('error: ' + err);
	            res.redirect('/');
	      }
	      else{
	       	if(orgs){
	       		for(var i=0;i<orgs.length;i++){
        			var org = orgs[i];
        			var found = false;
        			if(org.director != req.session.user._id){
        				org.users.forEach(function(result,index){
                  if(result['user'] === req.session.user._id) {
                  	found = true;
                	}
				        });
				        if(!found){
                	results.push({
                    institution_name: org.name
                	});
                }
				      }
        		} // fine ciclo for
        		res.send(results);
			    }
			    else{
       			console.log('error no istitutions found');
       			res.redirect('/');
       		}
       	}	       		
	    });
		}
};

exports.changeInst = function (req, res) {

		var institution = req.body.organizationName;
		var normalUser = false;

		Organization.findOne({'name': institution}, function (err, org) {
        if (err) {
            console.log('error: ' + err);
            res.redirect('/');
        }
        else {
            if (org) {  //SE TROVA UN UTENTE NEL DB
                org.users.forEach(function(result,index){
                    if(result['user'] === req.session.user._id) {
                    		normalUser = true;
                        req.session.user.role = result['role'];
                        req.session.user.institution = institution;
                        res.redirect('/');
                    }
                });

                if(normalUser == false && org.director === req.session.user._id) {
		                req.session.user.role = 'director';
		                req.session.user.institution = institution;
		                res.redirect('/');
	              }
            }
            else {  //SE NON TROVA UN UTENTE NEL DB
	              console.log('errore: user non trovato');
                res.redirect('/');
            }
        }
    });
};

exports.removeFromInst = function (req, res) {

		if(req.session.user && req.session.user.role == 'director'){
			Organization.findOne({ 'name': req.session.user.institution }, function (err, org) {
	        if (err) {
	            console.log('error: ' + err);
	            res.redirect('/');
	        }
	        else {
            if (org) {  //SE TROVA UN UTENTE NEL DB
            	for(var i=0;i<org.users.length;i++){
            		if(org.users[i].user == req.body.user)
            			org.users.splice(i,1);
            	}
              org.save( function (err) {
		              if (err) {
		                  console.log('errore nella rimozione dell\'utente dall\'ente: ' + err);
		                  res.send('/');
		              }
		              else {
		                  console.log('rimosso l\'utente dall\'ente correttamente');
		                  res.send('/');
		              }
		          });
            }
            else console.log('organizzazione non trovata');
	        }
	    });
		}
		else res.redirect('/');
};
