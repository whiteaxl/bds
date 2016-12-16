// Import some code we need
import React, {Component} from 'react';

import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';

import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import gui from '../../lib/gui';

// Create our component
var HomeHeader = React.createClass({
    render: function() {
        let logoIcon = require('../../assets/image/logo.png');
        let locationIcon = require('../../assets/image/location.png');
        return (
            <View style={mStyles.pageHeader}>
                <View style={mStyles.searchButton}>
                    <TruliaIcon onPress={() => this.handleSearchButton()}
                                name="search" color="white" size={20}
                                mainProps={{paddingLeft: 18, paddingRight: 21}}
                    >
                    </TruliaIcon>
                </View>
                <View style={mStyles.home}>
                    <Image
                        style={mStyles.logoIcon}
                        resizeMode={Image.resizeMode.cover}
                        source={logoIcon}
                    />
                </View>
                <View style={mStyles.home}>
                    <RelandIcon
                        name="map-view" color="white" size={26} onPress={() => this._onMapView()}
                        mainProps={{marginTop: 17, paddingLeft: 18, paddingRight: 21}}
                    >
                    </RelandIcon>
                    {/*<TouchableOpacity onPress={() => this._onMapView()} underlayColor="transparent">
                     <Image
                     style={mStyles.locationIcon}
                     resizeMode={Image.resizeMode.cover}
                     source={locationIcon}
                     />
                     </TouchableOpacity>*/}
                </View>
            </View>
        );
    },

    _onMapView: function() {
        Actions.SearchResultMap({type: "reset"});
    },

    handleSearchButton: function(){
        Actions.Search({owner: 'home'});
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
    locationIcon: {
        height: 27,
        width: 16,
        marginTop: 0,
        marginLeft: 18,
        paddingRight: 16
    },
    logoIcon: {
        height: 21,
        width: 87,
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
