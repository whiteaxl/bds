'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import Menu, { MenuOptions, MenuOption, MenuTrigger } from './menu';

import RelandIcon from './RelandIcon';

import MMenuOption from './MMenuOption';


const actions = [
    globalActions,
    searchActions
];

function mapStateToProps(state) {
    return {
        ...state
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

const orderTypes1 = [
    'Mặc định',
    'Ngày đăng',
    'Giá (Tăng dần)',
    'Giá (Giảm dần)',
    'Giá/m²',
    'Số phòng ngủ',
    'Diện tích'
];

const orderKeys1 = [
    '',
    'ngayDangTinDESC',
    'giaASC',
    'giaDESC',
    'giaM2DESC',
    'soPhongNguASC',
    'dienTichDESC'
];

const orderTypes2 = [
    'Mặc định',
    'Ngày đăng',
    'Giá (Tăng dần)',
    'Giá (Giảm dần)',
    'Giá/m²',
    'Số phòng ngủ',
    'Khoảng cách',
    'Diện tích'
];

const orderKeys2 = [
    '',
    'ngayDangTinDESC',
    'giaASC',
    'giaDESC',
    'giaM2DESC',
    'soPhongNguASC',
    'khoangCachDESC',
    'dienTichDESC'
];

class SortMenu extends Component {
    render() {
        console.log("Call SortMenu render");
        var {isDiaDiem} = this.props;
        var orderBy = this.getValueByKey(this.props.search.form.fields.orderBy, isDiaDiem);
        var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        if (!orderBy) {
            orderBy = orderTypes[0];
        }
        var optionList = [];
        for (var i = 0; i < orderTypes.length; i++) {
            var orderType = orderTypes[i];
            var isSelected = (this._getOrderKey(orderType) == this._getOrderKey(orderBy));
            var isLastRow = (i == orderTypes.length-1);
            var optionProps = (i == 0) ? {marginTop: 10} : (isLastRow ? {marginBottom: 10} : {});
            optionList.push(
                <MMenuOption text={orderType} isSelected={isSelected} isLastRow={isLastRow}
                             onPress={(orderType) => this._onApply(orderType)}
                             optionProps={optionProps}
                             key={orderType}
                />
            );
        }
        return (
            <View>
                <Menu onSelect={(option) => this._onApply(option)}>
                    <MenuTrigger>
                        <RelandIcon name="sort-alt" size={24} text="Sắp xếp" textProps={myStyles.sortText} noAction={true}/>
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={isDiaDiem ? myStyles.dropdownOptions : myStyles.dropdownOptions2}>
                        {optionList}
                    </MenuOptions>
                </Menu>
            </View>
        );
    }

    _onBack() {
        Actions.pop();
    }

    _getOrderKey(key) {
        return key.indexOf("DESC") !== -1 ? key.substring(0, key.length-4) :
            key.substring(0, key.length-3);
    }

    _getSortType(key) {
        return (key && key.indexOf("ASC") !== -1) ? "ASC" : "DESC";
    }

    _onApply(option) {
        var {isDiaDiem} = this.props;
        var oldOrderBy = this.props.search.form.fields.orderBy;
        var oldSortType = this._getSortType(oldOrderBy);
        var newOrderBy = this.getKeyByValue(option, isDiaDiem);
        if (this._getOrderKey(newOrderBy) == this._getOrderKey(oldOrderBy) &&
            (newOrderBy.indexOf("ngayDangTin") !== -1
            || newOrderBy.indexOf("giaM2") !== -1
            || newOrderBy.indexOf("soPhongNgu") !== -1
            || newOrderBy.indexOf("khoangCach") !== -1
            || newOrderBy.indexOf("dienTich") !== -1)) {
            newOrderBy = this._getOrderKey(newOrderBy);
            newOrderBy = (oldSortType == "ASC") ? newOrderBy + "DESC" : newOrderBy + "ASC";
        }
        this.props.actions.onSearchFieldChange("orderBy", newOrderBy);

        this.props.actions.search(
            this.props.search.form.fields
            , () => { }
        );
    }

    getValueByKey(key, isDiaDiem) {
        var findKey = this._getOrderKey(key);
        var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
        var value = '';
        for (var i = 0; i < orderKeys.length; i++) {
            var orderKey = orderKeys[i];
            orderKey = this._getOrderKey(orderKey);
            if (findKey == orderKey) {
                value = orderTypes[i];
                break;
            }
        }
        //console.log(value);
        return value;
    }

    getKeyByValue(value, isDiaDiem) {
        var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
        var key = '';
        for (var i = 0; i < orderTypes.length; i++) {
            var orderType = orderTypes[i];
            if (value === orderType) {
                key = orderKeys[i];
                break;
            }
        }
        //console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SortMenu);


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
    },
    dropdownOptions: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: -320,
        left: 10,
        overflow: 'hidden'
    },
    dropdownOptions2: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: -280,
        left: 10,
        overflow: 'hidden'
    },
    sortText: {
        fontSize: 11
        , fontFamily: gui.fontFamily,
        paddingLeft: 0
    }
});
