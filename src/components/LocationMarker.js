import React, {Component} from 'react';

var {
    StyleSheet,
    View,
} = require('react-native');

import gui from '../lib/gui';
import RelandIcon from './RelandIcon';

var currentColor = gui.mainColor;

class LocationMarker extends React.Component{

    constructor(){
        super();
        this.state = {
            color: gui.mainColor
        }
    }

    componentDidMount() {
        this.timer = setTimeout(() => this.setState({color: '#f0a401'}), 500);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        let {iconName, size, animation} = this.props;
        let color = this.state.color;
        if (animation && color != currentColor) {
            currentColor = color;
            clearTimeout(this.timer);
            let newColor = color == '#f0a401' ? gui.mainColor: '#f0a401';
            this.timer = setTimeout(() => this.setState({color: newColor}), 500);
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
