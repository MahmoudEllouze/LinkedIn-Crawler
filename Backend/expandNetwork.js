var deps = {
 Horseman : require('node-horseman'),
 Xray : require('x-ray')
};

var globalVariable = {
 x : deps.Xray(),
  allProfileData : [],
 singleContactCounter : 0,

}
var horseman = new deps.Horseman();




var userCounter = 0;
var  sendingMessage = {
	currentContact : "",
	listOfCurrentContact : []

}

var myModel = require("./model.js");
console.log("======== EXPANDING THE NETWORK ========")
var comp = ['engineer', 'web' , 'developer', 'computer' , 'student', 'ingenieur', 'etudiant', 'informatique' , 'developpeur' ,'informaticien','FullStack','WebDev','Front-end','Mobile','fullstack','Développeur','Freelancer','Freelance','DÉVELOPPEUR','étudiante', 'big data', 'Big Data' ]
myModel.find(function (err, result) {
	if (err) return console.error(err);
	globalVariable.allProfileData = result;

})
var startExpand = function(linkedInAccount,linkedInpassword){
horseman
.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0").log("	Setting Mozilla Agent")
.open("https://www.linkedin.com/uas/login?goback=&trk=hb_signin").log("		Opening linkedIn via Horseman")
.type('input[name="session_key"]',linkedInAccount).log("	Typing session key")
.type('input[name="session_password"]', linkedInpassword).log("		Typing password session")
.keyboardEvent("keypress", 16777221).log("		Executing keyboard event")
.waitForNextPage().log("		Wait for next page")



.then(function() {exploring(); })
}

var exploring =function(){
	setTimeout(function(){ 
		littleExpand();
		userCounter++;
		exploring();},4000);
}
var littleExpand = function(){
	sendingMessage.currentContact=globalVariable.allProfileData[userCounter].identifier;
	sendingMessage.listOfCurrentContact=globalVariable.allProfileData[userCounter].consultedpeople;
	console.log(globalVariable.allProfileData[userCounter].consultedpeople[globalVariable.singleContactCounter].adress)
	horseman
	.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
	.open(globalVariable.allProfileData[userCounter].consultedpeople[globalVariable.singleContactCounter].adress).log("		Opening linkedIn via Horseman" + globalVariable.singleContactCounter)
	.then(function(){
		globalVariable.x(globalVariable.allProfileData[userCounter].consultedpeople[globalVariable.singleContactCounter].adress, '.profile-aux', '.button-primary')
		(function(err, title) {
			console.log("the title is "+ title);
  if (Math.random()*100 >=70){console.log("sending the invitation")}else{console.log("not sending the invitation")} 
})
	})
	.click('a:contains("Se connecter")').log("clicking on connect").waitForNextPage()
	.then(function() {
		globalVariable.singleContactCounter++;
		if (globalVariable.singleContactCounter<10)
			{littleExpand(); }else {console.log (globalVariable.singleContactCounter);
				globalVariable.singleContactCounter=0;}
			})
}
var returnMessage = function (){
	return (sendingMessage);
}
module.exports = {
	startExpand: startExpand,
	returnMessage : returnMessage
}