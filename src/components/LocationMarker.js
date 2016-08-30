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
        this.state = {
            color: gui.mainColor
        }
    }

    render() {
        let {iconName, size, animation} = this.props;
        let color = this.state.color;
        if (animation) {
            let newColor = color == '#f0a401' ? gui.mainColor: '#f0a401';
            setTimeout(() => this.setState({color: newColor}), 1000);
        }
        return (
            <View style={styles.container}>
                <RelandIcon name={iconName||"home-marker"} size={size||40} color={color} mainProps={styles.markerIcon}/>
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
