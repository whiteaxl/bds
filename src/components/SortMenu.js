'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';


import React, {View, Component, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

import RelandIcon from './RelandIcon';

import MMenuOption from './MMenuOption';

/**
 * ## Redux boilerplate
 */
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
    'giaM2',
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
    'giaM2',
    'soPhongNguASC',
    'khoangCach',
    'dienTichDESC'
];

class SortMenu extends Component {
    render() {
        console.log("Call SortMenu render");
        var {isDiaDiem} = this.props;
        var orderBy = this.getValueByKey(this.props.search.form.fields.orderBy, isDiaDiem);
        if (!orderBy) {
            orderBy = orderTypes[0];
        }
        var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
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
                />
            );
        }
        return (
            <View>
                <Menu onSelect={(option) => this._onApply(option)}>
                    <MenuTrigger>
                        <RelandIcon name="sort" size={24} text="Sắp xếp" textProps={myStyles.sortText} noAction={true}/>
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

    _onApply(option) {
        var {isDiaDiem} = this.props;
        this.props.actions.onSearchFieldChange("orderBy", this.getKeyByValue(option, isDiaDiem));

        this.props.actions.search(
            this.props.search.form.fields
            , () => { }
        );
    }

    getValueByKey(key, isDiaDiem) {
        var orderTypes = isDiaDiem ? orderTypes2 : orderTypes1;
        var orderKeys = isDiaDiem ? orderKeys2 : orderKeys1;
        var value = '';
        for (var i = 0; i < orderKeys.length; i++) {
            var orderKey = orderKeys[i];
            if (key === orderKey) {
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
