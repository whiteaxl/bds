'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, SegmentedControlIOS, Text, TextInput, StyleSheet, Alert, Dimensions} from 'react-native'

import {Actions} from 'react-native-router-flux';

import DanhMuc from '../../assets/DanhMuc';

import MultipleChoice from '../MultipleChoice';

import TruliaIcon from '../TruliaIcon';

import gui from '../../lib/gui';
import log from '../../lib/logUtil';

/**
 * ## Redux boilerplate
 */
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

class PostAdsPrice extends Component {
    constructor(props) {
        super(props);
        var {gia} = props.postAds;
        var donViTienVal = this.getDonViTienVal();
        this.state = {
            gia: (gia && gia != -1) ? gia.toString() : '',
            donViTien: donViTienVal
        };
    }

    getDonViTien() {
        return this.props.postAds.donViTien;
    }

    onUpdateGia(option) {
        var donViTien = this.getKeyByValue(DanhMuc.getDonViTienValues(), option);
        this.state.donViTien = option;
        var gia = donViTien == 5 ? null : this.state.gia;
        this.props.actions.onPostAdsFieldChange("gia", gia);
        this.props.actions.onPostAdsFieldChange("donViTien", donViTien);
    }

    getDonViTienVal() {
        var donViTien = this.getDonViTien();
        var donViTienValues = DanhMuc.getDonViTienValues();
        var donViTienVal = this.getValueByKey(donViTienValues, donViTien);
        if (!donViTienVal) {
            donViTienVal = donViTienValues[0];
        }
        return donViTienVal;
    }

    render() {
        var priceHolder = 'Nhập giá tiền';
        var headerTitle = "Giá tiền";
        return (
            <View style={myStyles.fullWidthContainer}>
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
                <View style={[myStyles.optionSeparator, myStyles.paddingSeparator]}>
                    <Text />
                </View>
                <View style={[myStyles.optionSeparator, {backgroundColor: 'white'}]}>
                    <TextInput
                        secureTextEntry={false}
                        autoFocus={true}
                        keyboardType={'numeric'}
                        style={myStyles.input}
                        value={this.state.gia}
                        placeholder={priceHolder}
                        onChangeText={(text) => this.onValueChange("gia", text)} />
                </View>
                <View style={myStyles.optionSeparator}>
                    <Text style={myStyles.label}>ĐƠN VỊ</Text>
                </View>
                <View style={myStyles.optionSeparator} />
                <MultipleChoice
                    options={DanhMuc.getDonViTienValues()}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.donViTien]}
                    maxSelectedOptions={1}
                    onSelection={(option)=>this._onApply(option)}
                />
            </View>
        );
    }

    onValueChange(key, value) {
        log.info(key, value);
        var newState = {};
        newState[key] = value.replace(',','.');
        this.setState(newState);
    }

    _onBack() {
        if (!this.isValidInputData()) {
            return;
        }
        var gia = this.state.donViTien == DanhMuc.DonViTien[5] ? null : this.state.gia;
        this.props.actions.onPostAdsFieldChange("gia", gia);
        Actions.pop();
    }

    _onApply(option) {
        if (!this.isValidInputData()) {
            return;
        }
        this.onUpdateGia(option);
        if (this.state.gia || this.state.donViTien == DanhMuc.DonViTien[5]) {
            Actions.pop();
        }
    }

    isValidInputData() {
        var {gia} = this.state;
        if (gia && isNaN(gia)) {
            Alert.alert(
                'Thông báo',
                'Bạn nhập sai kiểu giá!'
            );
            return false;
        }
        return true;
    }

    getValueByKey(values, key) {
        var value = '';
        for (var i = 0; i < DanhMuc.DonViTienKey.length; i++) {
            var loaiKey = DanhMuc.DonViTienKey[i];
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
                key = DanhMuc.DonViTienKey[i];
                break;
            }
        }
        //console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsPrice);



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
    optionSeparator: {
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine,
        backgroundColor: '#F6F6F6',
        paddingLeft: 10,
        paddingRight: 10
    },
    paddingSeparator: {
        padding: 10,
        paddingTop: 13,
        paddingBottom: 14
    },
    label: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 9,
        marginBottom: 9,
        color: '#A7A7A7',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal'
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        paddingLeft: 10,
        paddingRight: 10,
        width: Dimensions.get('window').width-30,
        height: 30,
        margin: 5,
        textAlign: 'left',
        alignSelf: 'center'
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
    }
});

