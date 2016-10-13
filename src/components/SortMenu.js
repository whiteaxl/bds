'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import Menu, { MenuOptions, MenuOption, MenuTrigger } from './menu';

import RelandIcon from './RelandIcon';

import MMenuOption from './MMenuOption';
import log from '../lib/logUtil';


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
    'Ngày đăng mới nhất',
    'Giá tăng dần',
    'Giá giảm dần',
    'Giá/m² tăng dần',
    'Giá/m² giảm dần',
    'Diện tích tăng dần',
    'Diện tích giảm dần'
];

const orderKeys1 = [
    '',
    'ngayDangTinDESC',
    'giaASC',
    'giaDESC',
    'giaM2ASC',
    'giaM2DESC',
    'dienTichASC',
    'dienTichDESC'
];

const orderTypes2 = [
    'Mặc định',
    'Ngày đăng mới nhất',
    'Khoảng cách gần tâm nhất',
    'Giá tăng dần',
    'Giá giảm dần',
    'Giá/m² tăng dần',
    'Giá/m² giảm dần',
    'Diện tích tăng dần',
    'Diện tích giảm dần'
];

const orderKeys2 = [
    '',
    'ngayDangTinDESC',
    'khoangCachASC',
    'giaASC',
    'giaDESC',
    'giaM2ASC',
    'giaM2DESC',
    'dienTichASC',
    'dienTichDESC'
];

class SortMenu extends Component {
    render() {
        log.info("Call SortMenu render");
        var {isDiaDiem} = this.props;
        var orderBy = this.getValueByKey(this.props.search.form.fields.orderBy, isDiaDiem);
        // var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        var orderTypes = orderKeys1;
        if (!orderBy) {
            orderBy = orderTypes[0];
        }
        var optionList = [];
        for (var i = 0; i < orderTypes.length; i++) {
            var orderType = orderTypes[i];
            var isSelected = (orderType == orderBy);
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
                        <Text style={myStyles.sortText}>Sắp xếp</Text>
                        {/*<RelandIcon name="sort-alt" size={24} text="Sắp xếp" textProps={myStyles.sortText} noAction={true}/>*/}
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
        if ('giaASC' == key || 'giaDESC' == key) {
            return key;
        }
        return key.indexOf("DESC") !== -1 ? key.substring(0, key.length-4) :
            key.substring(0, key.length-3);
    }

    _getSortType(key) {
        return (key && key.indexOf("ASC") !== -1) ? "ASC" : "DESC";
    }

    _onApply(option) {
        var {isDiaDiem} = this.props;
        // var oldOrderBy = this.props.search.form.fields.orderBy;
        // var oldSortType = this._getSortType(oldOrderBy);
        var newOrderBy = this.getKeyByValue(option, isDiaDiem);
        // if (this._getOrderKey(newOrderBy) == this._getOrderKey(oldOrderBy) &&
        //     (newOrderBy.indexOf("ngayDangTin") !== -1
        //     || newOrderBy.indexOf("giaM2") !== -1
        //     || newOrderBy.indexOf("soPhongNgu") !== -1
        //     || newOrderBy.indexOf("khoangCach") !== -1
        //     || newOrderBy.indexOf("dienTich") !== -1)) {
        //     newOrderBy = this._getOrderKey(newOrderBy);
        //     if ('giaASC' != newOrderBy && 'giaDESC' != newOrderBy) {
        //         newOrderBy = (oldSortType == "ASC") ? newOrderBy + "DESC" : newOrderBy + "ASC";
        //     }
        // }
        this.props.actions.onSearchFieldChange("orderBy", newOrderBy);
        this.props.actions.onSearchFieldChange("pageNo", 1);
        var {loaiTin, ban, thue, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
            dienTich, giaPicker, listData, marker, viewport, diaChinh, center, radiusInKmSelectedIdx,
            huongNha, ngayDaDang, polygon, region, limit, isIncludeCountInResponse} = this.props.search.form.fields;
        this.props.actions.search(
            {loaiTin: loaiTin, ban: ban, thue: thue, soPhongNguSelectedIdx: soPhongNguSelectedIdx,
                soNhaTamSelectedIdx: soNhaTamSelectedIdx, viewport: viewport, diaChinh: diaChinh, center: center,
                dienTich: dienTich, giaPicker: giaPicker, orderBy: newOrderBy, listData: listData,
                marker: marker, radiusInKmSelectedIdx: radiusInKmSelectedIdx, huongNha: huongNha, ngayDaDang: ngayDaDang,
                polygon: polygon, region: region, limit: limit, pageNo: 1, isIncludeCountInResponse: isIncludeCountInResponse}
            , () => {this.props.scrollToTop()}
        );
    }

    getValueByKey(key, isDiaDiem) {
        // var findKey = this._getOrderKey(key);
        var findKey = key;
        // var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        // var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
        var orderTypes = orderTypes1;
        var orderKeys = orderKeys1;
        var value = '';
        for (var i = 0; i < orderKeys.length; i++) {
            var orderKey = orderKeys[i];
            // orderKey = this._getOrderKey(orderKey);
            if (findKey == orderKey) {
                value = orderTypes[i];
                break;
            }
        }
        //log.info(value);
        return value;
    }

    getKeyByValue(value, isDiaDiem) {
        // var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        // var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
        var orderTypes = orderTypes1;
        var orderKeys = orderKeys1;
        var key = '';
        for (var i = 0; i < orderTypes.length; i++) {
            var orderType = orderTypes[i];
            if (value === orderType) {
                key = orderKeys[i];
                break;
            }
        }
        //log.info(key);
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
        marginTop: -350,
        left: 10,
        overflow: 'hidden',
        width: 226
    },
    dropdownOptions2: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: -310,
        left: 10,
        overflow: 'hidden',
        width: 226
    },
    sortText: {
        fontSize: gui.buttonFontSize
        , fontFamily: gui.fontFamily,
        fontWeight : 'normal',
        color: '#1396E0',
        textAlign: 'left',
        marginTop: 10,
        paddingLeft: 17,
        width: Dimensions.get('window').width/3
    }
});
