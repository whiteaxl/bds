import React, {Component} from 'react';
import {View, Text, StyleSheet, SegmentedControlIOS} from 'react-native';

import gui from '../lib/gui';

// Create our component
var SegmentedControl = React.createClass({
    render() {
        return (
            <View style={[myStyles.searchFilterAttributeExt, {flexDirection: "column"}]}>
                <View style={{paddingBottom: 4, paddingTop: 3}}>
                    <Text style={myStyles.searchAttributeLabel}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={{paddingLeft: 0, paddingRight: 6, paddingBottom: 9}}>
                    <SegmentedControlIOS
                        values={this.props.values}
                        selectedIndex={this.props.selectedIndexAttribute}
                        onChange={this.props.onChange}
                        tintColor={gui.mainColor} height={28}
                    >
                    </SegmentedControlIOS>
                </View>
            </View>
        );
    }
});

// Later on in your styles..
var myStyles = StyleSheet.create({
    searchFilterAttributeExt: {
        flexDirection : "row",
        //borderWidth:1,
        //borderColor: "red",
        justifyContent :'space-between',
        paddingRight: 8,
        paddingTop: 5,
        paddingLeft: 0,
        paddingBottom: 8,
        borderTopWidth: 1,
        marginLeft: 17,
        borderTopColor: gui.separatorLine
    },
    searchAttributeLabel: {
        fontSize: gui.normalFontSize,
        fontFamily: 'Open Sans',
        color: 'black'
    }
});

// Make this code available elsewhere
module.exports = SegmentedControl;
