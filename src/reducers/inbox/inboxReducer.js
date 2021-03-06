'use strict';
const InitialState = require('./inboxInitialState').default;

import log from '../../lib/logUtil';
import util from '../../lib/utils';

const {
  ON_DB_CHANGE,
  ON_INBOX_FIELD_CHANGE,
  LOGOUT_SUCCESS,
  LOADING_INBOX_SUCCESS,
  ON_NEW_MESSAGE,
  INSERT_MY_CHAT
} = require('../../lib/constants').default;

const initialState = new InitialState;

function updateInboxList(docs, next) {
  let currentInboxList = next.inboxList;
  let changed = false;
  let nextInboxList = currentInboxList;
  log.info("updateInboxList, before:" , nextInboxList.length);


  docs.forEach((doc) => {
    if (doc.type == 'Chat') {
      if (!next.currentUserID) {
        log.warn("WARN! No current user, will ignore these chat msg!");
        return next;
      }

      let found = false;

      //console.log("updateInboxList", currentInboxList, doc);

      for (let i=0; i < currentInboxList.length; i++) {
        let {partner} =  currentInboxList[i];
        let oldDoc = currentInboxList[i].doc;

        if ((partner.userID === doc.fromUserID || partner.userID === doc.toUserID)
        && doc.relatedToAds.adsID == oldDoc.relatedToAds.adsID) {
          if (oldDoc.timeStamp <= doc.timeStamp) {
            nextInboxList = [
              ...currentInboxList.slice(0, i),
              {doc: doc, partner: partner},
              ...currentInboxList.slice(i+1)
            ];
            changed = true;
          }
          found = true;
          break;
        }
      }

      if (!found) {
        let partner;

        if (next.currentUserID == doc.toUserID) {
          partner = {
            userID : doc.fromUserID,
            fullName: doc.fromFullName,
            avatar : doc.fromUserAvatar
          };
        } else {
          partner = {
            userID : doc.toUserID,
            fullName: doc.toFullName,
            avatar : doc.toUserAvatar
          };
        }

        changed = true;
        nextInboxList = [...currentInboxList, {doc, partner}];
      }

      if (changed) {
        currentInboxList = nextInboxList;
      }
    }
  });

  if (changed) {
    const ds = next.allInboxDS;
    const newDs = ds.cloneWithRows(currentInboxList);

    log.info("InboxReducer - update new Inbox", currentInboxList.length);

    return next
      .set("inboxList", currentInboxList)
      .set("allInboxDS", newDs);
  }

  return next;
}

export default function inboxReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case ON_DB_CHANGE:
    {
      var next = state;
      const {doc} = action.payload;
      log.info("Calling InboxReducer.ON_DB_CHANGE...", doc, state.currentUserID);

      //handle user msg
      if (doc.type==='User') {
        log.info("InboxReducer,found user ", doc.userID);
        next = next.set('currentUserID', doc.userID);
        //refresh inbox
        next = updateInboxList(state.tmpChatList, next);

        next = next.set('tmpChatList', []);
      }

      if (state.currentUserID) {
        //handle chat msg
        next = updateInboxList([doc], next);
      } else {
        console.log("inboxReducer, tmpChatList=", next.tmpChatList);
        next = next.set('tmpChatList', [...next.tmpChatList, doc]);
      }

      return next;
    }

    case ON_INBOX_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case LOGOUT_SUCCESS: {
      let newState = state
        .set('currentUserID', null)
        .set("inboxList", [])
        .set("allInboxDS", state.allInboxDS.cloneWithRows([]))
        .set("tmpChatList", [])
        .set("loaiTin", 'all');

      return newState;
    }

    case LOADING_INBOX_SUCCESS: {
      var data = action.payload;
      var allRows = [];
      data.forEach(
          (row) =>{
            row.relatedToAds.loaiNhaDatFmt = row.relatedToAds.loaiNhaDatFmt ? row.relatedToAds.loaiNhatDatFmt : util.getLoaiNhaDatFmt(row.relatedToAds);
            if (row.msgType==2){
              if (row.fromUserID == row.partner.userID)
                row.content = 'Đã nhận ảnh';
              else
                row.content = 'Đã gửi ảnh'
            }
            if (row.msgType==3){
              if (row.fromUserID == row.partner.userID)
                row.content = 'Đã nhận vị trí';
              else
                row.content = 'Đã gửi vị trí'
            }
            allRows.push(row);
          }
      );

      const ds = state.allInboxDS;
      const newDs = ds.cloneWithRows(allRows);

      return state
          .set("inboxList", allRows)
          .set("allInboxDS", newDs);
    }

    case INSERT_MY_CHAT : {
      var msg = action.payload;
      
      var allRows = state.inboxList;

      let newInboxList = [];

      let changed = false;

      for(let i=0; i<allRows.length; i++){
        if (allRows[i].partner.userID == msg.toUserID && allRows[i].relatedToAds.adsID == msg.relatedToAds.adsID){
          let updateItem = JSON.parse(JSON.stringify(allRows[i]));
          updateItem.date = msg.date ? new Date(msg.date) : new Date();
          updateItem.content = msg.content;
          newInboxList = [updateItem, ...allRows.slice(0,i), ...allRows.slice(i+1)];
          changed = true;
          break;
        }
      }
      if (!changed){
        let newItem = {
          content: msg.content,
          numOfUnreadMessage: 0,
          msgType: msg.msgType,
          fromUserID: msg.fromUserID,
          date: msg.date ? new Date(msg.date) : new Date(),
          relatedToAds: msg.relatedToAds,
          partner: {
            fullName: msg.fromFullName,
            userID: msg.fromUserID,
            avatar: msg.fromUserAvar
          }
        }
        newInboxList = [newItem, ...allRows];
      }

      var ds = state.allInboxDS;
      var newDs = ds.cloneWithRows(newInboxList);

      return state
          .set("inboxList", newInboxList)
          .set("allInboxDS", newDs);

      return state;
    }

    case ON_NEW_MESSAGE:
    {
      let msg = action.payload.msg;

      var allRows = state.inboxList;

      let newInboxList = [];
      let changed = false;

      for(let i=0; i<allRows.length; i++){
        if (allRows[i].partner.userID == msg.fromUserID && allRows[i].relatedToAds.adsID == msg.relatedToAds.adsID){
          let updateItem = JSON.parse(JSON.stringify(allRows[i]));
          updateItem.date = msg.date ? new Date(msg.date) : new Date();
          updateItem.content = msg.content;
          updateItem.numOfUnreadMessage = updateItem.numOfUnreadMessage||0 + 1;
          newInboxList = [updateItem, ...allRows.slice(0,i), ...allRows.slice(i+1)];
          changed = true;
          break;
        }
      }
      if (!changed){
        let newItem = {
          content: msg.content,
          numOfUnreadMessage: 1,
          msgType: msg.msgType,
          fromUserID: msg.fromUserID,
          date: msg.date ? new Date(msg.date) : new Date(),
          relatedToAds: msg.relatedToAds,
          partner: {
            fullName: msg.fromFullName,
            userID: msg.fromUserID,
            avatar: msg.fromUserAvar
          }
        }
        newInboxList = [newItem, ...allRows];
      }
      var ds = state.allInboxDS;
      var newDs = ds.cloneWithRows(newInboxList);

      return state
          .set("inboxList", newInboxList)
          .set("allInboxDS", newDs);
    }
  }

  return state;
}
