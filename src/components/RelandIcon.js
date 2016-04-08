'use strict';
import React, {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import gui from '../lib/gui';


var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'inbox':'1','camera': 59397,'map':59392, 'sort': 59398, 'save' : 59399};
var Icon = createIconSet(glyphMap, 'RelandIcon');

class RelandIconButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {touchableProps, iconProps, textProps, text, name,size} = this.props;
        return(
        <TouchableHighlight underlayColor='transparent' style={[styles.touchable]} onPress={this.props.onPress}>
            <View style={[styles.container]} >
                <Icon color={gui.mainColor} name={name} size={size||22} {...iconProps} />
                <Text style={[styles.text, textProps]}>
                    {text}
                </Text>
            </View>
        </TouchableHighlight>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 12,
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



export default RelandIconButton;

