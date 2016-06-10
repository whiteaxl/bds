import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

export default class ChatHeader extends Component {
  coming() {
    Alert.alert("Coming soon...");
  }

  onArchive() {
    this.coming();
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
          {this.props.partner.fullName}
        </Text>
      </View>

    </View>
    )
  }

  _onBack() {
    Actions.pop();
  }

  _onSearch(){
    Actions.Search({needBack:false});
  }
}

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
  customPageTitle: {
    left:70,
    right:70,
    marginTop: 28,
    position: 'absolute'
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
