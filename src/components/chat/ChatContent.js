import React, {Component} from 'react';

import moment from 'moment';

import {
  StyleSheet,
  Text, Navigator,
  View, Dimensions,
  Image, ListView,
  TouchableOpacity,
  TextInput, Alert,ScrollView,

} from 'react-native';

import gui from '../../lib/gui';
import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as chatActions from '../../reducers/chat/chatActions';

import GiftedMessenger from 'react-native-gifted-messenger';

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;

const actions = [
  globalActions,
  chatActions,
];

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

class  ChatContent extends React.Component {
  constructor(props) {
    super(props);
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  handleSend(message = {}) {
    console.log("handleSend...", this.props.chat);

    const userID = this.props.global.currentUser.userID;

    let myMsg = {
      _id : "Chat_" + userID + "_" + new Date().getTime(),
      chatID : new Date(),
      fromUserID : userID,
      fromFullName : this.props.global.currentUser.fullName,
      toUserID : this.props.chat.partner.userID,
      toFullName : this.props.chat.partner.fullName,
      relatedToAds : this.props.chat.ads,
      content : message.text,
      msgType : message.type || 'text',
      read: false,
      date : new Date(),
      type: 'Chat'
    };

    console.log("handleSend... myMsg=", myMsg);

    this.props.actions.sendChatMsg(myMsg);
  }

  onErrorButtonPress() {
    this.coming();
  }

  onLoadEarlierMessages() {
    this.coming();
  }

  onImagePress() {
    this.coming();
  }

  handlePhonePress() {
    this.coming();
  }

  handleUrlPress() {
    this.coming();
  }

  handleEmailPress() {
    this.coming();
  }

  renderCustomText(rowData) {
    if(rowData.type=='image'){
      return (
        <Image resizeMode = {"cover"}
        source={{uri:rowData.text}}
        style={styles.image}/>
        )
    } else {
      return <Text>{rowData.text}</Text>;
    }
  }

  render() {
    return (
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}
          messages={this.props.chat.messages}
          handleSend={this.handleSend.bind(this)}
          onErrorButtonPress={this.onErrorButtonPress.bind(this)}
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

          loadEarlierMessagesButton={!this.props.chat.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

          senderName='Awesome Developer'
          senderImage={null}
          onImagePress={this.onImagePress}
          displayNames={true}

          forceRenderImage = {true}

          parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
          handlePhonePress={this.handlePhonePress}
          handleUrlPress={this.handleUrlPress}
          handleEmailPress={this.handleEmailPress}

          isLoadingEarlierMessages={this.props.chat.isLoadingEarlierMessages}

          typingMessage={this.props.chat.typingMessage}

          renderCustomText = {this.renderCustomText.bind(this)}
        />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContent);


var styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    marginBottom: 50
  },

  text: {
    flex: 1,
    alignSelf:'center',
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: gui.mainColor,
    fontWeight : 'normal',
    top: 9,
  },

  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e6e6e6',
    marginLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  rightContainer: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    color: 'gray',
    flex: 1,
  },
  dateTime: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Open Sans',
    //borderWidth: 2,
    //borderColor: 'red',
    marginRight: 18
  },
  title: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  content: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  image: {
    height: 100,
  },
  listView: {
    paddingTop: 0,
    backgroundColor: 'white',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1
  },
  nameAndDateTime : {
    flex: 1,
    flexDirection: 'row',

  },

  rightRow2 : {
    flexDirection: 'row',
  },
  titleAndLastMsg : {
    flex: 1,
    flexDirection: 'column',
  },
  adsCover : {
    width: 40,
    height: 40,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 4
  },
  bottomText : {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#e4e4e4',
    paddingTop: 10
  }

});