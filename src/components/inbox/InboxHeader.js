import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

// Create our component
export default class InboxHeader extends Component {
  coming() {
    Alert.alert("Coming soon...");
  }

  onArchive() {
    this.coming();
  }

  render() {
    return (
    <View style={styles.container}>

      <View style={styles.left}>
        <TouchableOpacity onPress={() => this.coming()}>
        <Text style={[styles.customPageTitleText, {fontWeight: 'normal'}]}>
          Lưu trữ
        </Text>
        </TouchableOpacity>
      </View>


      <View style={styles.customPageTitle}>
        <Text style={styles.customPageTitleText}>
          Chat
        </Text>
      </View>
      <View style={styles.search}>
        <TruliaIcon onPress={this._onSearch}
          name="search" color="white" size={18}
          mainProps={{paddingLeft: 16, paddingRight: 16}}
          >
        </TruliaIcon>
      </View>
    </View>
    )
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
  }
});
