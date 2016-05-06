var Horseman = require('node-horseman');
var horseman = new Horseman();

var allProfileData;
var i =0;
var count = 0;
var myModel = require("./model.js");
  myModel.find(function (err, result) {
  if (err) return console.error(err);
  allProfileData = result;
  
})

horseman
		.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0").log("	Setting Mozilla Agent")
		.open("https://www.linkedin.com/uas/login?goback=&trk=hb_signin").log("		Opening linkedIn via Horseman")
		.type('input[name="session_key"]','mahmoud.ellouze922@gmail.com').log("	Typing session key")
		.type('input[name="session_password"]', '33ivalice').log("		Typing password session")
		.keyboardEvent("keypress", 16777221).log("		Executing keyboard event")
		.waitForNextPage().log("		Wait for next page")
		
		
		
		.then(function() {exploring(); })

var exploring =function(){
	setTimeout(function(){ 
	littleExpand();
	count++;
	exploring();},4000);
}
var littleExpand = function(){
	console.log(cat[count].consultedpeople[i].adress)
	horseman.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
	.open(cat[count].consultedpeople[i].adress).log("		Opening linkedIn via Horseman" + i)
	.click('a:contains("Se connecter")').log("clicking on connect").waitForNextPage()
	.then(function() {
		i++;
		if (i<10)
		{littleExpand(); }else {console.log (i);
			i=0;}
	})
}