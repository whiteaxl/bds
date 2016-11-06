import io from 'socket.io-client/socket.io';

import cfg from "../cfg";

import ApiUtils from './ApiUtils';

var getInboxMsgUrl = cfg.rootUrl + "/getInboxMsg";
var getAllChatMsgUrl = cfg.rootUrl + "/getAllChatMsg";

import log from './logUtil';

const socket = io(`http://${cfg.server}:5000`, {
    transports: ['websocket'] // you need to explicitly tell it to use websockets
});

var ChatApi = {
    connectAndStartListener: function(userDto, onNewMessage, onUnreadMessage) {
        socket.on('connect', () => {
            console.log('socket.io connected!');
        });

        // register my user
        socket.emit('new user'
            , { email: userDto.email,
                phone: userDto.phone,
                userID:  userDto.userID,
                username : userDto.fullname,
                avatar : userDto.avatar
            }
            , function(data){
                console.log("registered user to chat panel " + userDto.userID);
              }
        );

        socket.on("unread-messages", function(data){
            //TODO: implement on Unread Message
            for (var i = 0, len = data.length; i < len; i++) {
                var msg = data[i].default;
                console.log("====================== print msg container");
                console.log(data[i]);
                console.log("====================== print msg");
                console.log(msg);
                console.log("====================== print msg end");
            }
            socket.emit("read-messages",data, function(res){
                console.log("mark messages as read " + res);
            });
        });
    },

    disconnect: function (userID) {
        socket.emit('user leave'
            ,   {userID:  userID}
            ,   function(data){
                    console.log("disconect socket user " + userID);
                    console.log("========== disconect socket return " + JSON.stringify(data));
                }
        );
    },

    sendChatMsg: function(msg){
        socket.emit("send-message", msg, function(data){
            console.log("======================== send msg succesfully");
            console.log(data);
            console.log("======================== send msg succesfully end");
            return data;
        });

    },

    onNewMsg(){
        socket.on("new message", function(data){
            //TODO: implement on New Message
            console.log("============ get New message");
            onNewMessage(data);
            console.log(data);
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

