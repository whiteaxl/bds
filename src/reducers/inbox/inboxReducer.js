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
            //log.info("New chat msg, update inboxList doc.epoch", doc.epoch);
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

//all = [{doc}]
function getInboxList(all) {
  let mapByAds = {};
  let user = all.filter(e => e.doc.type == 'User')[0];
  log.info("user=", user);
  if (!user) return;

  const myUserID = user.doc.userID;

  log.info("My userID = " + myUserID);


  all.forEach(e => {
    const doc = e.doc;
    let partner;

    if (myUserID == doc.toUserID) {
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

    if (doc.type == 'Chat' && doc.relatedToAds && doc.relatedToAds.adsID) {
      const adsID = doc.relatedToAds.adsID;
      const key = adsID + partner.userID;

      if (!mapByAds[key]) {
        log.info("new key=" + key);
        mapByAds[key] = {doc, partner};
      } else if (mapByAds[key].doc.date < doc.date) {
        mapByAds[key] = {doc, partner};
      }
    }
  });

  var array = Object.keys(mapByAds).map(function(key) {
    return mapByAds[key];
  });
  array.sort((a, b) => {
    return a.doc.date > b.doc.date;
  });


  //log.info("getInboxList, result=", array);

  return array;
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
      //const inboxList = getInboxList(all);

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
