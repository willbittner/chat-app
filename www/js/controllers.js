angular.module('starter.error', ['ngResource'])
    .controller('errorCtrl', ['$scope', '$http', function ($scope, $http) {
        function sendCrashReport(themessage, theurl, thelinenumber, column, errorObj) {
            console.log("In send crash report");
            var stack = '';
            if (errorObj !== undefined) //so it won’t blow up in the rest of the browsers
                stack = errorObj.stack;
            $http.post('http://testjson-backend-willbittner.c9.io/errors', {
                    method: "POST",
                    appId: 1,
                    errorMsg: themessage,
                    url: theurl,
                    lineNumber: thelinenumber,
                    stackTrace: stack
                })
                .success(function (data) {
                    console.log(data);
                });
        }
        window.onerror = sendCrashReport;
        //sendCrashReport("eror msg", "http://dasfsdfas", 3342, 333, "stack");
    }]);
angular.module('exceptionOverride', [])
    .factory('$exceptionHandler', function () {
        return function (exception, cause) {
            exception.message += ' (caused by "' + cause + '")';
            console.log("Exception" + exception.message);
            //throw exception;
        };
    });
angular.module('starter.controllers', [])
    .controller('DashCtrl', function ($scope) {})
    .controller('ChatsCtrl', function ($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })
    .controller('ChatDetailCtrl', function ($scope, $stateParams, $mdBottomSheet, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
        $scope.chat.newChatMsg = '';
        var newMsg = function () {
            return {
                msg: $scope.chat.newChatMsg
            };
        };
        $scope.sendMsg = function (msga) {
            console.log("Msg to be sent: " + msga);
            var amsg = Chats.create($stateParams.chatId, msga);
            Chats.add($stateParams.chatId, amsg);
            console.log("sent chat msg: " + amsg);
        };
        $scope.showListBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                    templateUrl: 'templates/bottomSendMsg.html',
                    controller: 'bottomBoxController',
                    // targetEvent: $event

                })
                .then(function (clickedItem) {
                    $scope.newChatMsg = clickedItem;
                    $scope.sendMsg($scope.newChatMsg);
                });
        };
    })
    .controller('bottomBoxController', function ($scope, $mdBottomSheet, Chats) {
        $scope.chat = {};
        $scope.chat.currentMsg = "";
        $scope.boxMsg = function (msg) {
            console.log("msg" + msg);
            $mdBottomSheet.hide(msg);
        }
        return;
    })
    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })
    .controller('LoginCtrl', function ($scope, $state) {
        $scope.user = {
            username: '',
            password: '',
            isLoggedIn: false,
            badPassword: false
        };
        $scope.alertBarClas = "md-default-style";
        $scope.checkPassword = function () {
            console.log("User is trying to login");
            if ($scope.user.username === $scope.user.password) {
                $scope.user.isLoggedIn = true;
                console.log("User is logged in");
                $scope.user.badPassword = false;
                $scope.alertBarClass = "md-default-style";
                $state.go('tab.chats');
            } else {
                $scope.user.badPassword = true;
                $scope.alertBarClass = "md-warn";
            }
        };
        console.log("User is in login screen");
    });
