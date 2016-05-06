var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/CrawlerDataBase2');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("	Connected to the database");
});
var SkillSchema = mongoose.Schema({title : String});

var skillModel = db.model('myskills2', SkillSchema);
var experienceModel = db.model('myexperiences', SkillSchema);
var skillTable = [];
var experienceTable = [];
var exportingSkill = function(callback){
skillModel.
	find()
	.exec(function(err, result){
		for (var k in result) {
			skillTable.push(result[k].title);
		}
		callback(null,skillTable);
		skillTable=[];
		});

}
var exportingExperience = function(callback){
experienceModel.
	find()
	.exec(function(err, result){
		for (var k in result) {
			experienceTable.push(result[k].title);
		}
		callback(null,experienceTable);
		});
	experienceTable=[];

}


module.exports = {
	exportingSkill: exportingSkill,
	exportingExperience : exportingExperience
	
}
