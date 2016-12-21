import io from 'socket.io-client/socket.io';

import cfg from "../cfg";

import ApiUtils from './ApiUtils';

var getInboxMsgUrl = cfg.rootUrl + "/getInboxMsg";
var getAllChatMsgUrl = cfg.rootUrl + "/getAllChatMsg";

import log from './logUtil';
import gui from './gui';

const socket = io(`https://${cfg.server}`, {
    transports: ['websocket'] // you need to explicitly tell it to use websockets
});

var ChatApi = {
    connectAndStartListener: function(userDto, onNewMessage, onTypingMessage, onCheckUserOnline) {
        console.log("chatApi.connectAndStartListener");
        
        socket.on('connect', () => {
            console.log('socket.io connected!');
        });

        // register my user
        socket.emit('new user'
            , { email: userDto.email,
                phone: userDto.phone,
                userID:  userDto.userID,
                sessionID: userDto.token,
                username : userDto.fullname,
                avatar : userDto.avatar
            }
            , function(data){
                console.log("registered user to chat panel " + userDto.userID);
              }
        );

        socket.on("new message", function(data){
            onNewMessage(data);
        });

        socket.on("unread-messages", function(data){
            //TODO: implement on Unread Message
            for (var i = 0, len = data.length; i < len; i++) {
                var msg = data[i].default;
                console.log(msg);
            }
            socket.emit("read-messages",data, function(res){
                console.log("mark messages as read " + res);
            });
        });

        socket.on("user-start-typing", function(data){
            onTypingMessage({data: data, isTyping: true});
        });

        socket.on("user-stop-typing", function(data){
            onTypingMessage({data: data, isTyping: false});
        });

        socket.on('check user online', function(data){
            onCheckUserOnline(data);
        });
    },

    disconnect: function (user) {
        console.log("chatApi.disconnect");
        socket.emit('user leave'
            ,   {userID:  user.userID, sessionID: user.token}
            ,   function(data){
                    console.log("disconect socket return " + JSON.stringify(data));
                }
        );
    },

    sendChatMsg: function(msg){
        socket.emit("send-message", msg, function(data){
            return data;
        });
    },

    sendStartTyping: function(fromUserID, toUserID){
        socket.emit("user-start-typing", {fromUserID: fromUserID, toUserID: toUserID}, function(data){
            console.log("emit start typing to " + toUserID);
        });
    },

    sendStopTyping: function(fromUserID, toUserID){
        socket.emit("user-stop-typing", {fromUserID: fromUserID, toUserID: toUserID}, function(data){
            console.log("emit stop typing to " + toUserID);
        });
    },

    checkUserOnline(fromUserID, toUserID){
        console.log("emit check user online " + toUserID);

        socket.emit("check user online", {fromUserID: fromUserID, toUserID: toUserID}, function(data){
            console.log("emit check user online " + toUserID);
        });
    },

    getInboxMsg(userID) {
        const url  = getInboxMsgUrl;
        const dto = {userID: userID};
        log.info("Call fetch ", url, userID);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        })
            .then(ApiUtils.checkStatus)
            .then(response => {
                return response.json()
            })
            .catch(e => {
                log.info("Error in getInboxMsg", e);
                return {
                    status : 101,
                    msg: gui.ERR_LoiKetNoiMayChu
                }
            });
    },

    getAllChatMsg(dto) {
        const url  = getAllChatMsgUrl;
        const {userID} = dto
        log.info("Call fetch ", url, userID);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        })
            .then(ApiUtils.checkStatus)
            .then(response => {
                return response.json()
            })
            .catch(e => {
                log.info("Error in getAllChatMsg", e);
                return {
                    status : 101,
                    msg: gui.ERR_LoiKetNoiMayChu
                }
            });
    }
};

export { ChatApi as default };

