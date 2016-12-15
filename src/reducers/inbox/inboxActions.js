'use strict';

const {
  ON_INBOX_FIELD_CHANGE,
  LOADING_INBOX_REQUEST,  
  LOADING_INBOX_SUCCESS,  
  LOADING_INBOX_FAILURE,  
} = require('../../lib/constants').default;

const _ = require('lodash');

import log from "../../lib/logUtil";
import chatApi from "../../lib/ChatApi";
import gui from '../../lib/gui';

export function onInboxFieldChange(field, value) {
  return {
    type: ON_INBOX_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function setLoadingInbox() {
  return {
    type: LOADING_INBOX_REQUEST
  };
}

export function fetchInboxSuccess(payload) {
  return {
    type: LOADING_INBOX_SUCCESS,
    payload: payload
  };
}

export function fetchInboxFailure(error) {
  return {
    type: LOADING_INBOX_FAILURE,
    payload: error
  };
}

export function loadInbox(userID) {
  return dispatch => {

    dispatch(setLoadingInbox());

    return chatApi.getInboxMsg(userID)
        .then((res) => {
          log.info("getInboxMsg", res);
          if (res.status==0) {
              res.data.map(
                  (e) => {
                      let dto = {userID: userID, partnerUserID: e.partner.userID, adsID: e.relatedToAds.adsID};
                      chatApi.getAllChatMsg(dto)
                          .then((chatRes) => {
                              if (chatRes.status==0){
                                  console.log("========= inboxAction print res");
                                  console.log(res);
                                  console.log("========= inboxAction print chatRes");
                                  console.log(chatRes);
                              }
                          });
                  }
              );

            dispatch(fetchInboxSuccess(res.data));
            return res.data;
          } else if (res.error) {
            dispatch(fetchInboxFailure(res.error));
          }

          else {
            dispatch(fetchInboxFailure(gui.ERR_LoiKetNoiMayChu));
          }
        });
  }
}






