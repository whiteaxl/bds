// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Actions} from 'react-native-router-flux';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={myStyles.customPageHeader}>
      <Icon.Button onPress={this._onBack}
        name="chevron-left" backgroundColor="#f44336"
        underlayColor="gray"
        style={myStyles.search} >
      </Icon.Button>
      <View style={myStyles.customPageTitle}>
        <Text style={myStyles.customPageTitleText}>
        {this.props.headerTitle}
        </Text>
      </View>
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
      justifyContent: 'space-between',
      backgroundColor: '#f44336',
  },
  customPageTitle: {
      marginTop: 35,
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 10,
      alignItems: 'stretch',
  },
  customPageTitleText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  search: {
      marginTop: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f44336',
  },
});