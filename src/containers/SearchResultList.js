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

import * as Animatable from 'react-native-animatable';


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
        counting: state.search.countingFromServer,
        errorMsg: state.search.result.errorMsg,
        adsLikes: currentUser && currentUser.adsLikes,
        loggedIn: state.global.loggedIn,
        userID: currentUser && currentUser.userID,
        fields : state.search.form.fields,
        showMessage: state.search.showMessage,
        countResult: state.search.countResult
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
        this.state = {
            messageDone: false
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        log.info("Call SearchResultList render");
        //log.info(this.props);
        if (this.props.showMessage && !this.state.messageDone) {
            this.state.messageDone = true;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {this.state.messageDone = false; this.props.actions.onShowMsgChange(false)}, 5000);
        }
        return (
            <MenuContext style={{ flex : 1 }}>
            <View style={myStyles.fullWidthContainer}>
                <View style={myStyles.search}>
                    <SearchHeader placeName={this.props.fields.place.fullName}/>
                </View>

                <AdsListView {...this.props} />

                {this._renderTotalResultView()}

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

    _renderTotalResultView(){
        let {listAds, loading, counting, showMessage, fields} = this.props;
        let numberOfAds = listAds.length;
        let pageNo = fields.pageNo;
        let limit = fields.limit;
        if(loading || counting){
            return (<View style={myStyles.resultContainer}>
                <Animatable.View animation={showMessage ? "fadeIn" : "fadeOut"}
                                 duration={showMessage ? 500 : 1000}>
                    <View style={[myStyles.resultText]}>
                        <Text style={myStyles.resultIcon}>  Đang tải dữ liệu ... </Text>
                    </View>
                </Animatable.View>
            </View>)
        }

        return (<View style={myStyles.resultContainer}>
            <Animatable.View animation={showMessage ? "fadeIn" : "fadeOut"}
                             duration={showMessage ? 500 : 1000}>
                <View style={[myStyles.resultText]}>
                    <Text style={myStyles.resultIcon}>  {(pageNo-1)*limit+1}-{(pageNo-1)*limit+numberOfAds} / {this.props.countResult} tin tìm thấy được hiển thị </Text>
                </View>
            </Animatable.View>
        </View>)
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
    },
    resultContainer: {
        position: 'absolute',
        top: 64,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginVertical: 0,
        marginBottom: 0,
        backgroundColor: 'transparent',
    },
    resultText: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 0.85
    },
    resultIcon: {
        color: 'black',
        fontSize: gui.capitalizeFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal',
        textAlign: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
