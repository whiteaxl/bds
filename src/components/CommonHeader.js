// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TruliaIcon from './TruliaIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={myStyles.customPageHeader}>
      <View style={myStyles.customPageTitle}>
        <Text style={myStyles.customPageTitleText}>
        {this.props.headerTitle}
        </Text>
      </View>
      <TruliaIcon onPress={this._onBack}
                name="arrow-left" color={gui.mainColor} size={25}
                mainProps={myStyles.backButton} text={this.props.backTitle}
                textProps={myStyles.backButtonText} >
      </TruliaIcon>
    </View>
  },
  _onBack: function() {
    Actions.pop();
  }
});

// Make this code available elsewhere
module.exports = CommonHeader;

var myStyles = StyleSheet.create({
customPageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: 'transparent',
      height: 60
  },
  customPageTitle: {
      left:36,
      right:36,
      marginTop: 31,
      marginBottom: 10,
      position: 'absolute'
  },
  customPageTitleText: {
      color: 'black',
      fontSize: gui.normalFontSize,
      fontWeight: 'bold',
      fontFamily: gui.fontFamily,
      textAlign: 'center'
  },
  backButton: {
      marginTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingLeft: 18,
      paddingRight: 18
  },
  backButtonText: {
      color: gui.mainColor,
      fontSize: gui.normalFontSize,
      fontFamily: gui.fontFamily,
      textAlign: 'left',
      marginLeft: 7
  }
});
