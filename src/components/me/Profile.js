'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as meActions from '../../reducers/me/meActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';
import GiftedSpinner from 'react-native-gifted-spinner';

import React, {Component} from 'react';

import {
    Text, View, StyleSheet, PixelRatio, ScrollView, Image, Alert,
    TextInput, StatusBar, Dimensions, TouchableOpacity, TouchableHighlight, DatePickerIOS
} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';

import gui from "../../lib/gui";
import util from "../../lib/utils";
import MChartView from '../MChartView';
import moment from 'moment';
import FullLine from '../line/FullLine'


import DanhMuc from '../../assets/DanhMuc';

var {width, height} = Dimensions.get('window');

import cfg from "../../cfg";

var rootUrl = `${cfg.serverUrl}`;

const actions = [
    globalActions,
    meActions,
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


class Profile extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');


        let date = this.props.me.profile.date ? this.props.me.profile.date : new Date();

        this.state = {
            date: date,
            timeZoneOffsetInHours: (+7) * (date).getTimezoneOffset() / 60,
            showNgaySinhPicker:false
        }
    }

    render() {
        return (

            <View style={style.container}>

                {this._renderHeader()}
                <ScrollView ref={(scrollView) => { this._scrollView = scrollView; }}
                >
                    <View style = {{flexDirection: 'column', flex:1}}>

                        {this._renderContentGroupTitle('THÔNG TIN LIÊN LẠC')}

                        {this._renderTenDayDu()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderSoDienThoai()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderEmail()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderWebsite()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderGioiThieu()}

                        <FullLine style={{ marginLeft: 15 }} />
                        {this._renderPhoto()}

                        {this._renderContentGroupTitle('')}

                        {this._renderDoiMatKhau()}

                        {this._renderContentGroupTitle('THÔNG TIN CÁ NHÂN')}

                        {this._renderGioiTinh()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderNgaySinh()}
                        {this._renderNgaySinhPicker()}
                        <FullLine style={{ marginLeft: 15 }} />


                        {this._renderDiaChi()}
                        <FullLine style={{ marginLeft: 15 }} />

                        {this._renderMoiGioi()}

                        {this._renderContentGroupTitle('THÔNG TIN TÀI KHOẢN')}

                        {this._renderThongTinTaiKhoan()}
                    </View>
                </ScrollView>
            </View>
        )
    }

    _onBack() {
        Actions.pop();
    }

    validateData(profile){
        if (!profile.phone && !profile.email){
            Alert.alert("Số điện thoại và email không được phép rỗng đồng thời");
            return false;
        }

        if (profile.email && profile.email.indexOf('@')==-1){
            Alert.alert("Email không đúng định dạng");
            return false;
        }

        return true;
    }

    _onApply(){
        let profile = this.props.me.profile;

        if (!this.validateData(this.props.me.profile))
            return;

        this._applyChange();
    }

    _applyChange() {
        let sourceImageFile = this.props.me.profile.avatar;
        if (!sourceImageFile) {
            this._updateProfile();
            return;
        }
        let ms = moment().toDate().getTime();
        let userID = this.props.global.currentUser.userID;
        let destFileName = 'Avatar_' + userID + '_' + ms + sourceImageFile.substring(sourceImageFile.lastIndexOf('.'));
        this.props.actions.onUploadImage(destFileName, sourceImageFile, this._uploadCallBack.bind(this));
    }

    _uploadCallBack(err, result) {
        let {data} = result;
        if (err || data == '') {
            return;
        }
        let {success, file} = JSON.parse(data);
        if (success) {
            var {url} = file;
            let imgUrl = rootUrl + url;
            this.props.actions.onProfileFieldChange('avatar', imgUrl);
            this._updateProfile();
        }
    }

    _updateProfile(){
        let profile = this.props.me.profile;

        let dto = {
            userID: profile.userID,
            fullName : profile.fullName,
            email : profile.email||undefined,
            phone : profile.phone||undefined,
            diaChi : profile.diaChi||undefined,
            gioiThieu: profile.gioiThieu||undefined,
            avatar : profile.avatar||undefined,
            sex: profile.sex||'U', // F, M, U
            birthDate: profile.birthDate||undefined, // date type
            website: profile.website||undefined,
            broker: profile.broker||'U'
        }

        let token = this.props.global.currentUser.token;
        this.props.actions.updateProfile(dto, token).then(
            (res) =>{
                if (res.success){
                    this._updateCurrentUser();
                    Alert.alert("Cập nhật thông tin cá nhân thành công");
                    Actions.pop();
                } else {
                    Alert.alert(res.msg);
                }
            }
        ). catch((res) => {
            Alert.alert(res.toString());
        })
    }

    _updateCurrentUser(){
        let {fullName, avatar, email, phone} = this.props.me.profile;
        this.props.actions.onCurrenUserFieldChange('fullName', fullName);
        this.props.actions.onCurrenUserFieldChange('phone', phone);
        this.props.actions.onCurrenUserFieldChange('email', email);
        this.props.actions.onCurrenUserFieldChange('avatar', avatar);
    }

    _renderHeader(){
        return (
            <View style={style.headerContainer}>
                <TruliaIcon onPress={this._onBack.bind(this)}
                            name="arrow-left" color={'white'} size={25}
                            mainProps={style.backButton} text={this.props.backTitle}
                            textProps={style.backButtonText}>
                </TruliaIcon>

                <View style={style.headerTitle}>

                    <Text style={style.headerTitleText}>
                        {this.props.me.profile.fullName}
                    </Text>
                </View>
                <TouchableHighlight onPress={() => this._onApply()}>
                    <View style={style.changeButton}>
                        {this._renderLoadingView()}
                        <Text style={[style.headerTitleText,{marginLeft:5, textAlign:'right'}]}>
                            Thay đổi
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderLoadingView(){
        if (!this.props.me.isUpdatingProfile){
            return <View />
        }
        return (
            <GiftedSpinner size="small" color="white" />
        );
    }
    _renderContentGroupTitle(title){
        return (
            <View>
                <FullLine />
                <View style={style.contentGroupTitle}>
                    <Text style={style.contentGroupTitleText}>{title}</Text>
                </View>
                <FullLine />
            </View>
        );
    }

    _renderTenDayDu(){
        return (
            <View style={style.rowContainer}>

                <Text style={[style.contentLabel]}>
                    Tên đầy đủ
                </Text>

                <TextInput
                    secureTextEntry={false}
                    autoCorrect = {false}
                    style={style.contentText}
                    value={this._getFullName()}
                    onChangeText={(text) => this.onValueChange("fullName", text)}
                />

            </View>
        );
    }

    _renderSoDienThoai(){
        return (
            <View style={style.rowContainer}>
                <Text style={[style.contentLabel]}>
                    Số điện thoại
                </Text>

                <TextInput
                    editable={false}
                    secureTextEntry={false}
                    autoCorrect = {false}
                    keyboardType="numeric"
                    style={style.contentText}
                    value={this._getSoDienThoai()}
                    onChangeText={(text) => this.onValueChange("phone", text)}
                />
            </View>
        );
    }

    _renderEmail(){
        return (
            <View style={style.rowContainer}>
                <Text style={[style.contentLabel]}>
                    Email
                </Text>

                <TextInput
                    secureTextEntry={false}
                    autoCapitalize = {'none'}
                    autoCorrect = {false}
                    style={style.contentText}
                    value={this._getEmail()}
                    onChangeText={(text) => this.onValueChange("email", text)}
                />
            </View>
        );
    }

    _renderWebsite(){
        return (
            <View style={style.rowContainer}>
                <Text style={[style.contentLabel]}>
                    Website
                </Text>

                <TextInput
                    secureTextEntry={false}
                    autoCapitalize = {'none'}
                    autoCorrect = {false}
                    style={style.contentText}
                    value={this._getWebsite()}
                    onChangeText={(text) => this.onValueChange("website", text)}
                />
            </View>
        );
    }

    _renderPhoto(){
        let avatarUri = this.props.me.profile.avatar ? {uri: this.props.me.profile.avatar} :
            require('../../assets/image/register_avatar_icon.png');

        return (
            <View style={style.rowContainer}>
                <Text style={[style.contentLabel]}>
                    Ảnh
                </Text>
                <TouchableOpacity
                    onPress={this.takePicture.bind(this)}
                >
                    <Image
                        style={style.avatarIcon}
                        resizeMode={Image.resizeMode.cover}
                        source={avatarUri}
                    />
                </TouchableOpacity>
                <Text style={style.contentText}>
                    Chạm để thay đổi ảnh
                </Text>
            </View>
        );
    }

    _renderGioiThieu(){
        return (
            <View style={style.rowContainer}>
                <Text style={[style.contentLabel]}>
                    Giới thiệu
                </Text>
                <View style={{flex:1}}>
                    <TextInput
                        secureTextEntry={false}
                        multiline = {true}
                        numberOfLines = {5}
                        style={[style.contentText, {borderColor: '#dcdcdc', borderWidth: 1, height: 100}]}
                        value={this._getGioiThieu()}
                        onChangeText={(text) => this.onValueChange("gioiThieu", text)}
                    />
                    <View style={style.numberPicture}>
                        <Text style={{marginRight:25, color:'gray', fontWeight:'200', fontSize:12 }}>6/250</Text>
                    </View>
                </View>
            </View>
        );
    }

    _renderDoiMatKhau(){
        return (
            <TouchableHighlight onPress={() => this._onDoiMatKhauPressed()}>
                <View style={style.rowIconContainer}>
                    <Text style={[style.contentLabel, {width: 150}]}>
                        Thay đổi mật khẩu
                    </Text>
                    <View style={style.arrowIcon}>
                        <Text style={style.label}> </Text>
                        <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderGioiTinh(){
        return (
            <TouchableHighlight onPress={() => this._onGioiTinhPressed()}>
                <View style={style.rowIconContainer}>
                    <Text style={[style.contentLabel]}>
                        Giới tính
                    </Text>
                    <View style={style.arrowIcon}>
                        <Text style={style.label}>{this._getGioiTinh()}</Text>
                        <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderNgaySinh(){
        return (
            <TouchableHighlight onPress={() => this._onNgaySinhPressed()}>
                <View style={style.rowIconContainer}>
                    <Text style={[style.contentLabel]}>
                        Ngày sinh
                    </Text>
                    <View style={style.arrowIcon}>
                        <Text style={style.label}>{this._getNgaySinh()}</Text>
                        <TruliaIcon name={"arrow-down"} color={gui.arrowColor} size={18} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderNgaySinhPicker(){
        if (!this.state.showNgaySinhPicker)
            return <View />;

        return (
            <DatePickerIOS
                date={this.state.date}
                mode="date"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours}
                onDateChange={this._onNgaySinhChange.bind(this)}
            />
        );
    }

    _renderDiaChi(){
        return (
            <View style={style.rowIconContainer}>
                <Text style={[style.contentLabel]}>
                    Địa chỉ
                </Text>
                <View style={style.arrowIcon}>
                    <TextInput
                        secureTextEntry={false}
                        multiline = {true}
                        autoCorrect = {false}
                        numberOfLines = {3}
                        style={[style.contentText]}
                        value={this._getDiaChi()}
                        onChangeText={(text) => this.onValueChange("diaChi", text)}
                    />
                    <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                </View>

            </View>
        );
    }

    _renderMoiGioi(){
        return (
            <TouchableHighlight onPress={() => this._onMoiGioiPressed()}>
                <View style={style.rowIconContainer}>
                    <Text style={[style.contentLabel, {width: 140}]}>
                        Vai trò của bạn
                    </Text>
                    <View style={style.arrowIcon}>
                        <Text style={style.label}>{this._getMoiGioi()}</Text>
                        <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderThongTinTaiKhoan() {
        var data = [{
            "name": "",
            "fillColor" : gui.mainColor,
            "value": 400
        }, {
            "name": "",
            "fillColor" : "#DE6207",
            "value": 100
        }];
        var pallete = [
            util.hexToRgb(gui.mainColor), util.hexToRgb("#EA9409")
        ];
        var options = {
            margin: {
                top: 1,
                left: 2,
                bottom: 1,
                right: 2
            },
            width: 126,
            height: 126,
            r: 46,
            R: 61,
            legendPosition: 'topLeft',
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            label: {
                fontFamily: gui.fontFamily,
                fontSize: gui.buttonFontSize,
                fontWeight: 'normal'
            }
        };
        var chartTitleBold = '500K';
        var chartTitle = 'Tổng tài khoản';

        return (
            <View>
                <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', backgroundColor:'white', paddingTop:0}}>
                    <View style={{paddingLeft: 13, paddingTop:2, width: width/2-25, alignItems: 'center', justifyContent: 'center'}}>
                        <MChartView
                            data={data}
                            options={options}
                            pallete={pallete}
                            chartTitle={chartTitle}
                            chartTitleBold={chartTitleBold}
                        />
                    </View>
                    <View style={{paddingLeft: 0, paddingTop:2}}>
                        {this._renderMoneyLine("Tài khoản chính", '400K', gui.mainColor)}
                        {this._renderMoneyLine("Tiền khoản Khuyến mãi", '100K', '#EA9409')}
                    </View>
                </View>
                <Text style={{fontSize: 5}} />
            </View>
        );
    }

    _renderMoneyLine(label, value, dotColor) {
        return (
            <View style={{flexDirection:'row'}}>
                <View style={[style.dot3, {borderColor: dotColor}]}>
                </View>
                <View style={{flexDirection:'column', marginTop: 8, marginBottom: 8}}>
                    <Text style={{fontSize: 13, fontFamily: gui.fontFamily, fontWeight: 'bold'}}>
                        {value}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: gui.fontFamily, color: '#9C9C9C'}}>
                        {label}
                    </Text>
                </View>
            </View>
        )
    }

    _onGioiTinhPressed(){
        Actions.GioiTinh();
    }

    _onMoiGioiPressed(){
        Actions.MoiGioi();
    }

    _onDoiMatKhauPressed(){
        Actions.ChangePassword();
    }

    _onNgaySinhPressed(){
        let showNgaySinhPicker = this.state.showNgaySinhPicker;

        this.setState({showNgaySinhPicker: !showNgaySinhPicker});

        if (!showNgaySinhPicker)
            this._onScrollNgaySinh();
    }

    _onNgaySinhChange(date){
        console.log("on Ngay Sinh change");
        let birthDate = moment(date).subtract(1, 'days')
        this.setState( { date: date});
        this.onValueChange('birthDate', birthDate);
    }

    _onScrollNgaySinh() {
        let  scrollTo = 300;
        this._scrollView.scrollTo({y: scrollTo});
    }

    onValueChange(field, value){
        //todo: need to implement
        this.props.actions.onProfileFieldChange(field, value);
    }

    takePicture() {
        Actions.PostAds({owner: 'profile'});
    }

    _getFullName(){
        return this.props.me.profile.fullName;
    }

    _getSoDienThoai(){
        return this.props.me.profile.phone;
    }

    _getEmail(){
        return this.props.me.profile.email;
    }

    _getWebsite(){
        return this.props.me.profile.website;
    }

    _getGioiThieu(){
        return this.props.me.profile.gioiThieu;
    }

    _getAvatar(){
        return this.props.me.profile.avatar;
    }

    _getGioiTinh(){
        return DanhMuc.GioiTinh[this.props.me.profile.sex]||'';
    }

    _getNgaySinh(){
        return this.props.me.profile.birthDate ? moment(this.props.me.profile.birthDate).format('DD/MM/YYYY') : ''
    }

    _getDiaChi(){
        return this.props.me.profile.diaChi;
    }

    _getMoiGioi(){
        return DanhMuc.MoiGioi[this.props.me.profile.broker]||'';
    }
}

/**
 * ## Styles
 */
var style = StyleSheet.create({

    lineWithIconStyle : {
        borderTopColor: '#ebebeb',
        borderBottomColor: '#ebebeb',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'transparent'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: gui.mainColor,
        top: 0,
        height: 60
    },
    headerTitle: {
        left: 36,
        right: 36,
        marginTop: 30,
        marginBottom: 10,
        position: 'absolute'
    },
    headerTitleText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'center'
    },
    changeButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 80,
        right: 15,
        marginTop: 30,
        marginBottom: 10,
        position: 'absolute'
    },
    backButton: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 15,
        paddingRight: 15
    },
    backButtonText: {
        color: 'white',
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        textAlign: 'left',
        marginLeft: 7
    },
    label: {
        fontSize: 14,
        fontFamily: gui.fontFamily,
        paddingRight: 5,
        color: '#8A8A8A'
    },
    normalFont: {
        fontSize: 14,
        fontFamily: gui.fontFamily,
        color: '#8A8A8A'
    },
    contentGroupTitle: {
        flexDirection : "row",
        justifyContent :'space-between',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#f8f8f8',
        borderTopWidth:0,
        borderColor:'lightgray'
    },
    contentGroupTitleText: {
        fontSize: 11,
        fontFamily: gui.fontFamily,
        color: '#313131',
        justifyContent :'space-between',
        padding: 0,
        fontWeight:"300"
    },
    line: {
        backgroundColor: 'lightgray',
        height: 0.5,
        marginLeft: 15
    },
    fullLine: {
        backgroundColor: 'lightgray',
        height: 0.5
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        marginTop: 6,
        marginBottom: 6,
        paddingLeft: 15,
    },
    contentLabel: {
        textAlign: 'left',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: gui.fontFamily,
        color: 'black',
        width: 100
    },
    contentText: {
        textAlign: 'left',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
        fontSize: 14,
        fontFamily: gui.fontFamily,
        color: '#8A8A8A',
        marginLeft: 10,
        width: width-150,
        paddingLeft: 5,
        paddingRight: 5
    },
    rowIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginTop: 6,
        marginBottom: 6,
        paddingLeft: 15
    },
    arrowIcon: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingRight: 15
    },
    textFullWidth: {
        textAlign: 'left',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        fontSize: 14,
        fontFamily: gui.fontFamily,
        color: 'black',
        marginTop: 8,
        marginBottom: 7,
        marginLeft: 0,
        marginRight: 0,
    },
    dot3 : {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 14,
        marginTop: 18,
        backgroundColor: 'white',
        borderWidth: 3.5
    },
    avatarIcon : {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    numberPicture:{
        backgroundColor:'white',
        height:20,
        marginTop:5,
        alignItems:'flex-end',
        justifyContent:'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

