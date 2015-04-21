angular.module('starter.services', ['btford.socket-io'])
    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array
        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            chatMsgs: [],
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            chatMsgs: [],
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Andrew Jostlin',
            lastText: 'Did you get the ice cream?',
            chatMsgs: [],
            face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
        }, {
            id: 3,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            chatMsgs: [],
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 4,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            chatMsgs: [],
            face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
        }];
        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            add: function (chatId, chat) {
                chats[chatId].chatMsgs.push(chat);
            },
            create: function (chatId, chat) {
                return {
                    id: chatId,
                    chatMsg: chat
                };
            }
        };
    })
    .factory('ChatService', function (socketFactory, Chats) {
        // var myIoSocket = io.connect('/mdchat-server');
        //   mySocket = socketFactory({
        // ioSocket: myIoSocket
        // });
        var mySocket = io.connect('http://54.88.17.26:3000');
        mySocket.on('chat:recv', function (msg) {
            console.log("recv chat msg" + msg);
        });
        mySocket.on('chat:new', function (chat) {});
        return {
            getChats: function (userId) {},
            sendMsg: function (msg) {
                mySocket.emit('chat:send', msg);
            }
        };
    })
    .factory('ChatFactory', function (loginService, Chats, ChatService) {
        function ChatMsg() {
            this.msg = "";
            this.fromUser = "";
            this.toUser = "";
            this.chatId = "";
            this.msgId = "";
        }
        var currentChat;
        return {
            create: function (msg, chatId) {
                var newMsg = new ChatMsg();
                newMsg.msg = msg;
                newMsg.fromUser = loginService.user_name;
                newMsg.chatId = chatId;
                newMsg.toUser = Chats.get(chatId);
                ChatService.sendMsg(newMsg);
                Chats.get(chatId)
                    .chatMsgs.push(newMsg);
                return newMsg;
            },
            get: function (chatId) {
                currentChat = Chats.get(chatId);
                return currentChat.chatMsgs;
            },
            send: function (chat) {},
            recv: function (chat) {
                Chats.get(chat.chatId)
                    .chatMsgs.push(chat);
            },
            all: function (chatid) {
                return Chats.get(chat.chatId)
                    .chatMsgs;
            }
        };
    })
    .factory('loginService', function () {
        this.user_name = "";
        var password;
        var _isLoggedIn = false;
        return {
            login: function (un, pw) {
                if (un === pw) {
                    _isLoggedIn = true;
                    this.user_name = un;
                    return true;
                }
                return false;
            },
            logout: function () {
                _isLoggedIn = false;
            },
            isLoggedIn: function () {
                return _isLoggedIn;
            },
        };
    });
