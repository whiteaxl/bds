'use strict';
const InitialState = require('./chatInitialState').default;



const {
  ON_CHAT_FIELD_CHANGE,
  REQUEST_START_CHAT,
  ON_DB_CHANGE
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function chatReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case REQUEST_START_CHAT:
    {
      let {allMsg, doc, partner} = action.payload;
      console.log("call REQUEST_START_CHAT:", partner);

      let messages = convertToGiftMsg(allMsg, partner.userID);

      let nextState = state.set("partner", partner)
        .set('ads', doc.relatedToAds)
        .set('messages', messages);

      return nextState;
    }

    case ON_CHAT_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case ON_DB_CHANGE:
    {
      console.log("Calling chatReducer.ON_DB_CHANGE...", action.payload);
      const {e, all} = action.payload;
      const partnerID = state.partner.userID;

      var nextState = state;
      var {messages} = state;

      e.results.forEach((one) => {
        let doc = one.doc;
        if (doc.type == 'Chat' &&
            (doc.fromUserID == partnerID || doc.toUserID == partnerID)) {
          convertOne(doc, partnerID);
          messages = [...messages,doc];
        }
      });
      nextState = state.set('messages',messages);
      return nextState;
    }
  }

  return state;
}

function convertOne(e, partnerID) {
  e.uniqueId = e.date;
  e.position = e.fromUserID == partnerID ? 'right' : 'left';
  e.text = e.content;
  e.name = e.fromFullName;

  return e;
}

function convertToGiftMsg(allMsg, partnerID) {
  allMsg.sort((a, b) => {
    return a.date > b.date;
  });

  let messages = allMsg.map((e) => {
    convertOne(e, partnerID);
    return e;
  });

  return messages;
}