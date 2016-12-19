import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

import * as globalActions from '../../reducers/global/globalActions';
import * as chatActions from '../../reducers/chat/chatActions';

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


class ChatHeader extends Component {
  constructor(props) {
     super(props);
  }

  coming() {
    Alert.alert("Coming soon...");
  }

  render() {
    return (
    <View style={styles.container}>
        <TruliaIcon onPress={this._onBack}
                  name="arrow-left" color={'white'} size={25}
                  mainProps={styles.backButton}
                  textProps={styles.backButtonText} >
        </TruliaIcon>

      <View style={styles.customPageTitle}>
        <Text style={styles.customPageTitleText}>
          {this.props.chat.partner.fullName}
        </Text>
        <Text style={styles.customPageTitleNote}>
           Đang trực tuyến
        </Text>
      </View>

    </View>
    )
  }

  _onBack() {
    Actions.pop();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);

var styles = StyleSheet.create({
  container: {
      top: 0,
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      backgroundColor: gui.mainColor,
      height: 62
  },
  search: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  left: {
      marginTop: 16,
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: gui.mainColor
  },
  customPageTitleText: {
    color: 'white',
    fontSize: gui.normalFontSize,
    fontWeight: '600',
    fontFamily: gui.fontFamily,
    textAlign: 'center'
  },
  customPageTitleNote: {
     color: 'white',
     fontSize: 12,
     fontFamily: gui.fontFamily,
     textAlign: 'center'
  },

  customPageTitle: {
    left:70,
    right:70,
    marginTop: 18,
    position: 'absolute',
    flexDirection: 'column'
  },
  backButton: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 18,
    paddingRight: 18
  }

});
