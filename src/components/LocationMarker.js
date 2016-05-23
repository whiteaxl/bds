import React, {Component} from 'react';

var {
    StyleSheet,
    View,
} = require('react-native');

import gui from '../lib/gui';
import RelandIcon from './RelandIcon';

class LocationMarker extends React.Component{
    constructor(){
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                <RelandIcon name={"home-marker"} size={40} color={gui.mainColor} mainProps={styles.markerIcon}/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    markerIcon: {
        backgroundColor: 'transparent'
    }
});

module.exports = LocationMarker;
