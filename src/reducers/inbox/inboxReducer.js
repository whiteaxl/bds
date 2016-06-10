'use strict';
const InitialState = require('./inboxInitialState').default;


const {
  ON_DB_CHANGE,
  ON_INBOX_FIELD_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

//all = [{doc}]
function getInboxList(all) {
  let mapByAds = {};
  let user = all.filter(e => e.doc.type == 'User')[0];
  console.log("user=", user);
  const myUserID = user.doc.userID;

  console.log("My userID = " + myUserID);


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
        console.log("new key=" + key);
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


  console.log("getInboxList, result=", array);

  return array;
}

export default function inboxReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case ON_DB_CHANGE:
    {
      console.log("Calling InboxReducer.ON_DB_CHANGE...", action.payload);
      const {e, all} = action.payload;
      const inboxList = getInboxList(all);
      const ds = state.allInboxDS;
      const newDs = ds.cloneWithRows(inboxList);

      let nextState = state.set("allInboxDS", newDs);

      return nextState;
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
