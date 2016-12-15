'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, AlertIOS } from 'react-native';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

import RelandIcon from '../RelandIcon';

import Menu, { MenuOptions, MenuOption, MenuTrigger } from '../menu';

import MMenuOption from '../MMenuOption';
import log from '../../lib/logUtil';


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
    'Xin chào bạn',
    'Nhà đã bán chưa bạn?',
    'Gửi cho mình thêm ảnh',
    'Gửi cho mình vị trí chính xác của nhà',
    'Giá cuối cùng bạn bán là bao nhiêu?',
    'Giá thương lượng được không bạn?',
    'Cảm ơn bạn!',
    'Giảm giá thêm đi bạn'
];

class ChatMenu extends Component {
    render() {
        log.info("Call ChatMenu render");

        var orderTypes = orderTypes1;

        var orderBy = orderTypes[0];

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
                        <RelandIcon name="list" color='#0082f8'
                                    mainProps={myStyles.captureIcon}
                                    noAction={true}
                                    size={21} textProps={{ paddingLeft: 0 }}
                                    />

                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={myStyles.dropdownOptions}>
                        {optionList}
                    </MenuOptions>
                </Menu>
            </View>
        );
    }

    _onApply(option) {
        this.props.onPress(option);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMenu);


// Later on in your styles..
var myStyles = StyleSheet.create({
    captureIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 20
    },
    dropdownOptions: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: -310,
        left: 10,
        overflow: 'hidden',
        width: Dimensions.get('window').width*9/10
    },
    sortText: {
        fontSize: 14,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal',
        color: '#1396E0',
        textAlign: 'left',
        marginTop: 10,
        paddingLeft: 17,
        width: Dimensions.get('window').width/4
    }
});
