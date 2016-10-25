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

import SearchResultFooter from '../components/searchList/SearchResultFooter';

import SearchHeader from '../components/searchList/SearchHeader';

import gui from '../lib/gui';

import {MenuContext} from '../components/menu';

import log from '../lib/logUtil';
import findApi from '../lib/FindApi';

import AdsListView from '../components/search/AdsListView';

import * as Animatable from 'react-native-animatable';

import GiftedSpinner from "../components/GiftedSpinner";

import cfg from "../cfg";

const noCoverUrl = cfg.noCoverUrl;

const actions = [
  globalActions,
  authActions,
  searchActions
];

function mapStateToProps(state) {
    let currentUser = state.global.currentUser;

    return {
        listAds: state.search.result.listAds,
        allAdsItems: state.search.result.allAdsItems,
        loading: state.search.loadingFromServer,
        errorMsg: state.search.result.errorMsg,
        adsLikes: currentUser && currentUser.adsLikes,
        loggedIn: state.global.loggedIn,
        userID: currentUser && currentUser.userID,
        fields : state.search.form.fields,
        totalCount: state.search.result.totalCount,
        polygons: state.search.map.polygons,
        listScrollPos: state.search.listScrollPos
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

class SearchResultListExt extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        let firstTimeFromMap = props.firstTimeFromMap;
        this.state = {
            showMessage: false,
            firstTimeFromMap: firstTimeFromMap
        };
    }

    componentDidMount() {
        // this._onShowMessage();
        // this._initScrollPos();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    _getHeaderTitle() {
        let diaChinh = this.props.fields.diaChinh;

        //1. Search by diaChinh, then name = diaChinh's name
        if (this.props.polygons && this.props.polygons.length) {
            //placeName = `[${r.latitude}, ${r.longitude}]`
            return 'Trong khu vực vẽ tay';
        }

        if (this.props.fields.center && Object.keys(this.props.fields.center).length > 0) {
            return 'Xung quanh vị trí hiện tại';
        }

        let placeName;
        //2. Search by Polygon: name is just center
        if (diaChinh.tinhKhongDau) {
            placeName = diaChinh.fullName;
        } else { //others: banKinh or currentLocation
            //let geoBox = apiUtils.getBbox(r);
            //placeName = geoBox.toString()
            placeName = 'Tìm tất cả theo khung nhìn'
        }

        return placeName;
    }
    _onShowMessage() {
        this.setState({showMessage: true, firstTimeFromMap: false});
        this._onSetupMessageTimeout();
    }
    _onSetupMessageTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {this.setState({showMessage: false})}, 10000);
    }
    render() {
        log.info("Call SearchResultList render", this.props.fields);
        //log.info(this.props);
        let placeName = this._getHeaderTitle();
        return (
            <MenuContext style={{ flex : 1 }}>
            <View style={myStyles.fullWidthContainer}>
                <View style={myStyles.search}>
                    <SearchHeader placeName={placeName} onShowMessage={() => this._onShowMessage()}
                                  refreshRegion={() => this.props.actions.onChangeListScrollPos(0)}
                                  owner={'list'}
                    />
                </View>

                <View style={{marginTop: 30, height: Dimensions.get('window').height - 64}}>
                    <AdsListView ref={(adsListView) => { this._adsListView = adsListView; }}
                        {...this.props} noCoverUrl={noCoverUrl} />
                </View>

                {this._renderTotalResultView()}

            </View>
            </MenuContext>
        )
    }

    _scrollToTop() {
        if (this._adsListView) {
            this._adsListView._scrollToTop();
            this.setState({firstTimeFromMap: true});
            this.props.actions.onChangeListScrollPos(0);
        }
    }

    _initScrollPos() {
        if (this._adsListView) {
            this._adsListView._scrollTo(this.props.listScrollPos);
        }
    }

    _isHeaderLoading() {
        let {loading, allAdsItems} = this.props;
        return loading && allAdsItems.length > 0;
    }

    _renderTotalResultView(){
        let {loading, allAdsItems} = this.props;
        let {showMessage, firstTimeFromMap} = this.state;
        let numberOfAds = allAdsItems.length;
        let totalCount = this.props.totalCount;
        let rangeAds = totalCount > 0 ? totalCount : numberOfAds;
        let textValue = "Tìm thấy " + rangeAds + " kết quả phù hợp";
        if (numberOfAds == 0) {
            // textValue = "Không tìm thấy kết quả nào. Hãy thay đổi điều kiện tìm kiếm";
            textValue = "";
        }
        
        if(loading || firstTimeFromMap){
            return (<View style={myStyles.resultContainer}>
                {/*<Animatable.View animation={showMessage ? "fadeIn" : "fadeOut"}
                                 duration={showMessage ? 500 : 1000}>
                    <View style={[myStyles.resultText]}>
                        <Text style={myStyles.resultIcon}>  Đang tải dữ liệu ... </Text>
                    </View>
                </Animatable.View>*/}
                <View style={myStyles.loadingContent}>
                    {this._isHeaderLoading() ? <GiftedSpinner color="white" /> : null}
                </View>
            </View>)
        }

        return (<View style={myStyles.resultContainer}>
            <Animatable.View animation={showMessage ? "fadeIn" : "fadeOut"}
                             duration={showMessage ? 500 : 3000}>
                <View style={[myStyles.resultText]}>
                    <Text style={myStyles.resultIcon}>  {textValue} </Text>
                </View>
            </Animatable.View>
        </View>)
    }
}


// Later on in your styles..
var myStyles = StyleSheet.create({
    loadingContent: {
        position: 'absolute',
        top: -22,
        left: 65,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    searchButton: {
        position: 'absolute',
        top: Dimensions.get('window').height-44,
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: 1,
        borderColor : 'lightgray'
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultListExt);