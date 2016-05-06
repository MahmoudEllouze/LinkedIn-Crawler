(function () {
    'use strict';


    function crtl($scope) {}
    angular
    .module('app')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope','$scope','$http', '$interval', '$compile','$timeout'];
    function crtl($scope) {}
    function HomeController(UserService, $rootScope ,$scope,$http,$compile, $interval,$timeout) {
       $scope.percentage = 0 ;
       
       var creationEventListener = new EventSource('/time');
       creationEventListener.addEventListener('time', function (result) {
        var convertedResult = JSON.parse(result.data);

        console.log(result.data)
        $scope.$apply(function() {
            $scope.ServerResultmessage = convertedResult.message;
            $scope.ServerResultcounter = convertedResult.absoluteCounter;
            $scope.ServerResultContact = convertedResult.currentContact;
            $scope.totalContact = convertedResult.totalContact;
            $scope.percentage = (parseInt($scope.ServerResultcounter)/parseInt($scope.totalContact))*100;
            if (convertedResult.message=="PHASE 3 : Getting profile"){ $scope.profileshowing = true;}
        })


    });
       var expandProfileTable = [];
       var expandEventListener = new EventSource('/timeExpand');
       expandEventListener.addEventListener('timeExpand', function (result) {
        var convertedResult = JSON.parse(result.data);

        console.log(result.data)
        $scope.$apply(function() {
            expandProfileTable.push(convertedResult.currentContact);
            $scope.expandCurrentProfile = expandProfileTable;
            $scope.expandCurrentListProfile= convertedResult.listOfCurrentContact;
            
            
        })


    });
       $scope.showingHome=true;
       $scope.profile ={
           searchprofile : {
            email:'',
            identifier: ''
        },
        education : {
            educ: [{
                name: '',
                duration: 0
                }]                
            },
            language : {
                lang:[{
                    name : ''
                }]
            },
            skill : {
                sk : [{
                    name : '',
                    number : 0
                }]
            },
            experience :  {
                exp : [{
                    position : '',
                    company : ""
                }]
            },
        },

        $scope.addProfileItem =function(parametre){
            switch(parametre) {
                case "education":{
                    $scope.profile.education.educ.push({name: '',duration: 0});
                    break;
                }
                case "language":{
                    $scope.profile.language.lang.push({name: ''});
                    break;
                }
                case "skill" :{

                    $scope.profile.skill.sk.push({name: '',number : 0});
                    break;
                }
                case "exprience" : {
                    $scope.profile.experience.exp.push({ name: ''});
                    break;
                }
            }
        }

        $scope.removeProfileItem = function(parametre , index){
          switch(parametre) {
            case "education":{
               $scope.profile.education.educ.splice(index, 1);
               break;
           }
           case "language":{
            $scope.profile.language.lang.splice(index, 1);
            break;
        }
        case "skill" :{
            $scope.profile.skill.sk.splice(index, 1);
            break;
        }
        case "exprience" : {
         $scope.profile.experience.exp.splice(index, 1);
         break;
     }
 }
}

$scope.searchProfile = function (){

    if($scope.profile.searchprofile.email ==null){$scope.profile.searchprofile.email=''};
    if($scope.profile.searchprofile.identifier ==null){$scope.profile.searchprofile.identifier=''};
    var profile = {
        email : $scope.profile.searchprofile.email,
        identifier : $scope.profile.searchprofile.identifier,
        education :$scope.profile.education,
        language :$scope.profile.language,
        skill : $scope.profile.skill,
        experience : $scope.profile.experience
    };
    console.log(profile);
    var posting = $http({
        method: 'POST',
        url: '/postSearch',
        data: profile,

        processData: false
    })
    posting.success(function (response) {
        $scope.searchResponse = response;
        console.log(response);
    });
}
function loadAllSkill(){

var postingSkill = $http({
    method: 'POST',
    url: '/returnSkills',
    data: "",

    processData: false
})
postingSkill.success(function (response) {
    $scope.searchMySkill = response;
    
});
};
function loadAllExperience(){

var postingSkill = $http({
    method: 'POST',
    url: '/returnExperience',
    data: "",

    processData: false
})
postingSkill.success(function (response) {
    $scope.searchMyExperience = response;
    console.log(response);
});
};

var userInfo = this;
userInfo.user = null;
userInfo.allUsers = [];
userInfo.deleteUser = deleteUser;

initController();


$scope.StartNetworkExpand = function() {
console.log("Start Expand")
    $scope.sendExpandRequest();
    $scope.numbaro = 0;
    var x = Math.floor((Math.random() * 10) + 1);
    $interval(function(){ x = Math.floor((Math.random() * 10) + 1); $scope.numbaro= $scope.numbaro+1; }, 1000*x);
};
$scope.sendExpandRequest = function () {
    
    var posting = $http({
        method: 'POST',
        url: '/postExpand',
        data: userInfo.user,

        processData: false
    })
    posting.success(function (response) {
        console.log(response);

    });
};
$scope.StartNetworkCreation = function() {

    $scope.sendCreationRequest();
    
};
$scope.sendCreationRequest = function () {

   console.log("inside click");
var posting = $http({
    method: 'POST',
    url: '/postCreation',
    data: userInfo.user,

    processData: false
})
posting.success(function (response) {
    console.log(response);

});
};
function initController() {
    $scope.searchMySkill = [];
    $scope.searchMyExperience = [];
    loadCurrentUser();

    loadAllUsers();
    loadAllSkill();
    loadAllExperience();
}

function loadCurrentUser() {
    UserService.GetByUsername($rootScope.globals.currentUser.username)
    .then(function (user) {
        userInfo.user = user;
    });
}

function loadAllUsers() {
    UserService.GetAll()
    .then(function (users) {
        userInfo.allUsers = users;
    });
}

function deleteUser(id) {
    UserService.Delete(id)
    .then(function () {
        loadAllUsers();
    });
}
}

})();



