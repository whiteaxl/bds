import React, {Component} from 'react';

import TruliaIcon from '../components/TruliaIcon';

var {
    StyleSheet,
    View
} = require('react-native');

class MHeartIcon extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        var {onPress, mainProps, color, bgColor, size, noAction} = this.props;
        return (
            <View style={styles.heartContent||mainProps}>
                <View style={styles.heartContent2}>
                    <TruliaIcon name="heart" mainProps={styles.heartButton1}
                                color={'#4A443F'||color} size={22||size}
                                noAction={noAction}
                                onPress={onPress}/>
                </View>
                <TruliaIcon name="heart-o" mainProps={styles.heartButton2}
                            color={'white'||bgColor} size={22||size}
                            noAction={noAction}
                            onPress={onPress}/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    heartContent: {
        marginTop: 5,
        marginLeft: 30,
        alignSelf: 'auto'
    },
    heartContent2: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    heartButton1: {
        opacity: 0.55
    },
    heartButton2: {
    }
});

module.exports = MHeartIcon;
