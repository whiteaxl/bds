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
            <View style={mainProps||styles.heartContent}>
                <View style={styles.heartContent2}>
                    <TruliaIcon name="heart" mainProps={styles.heartButton1}
                                color={bgColor||'#4A443F'} size={size||22}
                                noAction={noAction}
                                onPress={onPress}/>
                </View>
                <TruliaIcon name="heart-o" mainProps={styles.heartButton2}
                            color={color||'white'} size={size||22}
                            noAction={noAction}
                            onPress={onPress}/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    heartContent: {
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
