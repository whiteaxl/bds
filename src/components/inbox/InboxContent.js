import React, {Component} from 'react';

import moment from 'moment';

import {
    StyleSheet,
    Text,
    View,
    Image, ListView,
    TouchableOpacity,
    TextInput, Alert,ScrollView

} from 'react-native';

import gui from '../../lib/gui';
import utils from '../../lib/utils';
import FullLine from '../line/FullLine';
import {Actions} from 'react-native-router-flux';

import GiftedSpinner from 'react-native-gifted-spinner';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';
import * as chatActions from '../../reducers/chat/chatActions';

import { SwipeListView } from 'react-native-swipe-list-view';



let defaultAvatar = require('../../assets/image/register_avatar_icon.png');
let adminAvatar = require('../../assets/image/icon_appstore.jpg');

const actions = [
  globalActions,
  authActions,
  chatActions
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

class InboxContent extends React.Component {
  constructor(props) {
    super(props);
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  onDelete() {
    this.coming();
  }

  onRowClick(row) {
    let {relatedToAds, partner} = row;

    this.props.actions.startChat(this.props.global.currentUser.userID,
        partner,
        relatedToAds);
    Actions.Chat();
  }

  onChatWithAdmin() {
    this.coming();
  }

  renderChatWithAdmin() {
    let avatar = adminAvatar;

    return (
        <TouchableOpacity onPress={() => this.onChatWithAdmin()} style={styles.rowFront}>
          <View style={[styles.rowContainer, {borderTopWidth:0}]}>
            <Image
                resizeMode = {"cover"}
                source={avatar}
                style={styles.thumbnail}/>
            <View style={styles.rightContainer}>
              <View style={styles.nameAndDateTime}>
                <Text style={styles.name}>Landber</Text>
              </View>


              <View style={styles.titleAndLastMsg}>
                <Text numberOfLines={1} style={styles.title}>Chat trực tiếp với quản lý</Text>
              </View>

            </View>
          </View>
        </TouchableOpacity>
    );
  }

  renderRow(row, sectionID, rowID) {
    let avatar = row.partner.avatar ? {uri: row.partner.avatar} : defaultAvatar;
    let relatedToAds = row.relatedToAds;
    const {giaFmt, loaiNhaDatFmt, diaChinhFullName} = relatedToAds;
    let adsInboxTitle = `${giaFmt} - ${loaiNhaDatFmt} - ${diaChinhFullName}`;

    let dt = moment(row.date).format("DD/MM   HH:mm");
    dt = dt.replace("/", " tháng ");
    //let w = rowID == 0 ? 0 : 1;
    let w = 1

    console.log("============== print Inbox row");
    console.log(row);
    console.log("============== print Inbox row end");

    return (
        <TouchableOpacity onPress={() => this.onRowClick(row)} style={styles.rowFront}>
          <View style={[styles.rowContainer, {marginLeft: 0, paddingLeft:5}]}>
            <AvatarItem avatar={row.partner.avatar}/>
            {/*<View style={{justifyContent:'center', alignItems:'center'}}>
              <Image
                  resizeMode = {"cover"}
                  source={avatar}
                  style={styles.thumbnail}/>
            </View>
            */}
            <View style={styles.rightContainer}>
              <View style={styles.nameAndDateTime}>
                <Text style={styles.name}>{row.partner.fullName}</Text>
                <Text style={styles.dateTime}>{dt}</Text>
              </View>

              <View style={styles.rightRow2}>
                <View style={styles.titleAndLastMsg}>
                  <Text numberOfLines={1} style={styles.title}>{relatedToAds ? adsInboxTitle:"<Không tựa đề>"}</Text>
                  <Text style={styles.content}>{row.content||"Nội dung tin nhắn cuối cùng"}</Text>
                </View>
                <Image
                    resizeMode = {"cover"}
                    source={{uri: relatedToAds.cover}}
                    style={styles.adsCover}/>
              </View>
            </View>
          </View>
          <FullLine />
        </TouchableOpacity>
    );
  }

  render() {
    return (
        <View>
          {/*this.renderChatWithAdmin()*/}
          <ScrollView style={styles.wrapper}>
            <SwipeListView
                enableEmptySections={true}
                dataSource={this.props.inbox.allInboxDS}
                renderRow={this.renderRow.bind(this)}
                style={styles.listView}

                renderHiddenRow={ data => (
                <View style={styles.rowBack}>
                  <TouchableOpacity onPress = { () => this.onDelete(data)}>
                    <Text style={styles.deleteText}>Lưu trữ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = { () => this.onDelete(data)}>
                    <Text style={styles.deleteText}>Xóa</Text>
                  </TouchableOpacity>

                </View>
            )}

                rightOpenValue={-75}
                leftOpenValue={75}
            />
            <Text style={styles.bottomText}>Tất cả đã được hiển thị</Text>
          </ScrollView>
        </View>
    );
  }
}

class AvatarItem extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      avatar: props.avatar ? {uri: props.avatar} : defaultAvatar,
      numberOfNotification: props.numberOfNotification || 45
    }
  }

  render() {
    return (
        <View style={{justifyContent:'center', alignItems:'center', borderRadius: 20}}>
          <Image
              resizeMode = {"cover"}
              source={this.state.avatar}
              style={styles.thumbnail}>
          </Image>
          <View style={styles.notification}>
            <Text style={styles.notificationText}>
              {this.state.numberOfNotification}
            </Text>
          </View>
        </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InboxContent);


var styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    marginBottom: 50
  },

  deleteText : {
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: "white",
    fontWeight : 'normal',
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

  rowFront :{
    flex: 1,
  },

  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eceef0',
    borderTopWidth: 0,
    borderColor: '#e6e6e6',
    paddingTop: 0,
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
    fontWeight: '600'
  },
  content: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  thumbnail: {
    paddingLeft:10,
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20
  },
  notification: {
    position: 'absolute',
    backgroundColor: '#ffc600',
    top: 1,
    right: 1,
    alignSelf: 'auto',
    width: 18,
    height: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationText: {
    fontSize: 10,
    fontFamily: gui.fontFamily,
    fontWeight: "400",
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  listView: {
    paddingTop: 0,
    backgroundColor: 'white',
    borderColor: '#e6e6e6',
    borderBottomWidth: 0
  },
  nameAndDateTime : {
    flex: 1,
    flexDirection: 'row'
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
    color: 'gray',
    paddingTop: 10
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: gui.mainColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0,
  },

});