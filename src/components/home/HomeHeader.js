// Import some code we need
import React, {Component} from 'react';

import {View, Image, StyleSheet} from 'react-native';

import {Actions} from 'react-native-router-flux';

import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import gui from '../../lib/gui';

// Create our component
var HomeHeader = React.createClass({
    render: function() {
        let logoIcon = require('../../assets/image/logo.png');
        return (
            <View style={mStyles.pageHeader}>
                <View style={mStyles.home}>
                    <RelandIcon
                        name="loc-map" color="white" size={24} onPress={() => this._onMapView()}
                        mainProps={{marginTop: 17, paddingLeft: 18, paddingRight: 16}}
                    >
                    </RelandIcon>
                </View>
                <View style={mStyles.home}>
                    <Image
                        style={mStyles.logoIcon}
                        resizeMode={Image.resizeMode.cover}
                        source={logoIcon}
                    />
                </View>
                <View style={mStyles.searchButton}>
                    <TruliaIcon onPress={() => this.handleSearchButton()}
                                name="search" color="white" size={20}
                                mainProps={{paddingLeft: 16, paddingRight: 21}}
                    >
                    </TruliaIcon>
                </View>
            </View>
        );
    },

    _onMapView: function() {
        Actions.SearchResultMap({type: "reset"});
    },

    handleSearchButton: function(){
        Actions.Search();
    }
});

// Make this code available elsewhere
module.exports = HomeHeader;

var mStyles = StyleSheet.create({
    searchButton: {
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gui.mainColor
    },
    logoIcon: {
        height: 21,
        width: 99,
        marginTop: 0,
        marginLeft: 19,
        marginRight: 16
    },
    home: {
        paddingTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gui.mainColor
    },
    pageHeader: {
        top: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        backgroundColor: gui.mainColor,
        height: 64
    }
});
