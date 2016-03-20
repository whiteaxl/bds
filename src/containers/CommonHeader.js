// Import some code we need
import React, {View, Component, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

import {Actions} from 'react-native-router-flux';

// Create our component
var CommonHeader = React.createClass({
  render: function() {
    return <View style={styles.customPageHeader}>
      <Icon.Button onPress={this._onBack}
        name="chevron-left" backgroundColor="#f44336"
        underlayColor="gray"
        style={styles.search} >
      </Icon.Button>
      <View style={styles.customPageTitle}>
        <Text style={styles.customPageTitleText}>
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
