'use strict';

var React = require('react');

var {
  View,
  ActivityIndicator
} = require('react-native');

export default class GiftedSpinner extends React.Component {

  _getSpinner() {
    return (
      <ActivityIndicator
        animating={true}
        size={this.props.size||"small"}
        {...this.props}
      />
    );
  }

  render() {
    return (
      <View>
        {this._getSpinner()}
      </View>
    );
  }

};
