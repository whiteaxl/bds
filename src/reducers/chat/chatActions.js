'use strict';

const {
  ON_CHAT_FIELD_CHANGE,
  REQUEST_START_CHAT,
  INSERT_MY_CHAT
} = require('../../lib/constants').default;

const _ = require('lodash');

import log from "../../lib/logUtil";
import dbService from "../../lib/localDB";
import chatApi from "../../lib/ChatApi";

export function onChatFieldChange(field, value) {
  return {
    type: ON_CHAT_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function requestStartChat(data) {
  return {
    type: REQUEST_START_CHAT,
    payload: data
  }
}

//payload={doc, partner}, doc is latest CHAT msg
export function startChat(userID, partner, ads) {
  return dispatch => {
    let dto = {userID: userID, partnerUserID: partner.userID, adsID: ads.adsID};
    chatApi.getAllChatMsg(dto)
      .then((res) => {
        if (res.status==0){
          dispatch(requestStartChat({allMsg: res.data, partner, ads}))
        }

      });
  };
}

export function insertMyChat(msg) {
  return {
    type: INSERT_MY_CHAT,
    payload: msg
  }
}


/*
export function sendChatMsg(msg) {
  return dispatch => {

    dispatch(insertMyChat(msg));

    dbService.sendChat(msg)
      .then( res => log.info("sendChatMsg done, result:" + res))
      .catch(res => {
        log.info("Error sendChat, error msg:" + res);
      });
  };
}
*/

export function sendChatMsg(msg) {
  return dispatch => {
    dispatch(insertMyChat(msg));
    chatApi.sendChatMsg(msg);
  };
}






