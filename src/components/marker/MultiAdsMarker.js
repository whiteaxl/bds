import React, {Component} from 'react';

var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
}  = require('react-native');

class MultiAdsMarker extends React.Component {
    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

module.exports = MultiAdsMarker;