import React, {Component} from 'react';

import TruliaIcon from '../components/TruliaIcon';

var {
    StyleSheet,
    View
} = require('react-native');

class MHeartIcon extends React.Component{
    constructor(){
        super();
    }

    render() {
        return (
            <View style={styles.heartContent}>
                <TruliaIcon name="heart-o" mainProps={styles.heartButton1}
                            color={'white'} size={22}/>
                <TruliaIcon name="heart" mainProps={styles.heartButton2}
                            color={'lightgray'} size={22}/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    heartContent: {
        alignSelf: 'auto'
    },
    heartButton1: {
        marginTop: 5,
        marginLeft: 30
    },
    heartButton2: {
        marginTop: 5,
        marginLeft: 30
    }
});

module.exports = MHeartIcon;
