import React, {Component} from 'react';

var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight
}  = require('react-native');

import gui from '../lib/gui';
import TruliaIcon from './TruliaIcon';

class DirectionMarker extends React.Component{
    constructor(){
        super();
    }

    getDiaChi(){
        var diaChi = this.props.diaChi;
        if (diaChi) {
            var maxDiaChiLength = 30;
            if (diaChi.length > maxDiaChiLength) {
                diaChi = diaChi.substring(0, maxDiaChiLength-2) + '...';
            }
        }
        return diaChi;
    }

    render() {
        var diaChi = this.getDiaChi();
        return (
            <View>
                <TouchableHighlight underlayColor='transparent' style={[styles.touchable]} onPress={this.props.onPress}>
                    <View style={styles.container}>
                        <View style={styles.bubble}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={[styles.diaChi, { marginTop: 6, fontSize: this.props.fontSize }]}>{diaChi} </Text>
                                <Text style={[styles.diaChi, {marginBottom: 6}]}>Dẫn đường</Text>
                            </View>
                            <View style={{margin: 0}}>
                                <TruliaIcon name={"car"} size={32} color={"white"} mainProps={styles.carIcon}/>
                            </View>
                        </View>
                        <View style={[styles.arrowBorder,{borderTopColor: 'lightgray'}]} />
                        <View style={[styles.arrow, {borderTopColor: 'white'}]} />
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start'
    },
    touchable: {
        overflow: 'hidden'
    },
    bubble: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 10,
        borderColor: 'lightgray',
        borderWidth: 0.5
    },
    unit: {
        color: '#FFFFFF',
        fontSize: 11
    },
    diaChi: {
        color: gui.mainColor,
        fontFamily: gui.fontFamily,
        fontWeight: 'normal',
        fontSize: 14,
        marginLeft: 15,
        marginRight: 10
    },
    carIcon: {
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: gui.mainColor
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 14,
        borderColor: 'transparent',
        borderTopColor: 'white',
        alignSelf: 'center',
        marginTop: -29
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 14,
        borderColor: 'transparent',
        borderTopColor: 'lightgray',
        alignSelf: 'center',
        marginTop: -0.5
    }
});

module.exports = DirectionMarker;
