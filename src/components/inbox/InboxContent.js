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
import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';
import * as chatActions from '../../reducers/chat/chatActions';

import { SwipeListView } from 'react-native-swipe-list-view';



let defaultAvatar = require('../../assets/image/register_avatar_icon.png');

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
    let {doc, partner} = row;

    this.props.actions.startChat(partner, doc.relatedToAds);
    Actions.Chat();
  }

  renderRow(row, sectionID, rowID) {
    let avatar = row.partner.avatar ? {uri: row.partner.avatar} : defaultAvatar;
    let relatedToAds = row.doc.relatedToAds;
    const {giaFmt, loaiNhaDatFmt, diaChinhFullName} = relatedToAds;
    let adsInboxTitle = `${giaFmt} - ${loaiNhaDatFmt} - ${diaChinhFullName}`;

    let dt = moment(row.doc.date).format("DD/MM   HH:mm");
    dt = dt.replace("/", " tháng ");
    let w = rowID == 0 ? 0 : 1;

    return (
      <TouchableOpacity onPress={() => this.onRowClick(row)} style={styles.rowFront}>
        <View style={[styles.rowContainer, {borderTopWidth:w}]}>
          <Image
            resizeMode = {"cover"}
            source={avatar}
            style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <View style={styles.nameAndDateTime}>
              <Text style={styles.name}>{row.partner.fullName}</Text>
              <Text style={styles.dateTime}>{dt}</Text>
            </View>

            <View style={styles.rightRow2}>
              <View style={styles.titleAndLastMsg}>
                <Text numberOfLines={1} style={styles.title}>{relatedToAds?adsInboxTitle:"<Không tựa đề>"}</Text>
                <Text style={styles.content}>{row.doc.content}</Text>
              </View>
              <Image
                resizeMode = {"cover"}
                source={{uri: relatedToAds.cover}}
                style={styles.adsCover}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <SwipeListView
          enableEmptySections={true}
          dataSource={this.props.inbox.allInboxDS}
          renderRow={this.renderRow.bind(this)}
          style={styles.listView}

          renderHiddenRow={ data => (
                <View style={styles.rowBack}>
                  <TouchableOpacity onPress = { () => this.onDelete(data)}>
                    <Text style={styles.deleteText}>  Lưu trữ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = { () => this.onDelete(data)}>
                    <Text style={styles.deleteText}>Xóa     </Text>
                  </TouchableOpacity>

                </View>
            )}

          rightOpenValue={-75}
          leftOpenValue={75}
        />

        <Text style={styles.bottomText}>Tất cả đã được hiển thị</Text>
      </ScrollView>
    );
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e6e6e6',
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
    fontWeight: '600'
  },
  content: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  thumbnail: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: gui.mainColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0,
  },

});