'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, TouchableHighlight, Text, TextInput, StyleSheet, Alert, Dimensions} from 'react-native'

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

class PostAdsLienHe extends Component {
    constructor(props) {
        super(props);

        let {currentUser} = props.global;
        let {lienHe} = props.postAds;
        let tenLienLac = lienHe ? lienHe.tenLienLac : null;
        let showTenLienLac = lienHe ? lienHe.showTenLienLac : true;
        let phone = lienHe ? lienHe.phone : null;
        let showPhone = lienHe ? lienHe.showPhone : true;
        let email = lienHe ? lienHe.email : null;
        let showEmail = lienHe ? lienHe.showEmail : true;

        this.state = {
            tenLienLac: tenLienLac||currentUser.fullName,
            showTenLienLac: showTenLienLac,
            phone: phone||currentUser.phone,
            showPhone: showPhone,
            email: email||currentUser.email,
            showEmail: showEmail
        };
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <View style={myStyles.customPageHeader}>
                    <View style={myStyles.customPageTitle}>
                        <Text style={myStyles.customPageTitleText}>
                            Liên hệ
                        </Text>
                    </View>
                    <TruliaIcon onPress={this._onBack.bind(this)}
                                name="arrow-left" color={'white'} size={25}
                                mainProps={myStyles.backButton} text={this.props.backTitle}
                                textProps={myStyles.backButtonText} >
                    </TruliaIcon>
                </View>
                <View style={myStyles.optionSeparator}>
                    <Text style={myStyles.title}>THÔNG TIN LIÊN HỆ</Text>
                    <Text style={myStyles.title}>Ẩn/Hiện</Text>
                </View>
                <View style={myStyles.optionSeparator} />

                <View style={[myStyles.headerSeparator, {borderTopColor: 'transparent', paddingTop: 2, marginBottom: 2, marginLeft: 17, paddingLeft: 0}]} >
                    <TouchableHighlight>
                        <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                            <Text style={myStyles.label}>
                                Tên liên lạc
                            </Text>
                            <TextInput
                                secureTextEntry={false}
                                autoFocus={true}
                                style={myStyles.input}
                                value={this.state.tenLienLac}
                                onChangeText={(text) => this._onTenLienLacChange(text)}
                                />
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"} color={this.state.showTenLienLac ? gui.mainColor : gui.arrowColor} size={18}
                                            onPress={() => this._onShowTenLienLacPressed()} />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={[myStyles.headerSeparator, {borderTopColor: 'lightgray', borderTopWidth: 1, paddingTop: 2, marginBottom: 2, marginLeft: 17, paddingLeft: 0}]} >
                    <TouchableHighlight>
                        <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                            <Text style={myStyles.label}>
                                Điện thoại
                            </Text>
                            <TextInput
                                secureTextEntry={false}
                                autoFocus={true}
                                style={myStyles.input}
                                value={this.state.phone}
                                onChangeText={(text) => this._onPhoneChange(text)}
                            />
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"} color={this.state.showPhone ? gui.mainColor : gui.arrowColor} size={18}
                                            onPress={() => this._onShowPhonePressed()} />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>


                <View style={[myStyles.headerSeparator, {borderTopColor: 'lightgray', borderTopWidth: 1, paddingTop: 2, marginBottom: 2, marginLeft: 17, paddingLeft: 0}]} >
                    <TouchableHighlight>
                        <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                            <Text style={myStyles.label}>
                                Email
                            </Text>
                            <TextInput
                                secureTextEntry={false}
                                autoFocus={true}
                                style={myStyles.input}
                                value={this.state.email}
                                onChangeText={(text) => this._onEmailChange(text)}
                            />
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"} color={this.state.showEmail ? gui.mainColor : gui.arrowColor} size={18}
                                            onPress={() => this._onShowEmailPressed()} />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>


            </View>
        );
    }

    _onShowTenLienLacPressed(){
        let showTenLienLac = this.state.showTenLienLac;
        this.setState({showTenLienLac: !showTenLienLac});
    }

    _onTenLienLacChange(text){
        this.setState({tenLienLac: text});
    }

    _onShowPhonePressed(){
        let showPhone = this.state.showPhone;
        this.setState({showPhone: !showPhone});
    }

    _onPhoneChange(text){
        this.setState({phone: text});
    }

    _onShowEmailPressed(){
        let showEmail = this.state.showEmail
        this.setState({showEmail: !showEmail});
    }

    _onEmailChange(text){
        this.setState({email: text});
    }

    _onBack() {
        var lienHe = {
            tenLienLac : this.state.tenLienLac,
            showTenLienLac : this.state.showTenLienLac,
            phone: this.state.phone,
            showPhone: this.state.showPhone,
            email: this.state.email,
            showEmail: this.state.showEmail
        }
        this.props.actions.onPostAdsFieldChange("lienHe", lienHe);
        Actions.pop();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsLienHe);



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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    title: {
        marginLeft: 7,
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
        width: 4*Dimensions.get('window').width/9 + 20,
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
    },

    // new style
    label: {
        width: 100,
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily
    },
    imgList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 10,
        backgroundColor: 'white'
    }
});

