'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as meActions from '../reducers/me/meActions';

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
    meActions
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

var moiGioiValues = DanhMuc.getMoiGioiValues();

class MoiGioi extends Component {
    constructor(props) {
        super();

        var moiGioiKey = props.me.profile.broker || 'U';

        var moiGioi = this.getValueByKey(moiGioiValues, moiGioiKey);

        this.state = {
            moiGioi: moiGioi
        };
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Môi giới"} />
                <View style={myStyles.headerSeparator} />

                <MultipleChoice
                    options={moiGioiValues}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.moiGioi]}
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
        var moiGioi = this.getKeyByValue(moiGioiValues, option);
        this.props.actions.onProfileFieldChange("broker", moiGioi);
        Actions.pop();
    }

    getValueByKey(values, key) {
        var value = '';
        for (var i = 0; i < DanhMuc.MoiGioiKey.length; i++) {
            var loaiKey = DanhMuc.MoiGioiKey[i];
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
                key = DanhMuc.MoiGioiKey[i];
                break;
            }
        }
        //console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(MoiGioi);



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

