var deps = {
	Q : require('q'),
	config : require("./Config.js"),
	request : require('request'),
	_ : require('underscore'),
	Xray : require('x-ray'),
	Horseman : require('node-horseman'),
	 myModel : require('./model.js')
}
var bigCounter = 0;
var globalVariable = {
totalAccountNumber : 0,
repeat : false,
counter : 0,
x : deps.Xray(),
urlTable: [],
clickUrl : '.conn-wrapper:eq('+bigCounter+')',
cookies:[],
UrlMessage : "test",
 sendingMessage : {
	message : "Nothing now",
	absoluteCounter : 0,
	totalContact : "Calculating",
	currentContact : ""
}

};


var Horso = {
	options: {
		url: 'https://www.linkedin.com/profile/view?id=AA4AABj0fLUB552Y0oxkrhnCJjLuGNdT2xDo6JI&amp;authType=name&amp;authToken=kvxt&amp;goback=&amp;trk=abook_conn',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
			'cookie' :'li_at=AQEDARzFBw4ETJnOAAABU4UtgnAAAAFThZtfcE4Ar0dKb7K9qZdF3ITJhhm7zgdOMDPq6hUo8_joIXPmfXrtyie8MeIN9RqK-abWu-a9QyxPpff957O7sqNpG5V8t4ZbnrKSr6yw4iuSdwTqb7w2Tr9v'
		}
	},
	options2: {
		url: 'https://www.linkedin.com/people/conn-details?i=&contactMemberID=18033037',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
			'cookie' :'li_at=AQEDARzFBw4BjdhWAAABU4lCuQoAAAFTibCWCk4ARqQo67Nb_hVUtiM99zPiiFcgrL6Ugd9AhysLEI0D1fotVLg0GKGYnFaQzesMzddm1lJ2PfS87w-8v7hT6hsTuNuI3JdnmaLXdgKdjE4SlaV-LAIS'
		}
	},
	
	findCookie: function(linkedInAccount,linkedInpassword) {
		globalVariable.sendingMessage.message = "PHASE 1 : starting linkedIn";
		var horseman = new deps.Horseman();
		var deferred = deps.Q.defer();
		console.log("PHASE 1 : OPENING LINKEDIN")
		horseman
		.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0").log("	Setting Mozilla Agent")
		.open("https://www.linkedin.com/uas/login?goback=&trk=hb_signin").log("		Opening linkedIn via Horseman")
		.type('input[name="session_key"]',linkedInAccount).log("	Typing session key")
		.type('input[name="session_password"]', linkedInpassword).log("		Typing password session")
		.keyboardEvent("keypress", 16777221).log("		Executing keyboard event")
		.waitForNextPage().log("		Wait for next page")
		.open("https://www.linkedin.com/people/connections?trk=nav_responsive_tab_network").log("		opening network")
		.waitForNextPage().log("		Wait for next page")
		.cookies()
		.then(function(cookies) {
			globalVariable.sendingMessage.message = "Extrating cookie";
			console.log("		Extracting cookies");
			for (var i in cookies) {
				if (cookies[i].name == "li_at") {
					var cookie = "li_at=" + cookies[i].value;
					console.log(cookie)
					Horso.options.headers.cookie=cookie;
					Horso.options2.headers.cookie=cookie;
				
				}
			}
			deferred.resolve();
		})
		.then(function() {
			
			horseman
			.title()
			.then(function(title){
				if(title=="Sign Up | LinkedIn"){
					globalVariable.sendingMessage.message = "Sorry, it seems the LinkedIn account or the LinkedIn password is invalid";
					console.log("error : Wrong account or password");
					horseman.close();
				}else{
					Horso.continueFunction(horseman);
				}
			})
		})
	},

	continueFunction : function(horseman) {
		horseman
		.screenshot("veryfing.png")
		.html('li.all-connections.selection em')
		.then(function(body) {
			console.log(body);
			globalVariable.sendingMessage.totalContact  = String(body).substr(1,3);
			console.log("The total number of contact is : "  + globalVariable.sendingMessage.totalContact);
			globalVariable.totalAccountNumber = parseInt(globalVariable.sendingMessage.totalContact);
			console.log(globalVariable.totalAccountNumber+1)
		})
		Horso.chooseFunction(horseman);
		
		
	},
	chooseFunction : function(horseman) {


		globalVariable.sendingMessage.message = "PHASE 2 : Choosing function";
		console.log("PHASE 2 : CHOOSE FUNCTION")
		if ((bigCounter>=10)&&(globalVariable.totalAccountNumber>100)){
			console.log("		Turning the page");
			bigCounter = 0;
			globalVariable.clickUrl = '.conn-wrapper:eq('+bigCounter+')';
			Horso.getProfileNextPage(horseman);
		}else {
			console.log("		Keep the same page");
			Horso.getProfileSamePage(horseman);
		}
	},
	getProfileNextPage : function (horseman){
		globalVariable.sendingMessage.message = "Getting profile";
		console.log("PHASE 3 : GETTING PROFILE (next page)");
		horseman
		.click("span:contains('Suivante')")
		.waitForNextPage()
		
		.then(function(){  console.log("		The click Url is : "+ globalVariable.clickUrl)
	})
		.click(globalVariable.clickUrl).log("		Clicking on profile")
		.on('resourceReceived',function( msg ){

			globalVariable.urlTable[globalVariable.counter]=String(msg.url);
			var res = globalVariable.urlTable[globalVariable.counter].substr(0, 44);

			if((res=='https://www.linkedin.com/people/conn-details')&&(globalVariable.repeat==false)){
				globalVariable.repeat=true ;
				globalVariable.UrlMessage=globalVariable.urlTable[globalVariable.counter]; 
				console.log("		The Url response received is : "+globalVariable.UrlMessage);
				Horso.options2.url=globalVariable.UrlMessage;
				Horso.doFirstRequest(horseman);
			}

			globalVariable.counter++;
		})
	},
	getProfileSamePage : function(horseman){
		globalVariable.sendingMessage.message = "PHASE 3 : Getting profile";
		console.log("PHASE 3 : GETTING PROFILE (same page)");
		horseman
		.waitForNextPage()
		.then(function(){  console.log("The click Url is : "+  globalVariable.clickUrl)})
		.click(globalVariable.clickUrl).log("		Clicking on profile")
		.on('resourceReceived',function( msg ){


			globalVariable.urlTable[globalVariable.counter]=String(msg.url);
			var res = globalVariable.urlTable[globalVariable.counter].substr(0, 44);

			if((res=='https://www.linkedin.com/people/conn-details')&&(globalVariable.repeat==false)){
				globalVariable.repeat=true ;
				globalVariable.UrlMessage=globalVariable.urlTable[globalVariable.counter]; 
				console.log("		The Url response is : "+globalVariable.UrlMessage);
				Horso.options2.url=globalVariable.UrlMessage;
				Horso.doFirstRequest(horseman);
			}

			globalVariable.counter++;
		})
	},
	doFirstRequest : function(horseman){
		globalVariable.sendingMessage.message = "PHASE 4 : Doing first request";
		console.log("PHASE 4 : REQUESTING THE PROFILE ID")
		deps.request(Horso.options2, function(error, response, body) {

			globalVariable.x(body, '.connection-name', 'a@href')
			(function(err, result) {
				console.log("		The id of the profile is  : "+result);
				Horso.options.url=result;
				Horso.doRequest(null,horseman);
			})
		});
	},
	doRequest: function(error,horseman) {
		globalVariable.sendingMessage.message = "Phase 5 : REQUESTING COMPLETE PROFILE";
		if (error) {
			console.log(error);
		}
		console.log("PHASE 5 : REQUESTING COMPLETE PROFILE");
		console.log("		Requesting the data from the profile");

		deps.request(Horso.options, function(error, response, body) {
			
			Horso.crawl(body,horseman);
		});


	},
	crawl: function(body,horseman) {
		
		globalVariable.sendingMessage.message = "PHASE 6 : CRAWLING THE PROFILE";
		console.log("PHASE 6 : CRAWLING THE PROFILE");
		var selectedCheckers = Horso.generateXRayParams();
		globalVariable.x(body, '#profile', selectedCheckers)
		(function(err, result) {
			globalVariable.repeat=false;
			var ProfileModel = new deps.myModel(result);
			deps.myModel.findOne({
				'url': result.url 
			}, function(err, userObj) {
				if (err) {
					console.log(err);
				} else if (userObj) {
					console.log('Found the profile in the database');
					console.log(userObj.url)
				} else {
					console.log("Did\'nt find the profile in the database");
					ProfileModel.save(function(err) {
						if (err) throw err; 

						console.log('		Profile saved successfully!');
					});
				}
			});
			console.log(result.url);
			bigCounter ++;
			globalVariable.sendingMessage.currentContact=result.identifier;
			globalVariable.sendingMessage.absoluteCounter++;
			console.log("		Number of profile checked in the page  is "+ bigCounter);
			globalVariable.clickUrl = '.conn-wrapper:eq('+bigCounter+')';
			console.log("===============================================================================================")
			Horso.chooseFunction(horseman);

		})
	},
	getEnabledCheckers: function() {
		return deps._.where(Horso.checkers, {
			state: true
		});
	},


	generateXRayParams: function() {
		var checkers = Horso.getEnabledCheckers();

		var payload = {};

		checkers.forEach(function(checker) {
			payload[checker.name] = globalVariable.x(checker.selectors, checker.fields);
		})

		return payload; 
	},
	checkers: deps.config

}
var returnMessage = function (){
	return (globalVariable.sendingMessage);
}
var searchProfile = function(linkedInAccount,linkedInpassword){
	Horso.findCookie(linkedInAccount,linkedInpassword);
}
module.exports = {
	searchProfile: searchProfile,
	returnMessage : returnMessage
}

