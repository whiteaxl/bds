'use strict';
import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import gui from '../lib/gui';


var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'inbox':'1','camera': 59396,'camera-o': 59397,'map':59392, 'sort': 59398, 'save' : 59399, 'share-o': 59400, 'share': 59401,
                'phone-o': 59402, 'phone': 59403, 'more': 59404, 'down': 59405, 'left': 59406, 'right': 59407, 'up': 59408,
                'chat': 59409, 'email': 59410, 'home': 59411, 'dot': 59412, 'search': 59413, 'zalo': 59414, 'sort-alt': 59415,
                'facebook-o': 59416, 'facebook': 59417, 'google': 59418, 'google-alt': 59419, 'skype-o': 59420, 'skype': 59421,
                'twitter-o': 59422, 'twitter': 59423, 'sms': 59424, 'location-o': 59425, 'location': 59426, 'close': 59427,
                'home-marker': 59428, 'close-circle': 59429, 'list':59430, 'me':59431, 'mgmt':59432, 'plus':59433, 'photos':59434,
                'update' : 59435, 'home-f' : 59436, 'search-b' : 59437, 'local-info': 59438, 'plus-circle': 59439, 'street-view': 59440,
                'copy-link': 59441, 'alert': 59442, 'refresh': 59443, 'previous': 59444, 'next': 59445, 'loc-map': 59446, 'direction': 59447,
                'cur-pos': 59448, 'hand-o-up': 59449, 'location-alt': 59450, 'alert-f': 59451, 'close-circle-f': 59452};
var Icon = createIconSet(glyphMap, 'RelandIcon');

class RelandIconButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var {touchableProps, iconProps, textProps, mainProps, text, color, name,size, noAction} = this.props;
        if (!noAction) {
            return(
                <TouchableHighlight underlayColor='transparent' style={[styles.touchable]} onPress={this.props.onPress}>
                    <View style={[styles.container, mainProps]} >
                        <Icon color={color||gui.mainColor} name={name} size={size||22} {...iconProps} />
                        <Text style={[styles.text, textProps]}>
                            {text}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        }
        return(
            <View style={[styles.container, mainProps]} >
                <Icon color={color||gui.mainColor} name={name} size={size||22} {...iconProps} />
                <Text style={[styles.text, textProps]}>
                    {text}
                </Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0
    },
    touchable: {
        overflow: 'hidden',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize:16
        , fontFamily:gui.fontFamily
        , color:gui.mainColor
        , fontWeight: '600',
        backgroundColor: 'transparent',
        paddingLeft: 10
    },
});

RelandIconButton.Icon = Icon;


export default RelandIconButton;

