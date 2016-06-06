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
  let user = all.filter(e => e.type == 'User')[0];
  const myUserID = user.userID;


  all.forEach(e => {
    const doc = e.doc;
    if (doc.type = 'Chat' && doc.relatedToAds && doc.relatedToAds.adsID) {
      const adsID = doc.relatedToAds.adsID;
      const partner = myUserID == doc.toUserID ? doc.fromUserID : doc.toUserID;
      const key = adsID + partner;

      if (!mapByAds[key]) {
        mapByAds[key] = doc;
      } else if (mapByAds[key].date < doc.date) {
        mapByAds[key] = doc;
      }
    }
  });

  var array = Object.keys(mapByAds).map(function(key) {
    return mapByAds[key];
  });
  array.sort((a, b) => {
    return a.date > b.date;
  });

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
