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
import DanhMuc from '../assets/DanhMuc';

import MultipleChoice from './MultipleChoice';

import gui from '../lib/gui';

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

var huongNhaValues = DanhMuc.getHuongNhaValues();

class MHuongNha extends Component {
    constructor(props) {
        super();

        var {func, search, postAds} = props;
        var huongNhaKey = (func == 'postAds') ? postAds.huongNha : search.form.fields.huongNha;

        var huongNha = this.getValueByKey(huongNhaValues, huongNhaKey);
        if (!huongNha) {
            huongNha = huongNhaValues[0];
        }
        this.state = {
            huongNha: huongNha
        };
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Hướng nhà"} />
                <View style={myStyles.headerSeparator} />

                <MultipleChoice
                    options={huongNhaValues}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.huongNha]}
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
        var {func} = this.props;

        var huongNha = this.getKeyByValue(huongNhaValues, option);

        if (func == 'postAds') {
            this.props.actions.onPostAdsFieldChange("huongNha", huongNha);
        } else{
            this.props.actions.onSearchFieldChange("huongNha", huongNha);
        }

        Actions.pop();
    }

    getValueByKey(values, key) {
        var value = '';
        for (var i = 0; i < DanhMuc.HuongNhaKey.length; i++) {
            var loaiKey = DanhMuc.HuongNhaKey[i];
            if (key === loaiKey) {
                value = values[i];
                break;
            }
        }
        //console.log(value);
        return value;
    }

    getKeyByValue(values, value) {
        var key = '';
        for (var i = 0; i < values.length; i++) {
            var oneValue = values[i];
            if (value === oneValue) {
                key = DanhMuc.HuongNhaKey[i];
                break;
            }
        }
        //console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(MHuongNha);



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

