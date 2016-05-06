var SSE = require('sse-nodejs');
var path = require('path');
var tools = require('./CreatingNetwork.js');
var expandTools = require('./expandNetwork.js');
var searchTools = require('./SearchingProfile.js');
var exportSkills = require('./exportSkills.js');
module.exports = function (app) {


    app.get('/time', function (req,res) {
        var serverSent = SSE(res);


        setInterval(function(){
            
            serverSent.sendEvent('time', function () {
                var receivedMessage = tools.returnMessage();
                return (receivedMessage)
            },0);
        },5000)
        serverSent.disconnect(function () {
        console.log("disconnected");
    })
 
    serverSent.removeEvent('time',40000);

    });


    app.get('/timeExpand', function (req,res) {
        var serverSent = SSE(res);


        setInterval(function(){
            
            serverSent.sendEvent('timeExpand', function () {
                var receivedMessage = expandTools.returnMessage();
                return (receivedMessage)
            },0);
        },3000)
        serverSent.disconnect(function () {
        console.log("disconnected");
    })
 
    serverSent.removeEvent('timeExpand',2000);

    });
    
app.post('/returnSkills',function (req,res){
    
    exportSkills.exportingSkill( function(error, result ){
        res.send(result);
    } );
}

);
app.post('/returnExperience',function (req,res){
    
    exportSkills.exportingExperience( function(error, result ){
        res.send(result);
    } );
}

);

    app.post('/postsearch', function (req, res) {
        
        var rest = JSON.stringify(req.body);
        console.log(rest);
        
        searchTools.searching(req.body, function (error, result) {
            res.send(result);  
        });

    });



    app.post('/postCreation', function (req, res) {

        console.log(req.body);
        tools.searchProfile(req.body.linkedInAccount,req.body.linkedInpassword);
    });





    app.post('/postExpand', function (req, res) {

        console.log(req.body);

       
        expandTools.startExpand(req.body.linkedInAccount,req.body.linkedInpassword);


    });


    app.get('*', function (req, res) {
        console.log("the path is " +__dirname );
        res.sendFile(path.resolve(__dirname + '/../public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });
};
