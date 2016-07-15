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

import GiftedMessenger from '../giftedMessegener/GiftedMessenger';

import log from '../../lib/logUtil';
import danhMuc from '../../assets/DanhMuc';

import ImagePreview from '../ImagePreview';

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
var ADS_BAR_HEIGHT = 62;

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

    this.state = {
      imageUri: '',
      modal: false
    };
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  handleSend(message = {}) {
    log.info("Enter handleSend...", message);

    const userID = this.props.global.currentUser.userID;
    const chatID = "Chat_" + userID + "_" + new Date().getTime();

    let myMsg = {
      _id : chatID,
      chatID : chatID,
      id : chatID,
      fromUserID : userID,
      fromFullName : this.props.global.currentUser.fullName,
      toUserID : this.props.chat.partner.userID,
      toFullName : this.props.chat.partner.fullName,
      relatedToAds : this.props.chat.ads,
      avatar: this.props.global.currentUser.avatar,
      content : message.text,
      msgType : message.type || danhMuc.CHAT_MESSAGE_TYPE.TEXT,
      read: false,
      date : new Date(),
      type: 'Chat',
      timeStamp : new Date().getTime()
    };

    log.info("start send myMsg=", myMsg);

    this.props.actions.sendChatMsg(myMsg);
  }

  onErrorButtonPress() {
    this.coming();
  }

  onLoadEarlierMessages() {
    this.coming();
  }

  onImagePress(data) {
    this.doImagePress(data.image.uri);
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

  doImagePress(uri) {
    if (this.state.modal) {
      return;
    }
    this.setState({
      imageUri: uri,
      modal: true
    });
  }

  renderCustomText(rowData) {
    if(rowData.msgType==2){
      return (
        <TouchableOpacity
            onPress={this.doImagePress.bind(this, rowData.text)}>
        <Image resizeMode = {"cover"}
        source={{uri:rowData.text}}
        style={styles.image}/>
        </TouchableOpacity>
        )
    } else {
      let d  = new Date(rowData.date);
      let msg = rowData.text;

      if (rowData.position === 'left') {
        return <Text style={{color:'black'}}>{msg}</Text>;
      } else {
        return <Text style={{color:'white'}}>{msg}</Text>;
      }
    }
  }

  render() {
    let maxHeight = Dimensions.get('window').height
    - Navigator.NavigationBar.Styles.General.NavBarHeight
    - STATUS_BAR_HEIGHT
    - ADS_BAR_HEIGHT;

    log.info("maxHeight", maxHeight);

    let relatedToAds = this.props.chat.ads;
    log.info("relatedToAds", relatedToAds);
    const adsTextLine1 = relatedToAds.loaiNhaDatFmt + " - " + relatedToAds.diaChinhFullName;
    const adsTextLine2 = relatedToAds.giaFmt;

    let imageDataItems = [];
    imageDataItems.push(this.state.imageUri);

    return (
      <View style={styles.wrapper}>
        <View style = {styles.adsHeader}>
          <Image
            resizeMode = {"cover"}
            source={{uri: relatedToAds.cover}}
            style={styles.adsCover}/>

          <View style={styles.adsTitle}>
            <Text numberOfLines={1} style={styles.adsLine1}>{adsTextLine1}</Text>
            <Text style={styles.adsLine2}>{adsTextLine2}</Text>
          </View>
        </View>

        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          //renderTextInput = {this.renderTextInput.bind(this)}

          autoFocus={false}
          messages={this.props.chat.messages}
          handleSend={this.handleSend.bind(this)}
          onErrorButtonPress={this.onErrorButtonPress.bind(this)}
          maxHeight={maxHeight}

          loadEarlierMessagesButton={!this.props.chat.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

          senderName='Awesome Developer'
          senderImage={null}
          onImagePress={this.onImagePress.bind(this)}
          displayNames={true}

          forceRenderImage = {true}

          parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
          handlePhonePress={this.handlePhonePress}
          handleUrlPress={this.handleUrlPress.bind(this)}
          handleEmailPress={this.handleEmailPress}

          isLoadingEarlierMessages={this.props.chat.isLoadingEarlierMessages}

          typingMessage={this.props.chat.typingMessage}

          renderCustomText = {this.renderCustomText.bind(this)}
        />
        {this.state.modal ? <ImagePreview images={imageDataItems} owner={'chat'} closeModal={() => this.setState({modal: false}) }/> : null }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContent);


var styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    flex : 1
  },

  headerAds : {

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
  },

  textInputContainer: {
    height: 44,
    borderColor: '#b2b2b2',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    backgroundColor: '#FFF',
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 18,
    fontFamily: 'Open Sans',
  },
  sendButton: {
    marginTop: 11,
    marginLeft: 10,
  },
  adsCover : {
    width: 120,
    height: ADS_BAR_HEIGHT,
  },

  adsTitle : {
    flex: 1,
    flexDirection: 'column',
    paddingLeft : 10,
    paddingRight: 10
  },

  adsLine1: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: '600',
  },

  adsLine2: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    color : '#d10d16',
    paddingTop:5
  },
  adsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },

});