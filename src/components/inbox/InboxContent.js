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
import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';

let defaultAvatar = require('../../assets/image/register_avatar_icon.png');

const actions = [
  globalActions,
  authActions
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

  renderRow(row, sectionID, rowID) {
    let dt = moment(row.date).format("DD/MM HH:mm");
    let w = rowID == 0 ? 0 : 1;
    let avatar = row.fromUserAvatar ? {uri: row.fromUserAvatar} : defaultAvatar;

    return (
      <View style={[styles.rowContainer, {borderTopWidth:w}]}>
        <Image
          resizeMode = {"cover"}
          source={avatar}
          style={styles.thumbnail}/>
        <View style={styles.rightContainer}>
          <View style={styles.nameAndDateTime}>
            <Text style={styles.name}>{row.fromFullName}</Text>
            <Text style={styles.dateTime}>{dt}</Text>
          </View>

          <View style={styles.rightRow2}>
            <View style={styles.titleAndLastMsg}>
              <Text style={styles.title}>{row.relatedToAds?row.relatedToAds.title:"<Không tựa đề>"}</Text>
              <Text style={styles.content}>{row.content}</Text>
            </View>
            <Image
              resizeMode = {"cover"}
              source={{uri: row.relatedToAds.cover}}
              style={styles.adsCover}/>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <ListView
          enableEmptySections={true}
          dataSource={this.props.inbox.allInboxDS}
          renderRow={this.renderRow}
          style={styles.listView}/>

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
  }

});