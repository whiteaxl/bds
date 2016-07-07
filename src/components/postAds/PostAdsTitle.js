'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, TextInput, StatusBar, Dimensions } from 'react-native'

import KeyboardSpacer from 'react-native-keyboard-spacer';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import TruliaIcon from '../TruliaIcon';

const actions = [
    globalActions,
    postAdsActions
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



class PostAdsTitle extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');
    }

    render() {
        var {chiTiet} = this.props.postAds;
        var chiTietHolder = '';
        if (!chiTiet) {
            chiTietHolder = 'Mô tả những gì bạn muốn bán (cho thuê).\r\nVí dụ: Địa chỉ, diện tích, giá, hướng nhà...';
        }
        var headerTitle = "Chi tiết";
        return (
            <View style={myStyles.container}>
                <View style={myStyles.search}>
                    <View style={myStyles.customPageHeader}>
                        <View style={myStyles.customPageTitle}>
                            <Text style={myStyles.customPageTitleText}>
                                {headerTitle}
                            </Text>
                        </View>
                        <TruliaIcon onPress={this._onBack.bind(this)}
                                    name="arrow-left" color={'white'} size={25}
                                    mainProps={myStyles.backButton} text={this.props.backTitle}
                                    textProps={myStyles.backButtonText} >
                        </TruliaIcon>
                    </View>
                </View>
                <View style={{marginTop: 5, marginLeft: 15, marginRight: 15}}>
                    <TextInput
                        secureTextEntry={false}
                        multiline={true}
                        autoFocus={true}
                        style={myStyles.input}
                        placeholder={chiTietHolder}
                        value={this.props.postAds.chiTiet}
                        onChangeText={(text) => this.onValueChange("chiTiet", text)}
                    />
                </View>
                <KeyboardSpacer/>
            </View>
        )
    }

    onValueChange(key: string, value: string) {
        this.props.actions.onPostAdsFieldChange(key, value);
    }

    _onBack() {
        Actions.pop();
    }

}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    customPageHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: gui.mainColor,
        height: 60
    },
    customPageTitle: {
        left:36,
        right:36,
        marginTop: 31,
        marginBottom: 10,
        position: 'absolute'
    },
    customPageTitleText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'center'
    },
    backButton: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 18,
        paddingRight: 18
    },
    backButtonText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        textAlign: 'left',
        marginLeft: 7
    },
    search: {
        top:0,
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    label: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        color: '#8A8A8A'
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        padding: 4,
        height: Dimensions.get('window').height - 95,
        borderColor: '#EFEFEF',
        borderWidth: 0,
        borderRadius: 5,
        margin: 5,
        width: Dimensions.get('window').width - 30,
        alignSelf: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsTitle);

