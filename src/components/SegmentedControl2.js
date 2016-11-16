import React, {Component} from 'react';
import {View, Text, StyleSheet, SegmentedControlIOS, TextInput, Dimensions} from 'react-native';

import gui from '../lib/gui';

// Create our component
var SegmentedControl2 = React.createClass({
    render() {
        return (
            <View style={[myStyles.searchFilterAttributeExt, {flexDirection: "column"}]}>
                <View style={{paddingBottom: 4, paddingTop: 3}}>
                    <Text style={myStyles.searchAttributeLabel}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={{paddingLeft: 0, paddingRight: 6, paddingBottom: 9, flexDirection: "row"}}>
                    <SegmentedControlIOS
                        values={this.props.values}
                        selectedIndex={this.props.selectedIndexAttribute}
                        onChange={this.props.onChange}
                        tintColor={gui.mainColor} height={28} width={Dimensions.get('window').width-117}
                    >
                    </SegmentedControlIOS>
                    <TextInput
                        secureTextEntry={false}
                        keyboardType={'numeric'}
                        style={myStyles.input}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={gui.mainColor}
                        value={this.props.textValue}
                        onChangeText={(text) => this.props.onTextChange(this.props.textField, text)}
                    />
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
        borderTopWidth: 0.5,
        marginLeft: 17,
        borderTopColor: gui.separatorLine
    },
    searchAttributeLabel: {
        fontSize: gui.normalFontSize,
        fontFamily: 'Open Sans',
        color: 'black'
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        paddingRight: 10,
        marginLeft:10,
        height: 28,
        borderColor: gui.mainColor,
        borderWidth: 1,
        borderRadius: 5,
        width: 68,
        textAlign: 'right',
        alignSelf: 'center'
    }
});

// Make this code available elsewhere
module.exports = SegmentedControl2;
