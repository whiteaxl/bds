'use strict';
import React, {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import gui from '../lib/gui';


var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'inbox':'1','camera': 59397,'map':59392, 'sort': 59398, 'save' : 59399, 'share-o': 59400, 'phone-o': 59402,
                'more': 59404, 'chat': 59409, 'email': 59410, 'home': 59411, 'dot': 59412, 'search': 59413, 'zalo': 59414,
                'sort-alt': 59415};
var Icon = createIconSet(glyphMap, 'RelandIcon');

class RelandIconButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var {touchableProps, iconProps, textProps, text, color, name,size, noAction} = this.props;
        if (!noAction) {
            return(
                <TouchableHighlight underlayColor='transparent' style={[styles.touchable]} onPress={this.props.onPress}>
                    <View style={[styles.container]} >
                        <Icon color={color||gui.mainColor} name={name} size={size||22} {...iconProps} />
                        <Text style={[styles.text, textProps]}>
                            {text}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        }
        return(
            <View style={[styles.container]} >
                <Icon color={gui.mainColor} name={name} size={size||22} {...iconProps} />
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



export default RelandIconButton;

