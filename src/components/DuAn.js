'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../components/CommonHeader';

import MultipleChoice from './MultipleChoice';

import gui from '../lib/gui';

const khongThuocDuAn = 'Không thuộc dự án';

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

class DuAn extends Component {
    constructor(props) {
        super();

        var {duAnList, selectedDuAn} = props.postAds;

        var duAnOption = [];

        if (duAnList) {
            for (var i = 0; i < duAnList.length; i++) {
                duAnOption.push(duAnList[i].placeName);
            }
            duAnOption = duAnOption.sort();
            duAnOption.unshift(khongThuocDuAn);
        }

        var duAn = selectedDuAn ? selectedDuAn.placeName : khongThuocDuAn;

        this.state = {
            duAnOption: duAnOption,
            duAn: duAn
        };
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Dự án"} />
                <View style={myStyles.headerSeparator} />
                <MultipleChoice
                    options={this.state.duAnOption}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.duAn]}
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
        var {duAnList} = this.props.postAds;
        var duAn = null;
        for (var i=0; i< duAnList.length; i++){
            if( duAnList[i].placeName == option)
                duAn = duAnList[i];
        }

        this.props.actions.onPostAdsFieldChange("selectedDuAn", duAn);

        Actions.pop();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DuAn);

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

