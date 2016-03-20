// Import some code we need
import React, {View, Component, Text} from 'react-native';
import Button from 'react-native-button';

import styles from './styles';

import {Actions} from 'react-native-router-flux';

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={styles.searchButton}>
      <View style={styles.searchListButton}>
        <Button onPress={this.onSort}
          style={styles.searchListButtonText}>Sắp xếp</Button>
        <Button onPress={this.onSaveSearch}
          style={styles.searchListButtonText}>Lưu tìm kiếm</Button>
        <Button onPress={this.onMap}
          style={styles.searchListButtonText}>Bản đồ</Button>
      </View>
    </View>
  },
  onSort() {
    Actions.OrderPicker();
  },
  onSaveSearch() {
    console.log("On Save Search pressed!");
  },
  onMap() {
    Actions.SearchResultMap();
  }
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
