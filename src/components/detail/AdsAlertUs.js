'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, SegmentedControlIOS, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../../components/CommonHeader';
import DanhMuc from '../../assets/DanhMuc';

import MultipleChoice from '../MultipleChoice';

import gui from '../../lib/gui';

/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions,
    searchActions,
    postAdsActions
];

function mapStateToProps(state) {
    return {
        ...state,
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

class AdsAlertUs extends Component {
    constructor(props) {
        super(props);
        var alertUsVal = this.getAdsAlertUsVal();
        this.state = {
            alertUs: alertUsVal
        };
    }

    setAlertUs(option) {
        this.props.actions.onAlertUsChange(option);
    }

    getAdsAlertUsVal() {
        var alertUsVal = this.props.search.alertUs;
        var adsAlertUsValues = DanhMuc.getAdsAlertUsValues();
        if (!alertUsVal) {
            alertUsVal = adsAlertUsValues[0];
        }
        return alertUsVal;
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Thông báo cho chúng tôi"} />
                <View style={myStyles.headerSeparator} />

                <MultipleChoice
                    options={DanhMuc.getAdsAlertUsValues()}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.alertUs]}
                    maxSelectedOptions={1}
                    onSelection={(option)=>this._onApply(option)}
                />
            </View>
        );
    }

    _onBack() {
        Actions.pop();
    }

    _onApply(option) {
        this.setAlertUs(option);
        Actions.pop();
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(AdsAlertUs);



// Later on in your styles..
var myStyles = StyleSheet.create({
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    choiceList: {
        paddingTop: 10,
        paddingLeft: 26,
        paddingRight: 0
    },
    searchButton: {
        alignItems: 'stretch',
        justifyContent: 'flex-end'
    },
    searchButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: gui.mainColor,
        height: 44
    },
    searchButtonText: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    }
});

