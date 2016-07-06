'use strict';
const InitialState = require('./inboxInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_DB_CHANGE,
  ON_INBOX_FIELD_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

function updateInboxList(newDocs, next) {
  let currentInboxList = next.inboxList;
  let changed = false;
  let nextInboxList = currentInboxList;

  newDocs.forEach((e) => {
    const {doc} = e;
    if (doc.type == 'Chat') {
      if (!next.currentUserID) {
        log.warn("WARN! No current user, will ignore these chat msg!");
        return next;
      }

      let found = false;

      //console.log("updateInboxList", currentInboxList, doc);

      for (let i=0; i < currentInboxList.length; i++) {
        let inbox =  currentInboxList[i];
        if (inbox.partner.userID === doc.fromUserID || inbox.partner.userID === doc.toUserID) {
          if (inbox.doc.timeStamp <= doc.timeStamp) {
            inbox.doc = doc;
            nextInboxList = [
              ...currentInboxList.slice(0, i),
              {doc: doc, partner: inbox.partner},
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

    log.info("InboxReducer - update new Inbox");

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
      const {e} = action.payload;
      log.info("Calling InboxReducer.ON_DB_CHANGE...", e);

      //handle user msg
      let userChanged = e.results.find((d) => d.doc.type==='User');
      if (userChanged) {
        log.info("InboxReducer,found user ", userChanged.doc.userID);
        next = next.set('currentUserID', userChanged.doc.userID);
      }

      //handle chat msg
      next = updateInboxList(e.results, next);

      return next;
    }

    case ON_INBOX_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }
  }

  return state;
}
