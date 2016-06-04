import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image, ListView,
  TouchableOpacity,
  TextInput, Alert

} from 'react-native';

import gui from '../../lib/gui';
import {Actions} from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';

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

class AllInboxTab extends React.Component {
  constructor(props) {
    super(props);
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  renderRow(row) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: row.toUserCover}}
          style={styles.thumbnail}/>
        <View style={styles.rightContainer}>
          <Text style={styles.name}>{row.toFullName}</Text>
          <Text style={styles.title}>{row.relatedToAds?row.relatedToAds.title:"<Không tựa đề>"}</Text>
          <Text style={styles.content}>{row.content}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ListView
          enableEmptySections={true}
          dataSource={this.props.inbox.allInboxDS}
          renderRow={this.renderRow}
          style={styles.listView}/>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllInboxTab);


var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
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

  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: 'gray'
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  content: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },

});