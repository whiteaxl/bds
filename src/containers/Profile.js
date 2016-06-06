'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {Text, View, StyleSheet, ListView, Image, TextInput} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import log from "../lib/logUtil";
import gui from "../lib/gui";


const actions = [
  globalActions,
  authActions,
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

import dbService from "../lib/localDB";


var {manager} = require('react-native-couchbase-lite');
var localDbName = 'default';
var database = new manager('http://admin:321@localhost:5984/', localDbName);

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      chatTo: "",
      chatMsg: "",
      myAds: [],
      newFullName: "",
      userID: "",
      phone: "",
      email: "",
      fullName: "",
      chatDs: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
    log.enter("Profile screen - calling componentDidMount");

    database.getAllDocuments()
      .then((all) => {
        log.info(all);
        this.setState({
          myAds: all.rows
        })
      })
      .catch((e) => {
        log.error(e);
      });
  }

  onTestSync() {
    dbService.getAllDocuments()
      .then((res) => {
        const allDoc = res.map(one => one.doc);
        console.log("getAllAds done", allDoc);

        var listAds = allDoc;

        let users = allDoc.filter((x) => x.type='User');
        let chats = allDoc.filter((x) => x.type === 'Chat');

        console.log("myUser:", users);

        if (users.length > 0) {
          this.setState({
            userID: users[0]._id,
            phone: users[0].phone,
            fullName: users[0].fullName,
            newFullName: ""
          });
        }

        this.setState({
          myAds: listAds,
          chat: chats,
          chatDs: this.state.chatDs.cloneWithRows(chats)
        })
      })
      .catch((res) => {
        console.log("getAllAds fail", res);
      });

    //print user:

    dbService.getUser().then((user) => {
      console.log("User doc:", user);
    })

  }

  sendChat() {
    dbService.sendChat(this.state);
  }

  updateFullName() {
    console.log(this.state.newFullName, this.state.userID);

    dbService.updateFullName(this.state.userID, this.state.newFullName);
  }

  _renderChat(ads) {
    //var ads = ads.doc;
    const timeFmt = ads.timestamp.toString().substr(11, 8);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{ads.fromUser} - {ads.msg} - {timeFmt}</Text>
      </View>
    );
  }

  _logout() {
    //const sessionID = this.props.auth.sessionCookie;

    this.props.actions.logout();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Welcome {this.props.auth.phone} - {this.state.fullName}</Text>

        <Button style={styles.btn} onPress={this._logout.bind(this)}>Logout</Button>

        <Button style={styles.btn} onPress={this.onTestSync.bind(this)}>TestSync</Button>

        <Text style={styles.text}> Enter new fullName:</Text>

        <TextInput style={styles.input}
                   placeholder="New Fullname"
                   autoFocus={true}
                   onChangeText={(fullName) => this.setState({newFullName:fullName})}
        />

        <Button style={styles.btn} onPress={this.updateFullName.bind(this)}>Update</Button>

        <Text style={styles.text}> Send to:</Text>
        <TextInput style={styles.input}
                   placeholder="To"
                   autoFocus={true}
                   onChangeText={(chatTo) => this.setState({chatTo})}
        />

        <Text style={styles.text}> Msg:</Text>
        <TextInput style={styles.input}
                   placeholder="Msg"
                   autoFocus={true}
                   onChangeText={(chatMsg) => this.setState({chatMsg})}
        />

        <Button style={styles.btn} onPress={this.sendChat.bind(this)}>Send</Button>

        <Text style={styles.text}>Number of my ads: {this.state.myAds ? this.state.myAds.length : 0}</Text>

        <Text style={styles.text}> List of chat msg:</Text>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.chatDs}
          renderRow={this._renderChat}
          style={styles.listView}/>


      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

var styles = StyleSheet.create({
  container: {
    top: 60,
    flex: 1,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  text: {
    fontFamily: gui.fontFamily,
    fontSize: gui.fontSize
  },
  btn: {
    margin: 10
  },

  thumbnail: {
    width: 120,
    height: 60
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center'
  },
  input: {
    fontSize: 15,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'yellow',
  },
  year: {
    textAlign: 'center'
  },
  listView: {
    paddingTop: 0,
    backgroundColor: 'white',
    flex: 1,
    marginBottom: 140,
    borderWidth: 1,
    borderColor: 'green'
  }
});