import React, {Component} from 'react';
import {
  Text, View, Image, ListView, Dimensions, StatusBar
  , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
  , Alert, RefreshControl, ScrollView, TouchableOpacity
} from 'react-native'

import gui from '../../lib/gui';

import TruliaIcon from '../../components/TruliaIcon'

export default class LineWithIcon extends Component {

  render() {
    return (
      <TouchableOpacity onPress={this.coming}>
        <View style={styles.settingLine}>
          <Image
            style={styles.avatarIcon}
            resizeMode={Image.resizeMode.contain}
            source={this.props.iconSource}
          />

          <Text style={styles.lineLabel}>
            {this.props.title}
          </Text>
          <View style={styles.rightIcon}>
            <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


var styles = StyleSheet.create({
  settingLine: {
    flexDirection : "row",
    flex: 1,
    paddingTop: 7,
    paddingLeft: 17,
    paddingRight: 19,
    paddingBottom: 7,
    alignItems:'center',
    backgroundColor : 'white'
  },

  lineLabel : {
    fontSize: 17,
    fontFamily: 'Open Sans',
    color: 'black',
    fontWeight: 'normal',
    paddingLeft: 16
  },

  avatarIcon : {
    height: 30,
    width: 30,
  },

  rightIcon : {
    right : 1,
    flex : 1,
    alignItems:"flex-end"
  }
});