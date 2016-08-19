'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {
    Text, View, Image, ListView, Dimensions, StatusBar
    , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
    , Alert
} from 'react-native'

import {Actions} from 'react-native-router-flux';

import SearchResultFooter from '../components/SearchResultFooter';

import SearchHeader from '../components/SearchHeader';

import gui from '../lib/gui';

import {MenuContext} from '../components/menu';

import log from '../lib/logUtil';
import findApi from '../lib/FindApi';

import AdsListView from '../components/search/AdsListView';


const actions = [
  globalActions,
  authActions,
  searchActions
];

function mapStateToProps(state) {
    let currentUser = state.global.currentUser;

    return {
        listAds: state.search.result.listAds,
        loading: state.search.loadingFromServer,
        errorMsg: state.search.result.errorMsg,
        adsLikes: currentUser && currentUser.adsLikes,
        loggedIn: state.global.loggedIn,
        userID: currentUser && currentUser.userID,
        fields : state.search.form.fields
    };
}

function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

class SearchResultList extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
    }

    render() {
        log.info("Call SearchResultList render");
        //log.info(this.props);
        return (
            <MenuContext style={{ flex : 1 }}>
            <View style={myStyles.fullWidthContainer}>
                <View style={myStyles.search}>
                    <SearchHeader placeName={this.props.fields.place.fullName}/>
                </View>

                <AdsListView {...this.props} />

                <SearchResultFooter place = {this.props.fields.place}
                                    loggedIn = {this.props.loggedIn}
                                    saveSearch = {this.props.actions.saveSearch}
                                    query = {findApi.convertFieldsToQueryParams(this.props.fields)}
                                    userID = {this.props.userID}
                />
            </View>
            </MenuContext>
        )
    }
}


// Later on in your styles..
var myStyles = StyleSheet.create({
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    search: {
        backgroundColor: gui.mainColor,
        height: 34
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
