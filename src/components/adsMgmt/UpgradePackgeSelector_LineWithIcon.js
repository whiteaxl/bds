import React, {Component} from 'react';
import {
  Text, View, Image, ListView, Dimensions, StatusBar
  , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
  , Alert, RefreshControl, ScrollView, TouchableOpacity
} from 'react-native'

import gui from '../../lib/gui';

import TruliaIcon from '../../components/TruliaIcon'
import {Actions} from 'react-native-router-flux';

export default class UpgradePackgeSelector_LineWithIcon extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.settingLine}>
          <View style = {styles.valueWithIcon}>
            <Image
              style={styles.avatarIcon}
              resizeMode={Image.resizeMode.contain}
              source={this.props.iconSource}
            />

            <Text style={[styles.lineLabel, {color:this.props.titleColor}]}>
              {this.props.title}
            </Text>
          </View>

          <View style = {styles.valueWithIcon}>
            <Text style={styles.lineValue}>
              {this.props.value}
            </Text>

            <View style={styles.rightIcon}>
              <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
            </View>
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
    backgroundColor : 'white',
    borderTopColor: '#e6e6e6',
    borderBottomColor: '#e6e6e6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent:"space-between",
  },

  lineLabel : {
    fontSize: 17,
    fontFamily: 'Open Sans',
    color: '#8A8A8A',
    fontWeight: '600',
    paddingLeft: 16,
    alignSelf: "center",
  },

  valueWithIcon : {
    flexDirection: "row",
  },

  lineValue : {
    fontSize: 17,
    fontFamily: 'Open Sans',
    color: "#8A8A8A",
    fontWeight: 'normal',
  },

  avatarIcon : {
    height: 30,
    width: 30,
  },

  rightIcon : {
    right : 1,
    flex : 1,
    alignSelf: "flex-end",
    paddingLeft: 8,
  }
});