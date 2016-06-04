'use strict';
const InitialState = require('./inboxInitialState').default;



const {
  ON_DB_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

//all = [{doc}]
function getInboxList(all) {
  let mapByAds = {};

  all.forEach(e => {
    const doc = e.doc;
    if (doc.type = 'Chat' && doc.relatedToAds && doc.relatedToAds.adsID) {
      const adsID = doc.relatedToAds.adsID;
      if (!mapByAds[adsID]) {
        mapByAds[adsID] = doc;
      } else if (mapByAds[adsID].msgEpoch < doc.msgEpoch) {
        mapByAds[adsID] = doc;
      }
    }
  });

  return mapByAds;
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
  }

  return state;
}
