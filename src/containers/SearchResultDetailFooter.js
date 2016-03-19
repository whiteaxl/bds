// Import some code we need
import React, {View, Component, Text} from 'react-native';
import Button from 'react-native-button';

import styles from './styles';

import {Actions} from 'react-native-router-flux';

// Create our component
var SearchResultDetailFooter = React.createClass({
  render: function() {
    return <View style={styles.searchButton}>
      <View style={styles.searchListButton}>
        <Button onPress={this.onSave}
          style={styles.searchListButtonText}>Lưu lại</Button>
        <Button onPress={this.onChat}
          style={styles.searchListButtonText}>Trò chuyện</Button>
        <Button onPress={this.onComment}
          style={styles.searchListButtonText}>Chú thích</Button>
      </View>
    </View>
  },
  onSave() {
    console.log("On Save pressed!");
  },
  onChat() {
    console.log("On Chat pressed!");
  },
  onComment() {
    console.log("On Comment pressed!");
  }
});

// Make this code available elsewhere
module.exports = SearchResultDetailFooter;
