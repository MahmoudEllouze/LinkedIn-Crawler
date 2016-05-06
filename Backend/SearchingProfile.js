var myModel = require("./model.js");

var convert = function (parameter){
	var languageTable=[];
	var experienceTable = [];
	console.log("the parametres are : "+ parameter)
	var result ={$and:[]

	};
	if (parameter.email != '') {
		result.$and.push({email : { "$regex":  parameter.email, "$options": 'i' }});
	};
	if (parameter.identifier != '') {
		result.$and.push ({identifier : { "$regex":  parameter.identifier, "$options": 'i' }});
	};
	
	if (parameter.skill.sk[0].name != "") {
		for(var i= 0; i < parameter.skill.sk.length; i++)
		{
			result.$and.push({skills: { $elemMatch: {  number: { $gte: parameter.skill.sk[i].number, $lt: 85 } , title: parameter.skill.sk[i].name } }});
			console.log('ha' +parameter.skill.sk[i].name )
		}
	};

	if (parameter.language.lang[0].name != "") {
		for(var i= 0; i < parameter.language.lang.length; i++)
		{

			languageTable.push(parameter.language.lang[i].name)
		}
		result.$and.push({language: { $in: languageTable }});
	};
	if (parameter.experience.exp[0].position != "") {
		for(var i= 0; i < parameter.experience.exp.length; i++)
		{

			result.$and.push({ experience: { $elemMatch: { title: parameter.experience.exp[i].position } } });
		}
		
	};
	if (parameter.experience.exp[0].company != "") {
		for(var i= 0; i < parameter.experience.exp.length; i++)
		{

			result.$and.push({ experience: { $elemMatch: { company: parameter.experience.exp[i].company } } });
		}
		
	};
	if (parameter.education.educ[0].name != "") {
		for(var i= 0; i < parameter.education.educ.length; i++)
		{

			result.$and.push({ education: { $elemMatch: { title: parameter.education.educ[i].name } } });
		}
		
	};
	return result;
}

var beginResearch=function(parameter, callback){
	var resp = convert (parameter);
	var x =[];
	myModel.
	find(resp)
	.exec(function(err, result){
		for (var k in result) {
			console.log(result[k].identifier);
			
			console.log("=======================================================================================")
		x.push(result[k].identifier);
		}

		callback(null, result);

	})
}
var searching = function(parametre){
	var resp = convert (parametre);
	beginResearch(resp,function(){

	});
	
}
module.exports = {
	searching: beginResearch
	
}


