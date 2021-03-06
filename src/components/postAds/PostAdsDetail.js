'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import React, { Component } from 'react';

import {
    Text, View, StyleSheet, StatusBar, TextInput, Image, UIManager, Dimensions,
    ScrollView, Picker, TouchableHighlight, TouchableOpacity, Alert, KeyboardAvoidingView
} from 'react-native';

import { Map } from 'immutable';
import { Actions, ActionConst } from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import DanhMuc from '../../assets/DanhMuc';

import LikeTabButton from '../LikeTabButton';

import SegmentedControl from '../SegmentedControl2';

import ImageResizer from 'react-native-image-resizer';

import PickerExt2 from '../picker/PickerExt2';

import placeUtil from '../../lib/PlaceUtil';

import GiftedSpinner from 'react-native-gifted-spinner';

import moment from 'moment';

import dismissKeyboard from 'react-native-dismiss-keyboard';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import cfg from "../../cfg";

import FullLine from '../line/FullLine'

var rootUrl = `${cfg.serverUrl}`;

var { width, height } = Dimensions.get('window');
const windowHeight = height;

const Item = Picker.Item;

const actions = [
    globalActions,
    postAdsActions,
    adsMgmtActions
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

var count = 0;
var uploadFiles = [];
var errorMessage = '';

class NPostAdsDetail extends Component {

    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        errorMessage = this.props.postAds.error;


        let adsID = props.postAds.id;

        let diaChiChiTiet = props.postAds.place ? props.postAds.place.diaChiChiTiet : '';
        
        let diaChinhFullName = placeUtil.getDiaChinhFullName(props.postAds.place);

        this.state = {
            uploadUrls: [],
            chiTietExpanded: true,
            toggleState: false,
            editGia: false,
            showNamXayDung: false,
            initNamXayDung: '',
            inputNamXayDung: '',
            namXayDung: null,
            diaChinhFullName: diaChinhFullName,
            diaChiChiTiet: diaChiChiTiet,
            adsID: adsID,
            showMoreContent: false,
            deletedPhoto: null
        }
    }

    componentWillMount() {
        let { place, photos, lienHe} = this.props.postAds;
        let adsID = this.props.postAds.id;
        let {currentUser} = this.props.global;

        if (!adsID || adsID.length <= 0) {
            let lienHe = {
                tenLienLac: currentUser.fullName,
                showTenLienLac: true,
                phone: currentUser.phone,
                showPhone: true,
                email: currentUser.email,
                showEmail: true
            };
            this.props.actions.onPostAdsFieldChange("lienHe", lienHe);
        }

        if (place && place.geo && place.geo.lat && place.geo.lon)
            return;

        this.getAdsLocation(photos);

    }

    getAdsLocation(photos) {
        if (photos) {
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].location && photos[i].location.longitude && photos[i].location.latitude) {
                    var {place} = this.props.postAds;
                    var geo = {
                        "lat": photos[i].location.latitude,
                        "lon": photos[i].location.longitude
                    };
                    place.geo = geo;
                    this.props.actions.onPostAdsFieldChange("place", place);
                    return;
                }
            }
        }

        this.getCurrentLocation();
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var {place} = this.props.postAds;
                var geo = {
                    "lat": position.coords.latitude,
                    "lon": position.coords.longitude
                };
                place.geo = geo;
                this.props.actions.onPostAdsFieldChange("place", place);
            },
            (error) => {
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }
    _scrollToInput(reactNode: any) {
        this.refs.scroll.scrollToFocusedInput(reactNode)
        this.refs.scroll.scrollToPosition(0, 0, true)
    }

    render() {
        var {toggleState} = this.state;
        var scrollHeight = toggleState ? Dimensions.get('window').height - 290 :
        Dimensions.get('window').height - 74;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ paddingTop: 25, backgroundColor: gui.mainColor }} />
                <KeyboardAwareScrollView ref='scroll'>
                    <View myStyles={myStyles.container}>

                        <ScrollView
                            ref={(scrollView) => { this._scrollView = scrollView; } }
                            automaticallyAdjustContentInsets={false}
                            vertical={true}
                            //onScroll={this.handleScroll.bind(this)}
                            //scrollEventThrottle={1}
                        >
                            <View>
                                {this._renderPhoto()}

                                {this._renderLoaiTin()}

                                <FullLine />
                                <View style={myStyles.categoryTitle}>
                                    <Text style={myStyles.categoryText}>
                                        ĐẶC ĐIỂM
                                    </Text>
                                </View>
                                <FullLine />

                                {this._renderLoaiNha()}
                                <FullLine style={{marginLeft:17}} />
                                {this._renderDienTich()}

                                {this._renderPhongNgu()}

                                {this._renderPhongTam()}

                                {this._renderSoTang()}

                                <FullLine />
                                {this._renderCategoryTitle('VỊ TRÍ')}
                                <FullLine />
                                {this._renderBanDo()}
                                <FullLine style={{marginLeft:17}} />
                                {this._renderDiaChi()}
                                <FullLine style={{marginLeft:17}} />
                                {this._renderDuAn()}
                                <FullLine style={{marginLeft:17}} />
                                {this._renderHuongNha()}

                                <FullLine />
                                {this._renderCategoryTitle('GIÁ VÀ LIÊN HỆ')}
                                <FullLine />
                                {this._renderGia()}
                                <FullLine style={{marginLeft:17}} />
                                {this._renderLienHe()}

                                <FullLine />
                                {this._renderCategoryTitle('THÔNG TIN CHI TIẾT')}
                                <FullLine />
                                {this._renderChiTiet()}

                                <FullLine />
                                {this._renderMoreButton()}

                                {this._renderCategoryTitle('')}
                                <FullLine />
                                {this._renderResetButton()}
                                <FullLine />


                                <Text style={[myStyles.label, { marginTop: 9, marginLeft: 15, color: 'red' }]}>
                                    {this.props.postAds.error}</Text>
                                <Text style={{color:'white'}}>
                                    {this.state.deletedPhoto}</Text>
                            </View>


                            {this.state.toggleState ? <Button onPress={() => dismissKeyboard()}
                                                              style={[myStyles.buttonText, { textAlign: 'right', color: gui.mainColor }]}>Xong</Button> : null}
                        </ScrollView>
                        {/*this._renderLoadingView()*/}
                    </View>
                </KeyboardAwareScrollView>
                {this._renderButtonNav()}
            </View>
        )
    }

    onKeyboardToggle(toggleState) {
        this.setState({ toggleState: toggleState });
    }

    _renderCategoryTitle(title) {
        return (
            <View style={[myStyles.categoryTitle, myStyles.headerSeparator]}>
                <Text style={myStyles.categoryText}>
                    {title}
                </Text>
            </View>
        );
    }

    _renderPhoto() {
        var {photos} = this.props.postAds;
        let numOfPhoto = photos.length;
        let indexArr = [];
        for (var i = 0; i <= photos.length; i++) {
            if (i < 20) {
                indexArr.push(i)
            }
        }

        return (
            <View>
                <View style={[myStyles.mimgList, { marginTop: 10, marginBottom: 5, paddingLeft: 17, paddingRight: 15 }]} >
                    {indexArr.map((e) => { if (e < 4) return this._renderPhotoItem(e) })}
                </View>
                <View style={[myStyles.mimgList, { marginTop: numOfPhoto >= 4 ? 5 : 0, marginBottom: numOfPhoto >= 4 ? 10 : 0, paddingLeft: 17, paddingRight: 15 }]} >
                    {indexArr.map((e) => { if (e >= 4 && e<8) return this._renderPhotoItem(e) })}
                </View>
                <View style={[myStyles.mimgList, { marginTop: numOfPhoto >= 8 ? 5 : 0, marginBottom: numOfPhoto >= 8 ? 10 : 0, paddingLeft: 17, paddingRight: 15 }]} >
                    {indexArr.map((e) => { if (e >= 8 && e< 12)  return this._renderPhotoItem(e) })}
                </View>
                <View style={[myStyles.mimgList, { marginTop: numOfPhoto >= 12 ? 5 : 0, marginBottom: numOfPhoto >= 12 ? 10 : 0, paddingLeft: 17, paddingRight: 15 }]} >
                    {indexArr.map((e) => { if (e >= 12 && e< 16)  return this._renderPhotoItem(e) })}
                </View>
                <View style={[myStyles.mimgList, { marginTop: numOfPhoto >= 16 ? 5 : 0, marginBottom: numOfPhoto >= 16 ? 10 : 0, paddingLeft: 17, paddingRight: 15 }]} >
                    {indexArr.map((e) => { if (e >= 16 && e< 20)  return this._renderPhotoItem(e) })}
                </View>
            </View>
        );
    }

    _renderPhotoItem(imageIndex){
        var {photos} = this.props.postAds;
        var photo = photos[imageIndex];

        return (
            <ImageItem  imageIndex={imageIndex}
                        photo={photo}
                        onTakePhoto={this.onTakePhoto.bind(this)}
                        onDeletePhoto={this.onDeletePhoto.bind(this)}/>
        )
     }

    /*_renderPhotoItem(imageIndex) {
        var {photos} = this.props.postAds;
        var photo = photos[imageIndex];

        if (photo && photo.uri) {
            return (
                <TouchableHighlight key={imageIndex}
                                    disabled = {!this.isUploading.bind(this)}
                                    onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <Image style={myStyles.imgItem} source={photo} />
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight key={imageIndex}
                                    disabled = {!this.isUploading.bind(this)}
                                    onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <View style={[myStyles.imgItem, { borderStyle: 'dashed', borderColor: gui.mainColor }]}>
                        <RelandIcon name="plus" color={gui.mainColor}
                                    mainProps={myStyles.captureIcon}
                                    size={22} textProps={{ paddingLeft: 0 }}
                                    onPress={() => this.onTakePhoto(`${imageIndex}`)} />
                    </View>
                </TouchableHighlight>
            );
        }
    }
    */

    _renderCoverPhoto() {
        let imageIndex = 0;
        var {photos} = this.props.postAds;
        var photo = photos[imageIndex];

        if (photo && photo.uri) {
            return (
                <TouchableHighlight onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <Image style={myStyles.imgItem} source={photo} />
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <View style={[myStyles.imgItem, { borderStyle: 'dashed', borderColor: gui.mainColor }]}>
                        <RelandIcon name="plus" color={gui.mainColor}
                                    mainProps={myStyles.captureIcon}
                                    size={22} textProps={{ paddingLeft: 0 }}
                                    onPress={() => this.onTakePhoto(`${imageIndex}`)} />
                    </View>
                </TouchableHighlight>
            );
        }
    }

    _renderLoaiTin() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5 }}>
                    <LikeTabButton name={'ban'}
                                   onPress={this.onValueChange.bind(this, 'loaiTin')}
                                   selected={this.props.postAds.loaiTin === 'ban'}>BÁN</LikeTabButton>
                    <LikeTabButton name={'thue'}
                                   onPress={this.onValueChange.bind(this, 'loaiTin')}
                                   selected={this.props.postAds.loaiTin === 'thue'}>CHO THUÊ</LikeTabButton>
                </View>
            </View>
        );
    }

    _renderLoaiNha() {
        return (
            <View style={[{ paddingTop: 9, marginBottom: 5 }, myStyles.headerSeparator]}>
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onLoaiNhaPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Loại nhà
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getLoaiNhaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderDienTich() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, { marginLeft: 17, paddingLeft: 0 }]} >
                <Text style={myStyles.label}>Diện tích (m²)</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.dienTich ? this.props.postAds.dienTich.toString() : ''}
                    onChangeText={(text) => this._onNumberValueChange("dienTich", text)}
                />
            </View>
        );
    }

    _renderMatTien() {
        let {loaiNhaDat} = this.props.postAds;

        if (loaiNhaDat && [2,3,4,5,6,7,8,99].indexOf(loaiNhaDat)>=0) {
            return (
                <View style={[myStyles.imgList, myStyles.headerSeparator, { marginLeft: 17, paddingLeft: 0 }]}>
                    <Text style={myStyles.label}>Mặt tiền (m)</Text>
                    <TextInput ref="matTien"
                               secureTextEntry={false}
                               keyboardType={'numeric'}
                               style={myStyles.input}
                               value={this.props.postAds.matTien ? this.props.postAds.matTien.toString() : ''}
                               onChangeText={(text) => this._onNumberValueChange("matTien", text)}
                    />
                </View>
            );
        } else
            return;

    }

    _renderNamXayDung() {
        return (
            <View>

                <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                    <TouchableHighlight onPress={() => this._onNamXayDungPressed()}
                                        disabled={!this.isUploading.bind(this)}>
                        <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                            <Text style={myStyles.label}>
                                Năm xây dựng
                            </Text>
                            <View style={myStyles.arrowIcon}>
                                <Text style={myStyles.grayLabel}> {this._getNamXayDungValue()} </Text>
                                <TruliaIcon name={"arrow-down"}
                                            onPress={() => this._onNamXayDungPressed()}
                                            color={gui.arrowColor} size={18} />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                {this._renderNamXayDungPicker()}
            </View>
        );
    }

    _renderPhongNgu() {
        let {loaiNhaDat} = this.props.postAds;

        if (loaiNhaDat && [1,2,3,4].indexOf(loaiNhaDat)>=0){
            return this._renderSegment(
                "Số phòng ngủ",
                DanhMuc.getAdsSoPhongNguValues(),
                this.props.postAds.soPhongNguSelectedIdx,
                this._onSegmentChanged.bind(this, 'soPhongNguSelectedIdx'),
                this.props.postAds.soPhongNguText, "soPhongNguText",
                (key, value) => this._onSegmentTextChanged(key, value));
        } else
            return;


    }

    _renderPhongTam() {
        let {loaiNhaDat} = this.props.postAds;

        if (loaiNhaDat && [1,2,3,4].indexOf(loaiNhaDat)>=0) {
            return this._renderSegment(
                "Số phòng tắm",
                DanhMuc.getAdsSoPhongTamValues(),
                this.props.postAds.soNhaTamSelectedIdx,
                this._onSegmentChanged.bind(this, 'soNhaTamSelectedIdx'),
                this.props.postAds.soNhaTamText, "soNhaTamText",
                (key, value) => this._onSegmentTextChanged(key, value));
        } else
            return;
    }

    _renderSoTang() {
        let {loaiTin, loaiNhaDat} = this.props.postAds;

        if ((loaiNhaDat && [2,3,4].indexOf(loaiNhaDat)>=0 && loaiTin=='ban')
             || (loaiNhaDat && [2,3,4,5,6].indexOf(loaiNhaDat)>=0 && loaiTin=='thue')
            ) {
            return this._renderSegment(
                "Số tầng",
                DanhMuc.getAdsSoTangValues(),
                this.props.postAds.soTangSelectedIdx,
                this._onSegmentChanged.bind(this, 'soTangSelectedIdx'),
                this.props.postAds.soTangText, "soTangText",
                (key, value) => this._onSegmentTextChanged(key, value));
        } else
            return;
    }

    _renderBanDo() {
        return (
            <View style={[{ paddingTop: 9, marginBottom: 7 }, myStyles.headerSeparator]}>
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onBanDoPressed()}>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>
                            Bản đồ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getBanDoValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderDiaChi() {
        return (
            <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onDiaChiPressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Địa chỉ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getDiaChiValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderDuAn() {
        return (
            <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onDuAnPressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Thuộc dự án
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getDuAnValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderHuongNha() {
        return (
            <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onHuongNhaPressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Hướng nhà
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getHuongNhaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderDuongTruocNha() {
        let {loaiNhaDat} = this.props.postAds;

        if (loaiNhaDat && [2,3,4,5,6,7,8,99].indexOf(loaiNhaDat)>=0) {
            return (
                <View>
                    <FullLine style={{marginLeft:17}} />
                    <View style={[myStyles.imgList, myStyles.headerSeparator, { marginLeft: 17, paddingLeft: 0 }]}>
                        <Text style={myStyles.label}>Đường trước nhà (m)</Text>
                        <TextInput
                        ref='duongTruocNha'
                        secureTextEntry={false}
                        keyboardType={'numeric'}
                        style={myStyles.input}
                        value={this.props.postAds.duongTruocNha ? this.props.postAds.duongTruocNha.toString() : ''}
                        onChangeText={(text) => this._onNumberValueChange("duongTruocNha", text)}
                        />
                    </View>
                </View>
            );
        } else
            return;
    }

    _renderMoreButton() {
        if (this.state.showMoreContent) {
            return (
                <View>
                    {this._renderCategoryTitle('THÔNG TIN KHÁC')}
                    <FullLine/>

                    {this._renderMatTien()}

                    {this._renderDuongTruocNha()}

                    {this._renderNamXayDung()}

                    {this._renderNhaMoiXay()}

                    {this._renderNhaLoGoc()}

                    {this._renderOtoDoCua()}

                    {this._renderNhaKinhDoanhDuoc()}

                    {this._renderNoiThatDayDu()}

                    {this._renderChinhChuDangTin()}
                    <FullLine />
                </View>
            )
        } else {
            return (
                <View>
                    {this._renderCategoryTitle('')}
                    <FullLine/>
                    <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, paddingLeft: 0 }]} >
                        <TouchableOpacity
                            disabled = {!this.isUploading.bind(this)}
                            onPress={() => this._onMoreButtonPressed()}>
                            <View style={[myStyles.imgList, { justifyContent: 'center' }]} >
                                <Text style={[myStyles.label, { color: gui.mainColor }]}>
                                    Mở rộng
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FullLine/>
                </View>
            );
        }
    }
    _renderResetButton() {
        return (
            <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 15, paddingLeft: 0 }]} >
                <TouchableOpacity
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onResetButtonPressed()}>
                    <View style={[myStyles.imgList, { justifyContent: 'center' }]} >
                        <Text style={[myStyles.label, { color: '#ff0000' }]}>
                            Thiết lập lại
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderNhaMoiXay() {
        let {loaiTin, loaiNhaDat} = this.props.postAds;

        if  ( (loaiTin=='ban' && loaiNhaDat && [1,2,3,4,7,8].indexOf(loaiNhaDat)>=0)
              || loaiTin=='thue'
            ){
            return (
                <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, paddingLeft: 0 }]}>
                    <TouchableHighlight
                        disabled={!this.isUploading.bind(this)}
                        onPress={() => this._onNhaXayMoiPressed()}>
                        <View style={[myStyles.imgList]}>
                            <Text style={myStyles.label}>
                                Nhà mới xây
                            </Text>
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"}
                                            onPress={() => this._onNhaXayMoiPressed()}
                                            color={this.props.postAds.nhaMoiXay ? gui.mainColor : gui.arrowColor}
                                            size={18}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        } else
            return;
    }

    _renderNhaLoGoc() {
        let {loaiTin, loaiNhaDat} = this.props.postAds;

        if  ((loaiTin=='ban' && loaiNhaDat && [1,2,3,4].indexOf(loaiNhaDat)>=0)
              || (loaiTin=='thue' && loaiNhaDat && [1,2,3,4,5,6].indexOf(loaiNhaDat)>=0)
            ){
            return (
                <View>
                    <FullLine style={{marginLeft:17}} />
                    <View
                        style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]}>
                        <TouchableHighlight
                        disabled={!this.isUploading.bind(this)}
                        onPress={() => this._onNhaLoGocPressed()}>
                        <View style={[myStyles.imgList, { paddingLeft: 0 }]}>
                            <Text style={myStyles.label}>
                                Nhà lô góc
                            </Text>
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"}
                                            onPress={() => this._onNhaLoGocPressed()}
                                            color={this.props.postAds.nhaLoGoc ? gui.mainColor : gui.arrowColor}
                                            size={18}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    </View>
                </View>
            );
        } else
            return;
    }

    _renderOtoDoCua() {
        let {loaiTin, loaiNhaDat} = this.props.postAds;

        if  ((loaiTin=='ban' && loaiNhaDat && [2,3,4,5,6,7,8,99].indexOf(loaiNhaDat)>=0)
             || (loaiTin=='thue' && loaiNhaDat && [2,3,4,5,6,7,99].indexOf(loaiNhaDat)>=0)
            ) {
            return (
                <View>
                    <FullLine style={{marginLeft:17}} />
                    <View
                        style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]}>
                        <TouchableHighlight
                        disabled={!this.isUploading.bind(this)}
                        onPress={() => this._onOtoDoCuaPressed()}>
                        <View style={[myStyles.imgList, { paddingLeft: 0 }]}>
                            <Text style={myStyles.label}>
                                Ôtô đỗ cửa
                            </Text>
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"}
                                            onPress={() => this._onOtoDoCuaPressed()}
                                            color={this.props.postAds.otoDoCua ? gui.mainColor : gui.arrowColor}
                                            size={18}/>
                            </View>
                        </View>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        } else
            return;
    }

    _renderNhaKinhDoanhDuoc() {
        return (
            <View>
                <FullLine style={{marginLeft:17}} />
                <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                    <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onNhaKinhDoanhDuocPressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Nhà kinh doanh được
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress={() => this._onNhaKinhDoanhDuocPressed()}
                                        color={this.props.postAds.nhaKinhDoanhDuoc ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
    _renderNoiThatDayDu() {
        let {loaiTin, loaiNhaDat} = this.props.postAds;

        if  ((loaiTin=='ban' && loaiNhaDat && [1,2,3,4].indexOf(loaiNhaDat)>=0)
            || (loaiTin=='thue' && loaiNhaDat && [1,2,3,4].indexOf(loaiNhaDat)>=0)
        ) {
            return (
                <View>
                    <FullLine style={{marginLeft:17}} />
                    <View
                        style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]}>
                        <TouchableHighlight
                        disabled={!this.isUploading.bind(this)}
                        onPress={() => this._onNoiThatDayDuPressed()}>
                        <View style={[myStyles.imgList, { paddingLeft: 0 }]}>
                            <Text style={myStyles.label}>
                                Nội thất đầy đủ
                            </Text>
                            <View style={myStyles.arrowIcon}>
                                <TruliaIcon name={"check"}
                                            onPress={() => this._onNoiThatDayDuPressed()}
                                            color={this.props.postAds.noiThatDayDu ? gui.mainColor : gui.arrowColor}
                                            size={18}/>
                            </View>
                        </View>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        } else
            return;
    }
    _renderChinhChuDangTin() {
        return (
            <View>
                <FullLine style={{marginLeft:17}} />
                <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                    <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onChinhChuDangTinPressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Chính chủ đăng tin
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress={() => this._onChinhChuDangTinPressed()}
                                        color={this.props.postAds.chinhChuDangTin ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    _renderGia() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator]} >
                <Text style={myStyles.label}>Giá (triệu)</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.gia ? this.props.postAds.gia.toString() : ''}
                    onChangeText={(text) => this.onValueChange("gia", text)}
                    onFocus={() => this.setState({ editGia: true })}
                />
            </View>
        );
    }

    _renderLienHe() {
        return (
            <View style={[myStyles.headerSeparator, { paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0 }]} >
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onLienHePressed()}>
                    <View style={[myStyles.imgList, { paddingLeft: 0 }]} >
                        <Text style={myStyles.label}>
                            Liên hệ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getLienHeValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderChiTiet() {
        return (
            <View style={[{ paddingTop: 9, marginBottom: 7 }, myStyles.headerSeparator]} >
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onChiTietPressed()}>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>
                            Chi tiết
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getChiTietValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
    _renderButtonNav() {
        return (
            <View style={myStyles.searchButton}>
                <View style={myStyles.searchListButton}>
                    <Button onPress={this.onCancel.bind(this)}
                            style={myStyles.buttonText}>Thoát</Button>
                    {this._renderPostAdsButton()}
                </View>
            </View>
        );
    }

    _renderPostAdsButton(){
        if (this.props.postAds.uploading) {
            return (
                <View style={{marginLeft: 17, marginRight: 17, marginTop: 10, marginBottom: 10,}}>
                    <GiftedSpinner color="white" />
                </View>
            )
        } else {
            return (
                <View>
                    <Button onPress={this.onPostAds.bind(this)}
                            disabled={!this.isUploading.bind(this)}
                            style={myStyles.buttonText}>{this.state.adsID ? 'Cập nhật' : 'Đăng tin'}</Button>
                </View>
            )
        }
    }

    _renderNamXayDungPicker() {
        var {showNamXayDung, initNamXayDung, inputNamXayDung} = this.state;
        if (showNamXayDung) {
            let pickerRange = this._initDanhMucNam(100);
            let inputPlaceholder = '';
            let onTextChange = this._onNamXayDungInputChange.bind(this);
            let onTextFocus = this._onScrollNamXayDung.bind(this);
            let pickerSelectedValue = initNamXayDung;
            let onPickerValueChange = this._onNamXayDungChanged.bind(this);
            let val2Display = this._namXayDungVal2Display.bind(this);
            let onPress = this._onPressNamXayDungHandle.bind(this);
            let inputLabel = '';
            return <PickerExt2 pickerRange={pickerRange} val2Display={val2Display} inputPlaceholder={inputPlaceholder}
                               inputValue={String(inputNamXayDung || '')} onTextChange={onTextChange} onTextFocus={onTextFocus}
                               pickerSelectedValue={pickerSelectedValue} onPickerValueChange={onPickerValueChange}
                               onPress={onPress} inputLabel={inputLabel} />
        }
    }
    _renderLoadingView() {
        if (this.props.postAds.uploading) {
            return (<View style={myStyles.resultContainer}>
                <View style={myStyles.loadingContent}>
                    <GiftedSpinner color="black" />
                </View>
            </View>)
        }
    }

    _initDanhMucNam(numberOfYear) {
        let latestYear = parseInt(moment().format("YYYY"), 10);
        let yearRange = []

        for (var i = latestYear; i > latestYear - numberOfYear; i--) {
            yearRange.push(i.toString());
        }
        yearRange.unshift('Bất kỳ');
        return yearRange;
    }

    _onNamXayDungInputChange(value) {
        value = (isNaN(parseInt(value))) ? undefined : value;
        this.onValueChange('namXayDung', value);
        this.setState({ inputNamXayDung: value });
    }

    _onScrollNamXayDung() {
        var scrollTo = Dimensions.get('window').height / 2 - 238;
        this._scrollView.scrollTo({ y: scrollTo });
    }

    _onNamXayDungChanged(pickedValue) {
        let value = pickedValue;
        value = (isNaN(parseInt(value))) ? undefined : value;
        this.onValueChange('namXayDung', value);
        this.setState({ initNamXayDung: value, inputNamXayDung: value });
    }

    _namXayDungVal2Display(namXayDung) {
        return namXayDung;
    }

    _onNamXayDungPressed() {
        var {showNamXayDung} = this.state;
        this.setState({ showNamXayDung: !showNamXayDung });
        /*if (!showNamXayDung) {
         this._onScrollNamXayDung();
         }*/
    }

    _onPressNamXayDungHandle() {
        var {showNamXayDung} = this.state;
        this.setState({ showNamXayDung: !showNamXayDung });
        if (!showNamXayDung) {
            this._onScrollNamXayDung();
        }
    }

    _getNamXayDungValue() {
        var {namXayDung} = this.props.postAds;
        return namXayDung || '';
    }

    _onResetButtonPressed() {
        console.log("Press _onResetButton");
        this.setState({ showMoreContent: false });
        this.onRefreshPostAds();
    }

    _onMoreButtonPressed() {
        console.log("Press _onMoreButton");
        this.setState({ showMoreContent: true });
    }

    _onLoaiNhaPressed() {
        Actions.PropertyTypes({ func: 'postAds' });
    }

    _onHuongNhaPressed() {
        Actions.MHuongNha({ func: 'postAds' });
    }

    _onDuAnPressed() {
        Actions.DuAn();
    }

    _getLoaiNhaValue() {
        var {loaiTin, loaiNhaDat} = this.props.postAds;
        return DanhMuc.getLoaiNhaDatForDisplay(loaiTin, loaiNhaDat);
    }

    _getLoaiNhaValue() {
        var {loaiTin, loaiNhaDat} = this.props.postAds;
        return DanhMuc.getLoaiNhaDatForDisplay(loaiTin, loaiNhaDat);
    }

    _getHuongNhaValue() {
        var {huongNha} = this.props.postAds;
        return DanhMuc.getHuongNhaForDisplay(huongNha);
    }

    _getDuAnValue() {
        var {selectedDuAn} = this.props.postAds;
        return selectedDuAn ? selectedDuAn.placeName : '';
    }

    _onNhaXayMoiPressed() {
        let nhaMoiXay = this.props.postAds.nhaMoiXay;
        this.props.actions.onPostAdsFieldChange('nhaMoiXay', !nhaMoiXay);
    }

    _onNhaLoGocPressed() {
        let nhaLoGoc = this.props.postAds.nhaLoGoc;
        this.props.actions.onPostAdsFieldChange('nhaLoGoc', !nhaLoGoc);
    }

    _onOtoDoCuaPressed() {
        let otoDoCua = this.props.postAds.otoDoCua;
        this.props.actions.onPostAdsFieldChange('otoDoCua', !otoDoCua);
    }

    _onNhaKinhDoanhDuocPressed() {
        let nhaKinhDoanhDuoc = this.props.postAds.nhaKinhDoanhDuoc;
        this.props.actions.onPostAdsFieldChange('nhaKinhDoanhDuoc', !nhaKinhDoanhDuoc);
    }

    _onNoiThatDayDuPressed() {
        let noiThatDayDu = this.props.postAds.noiThatDayDu;
        this.props.actions.onPostAdsFieldChange('noiThatDayDu', !noiThatDayDu);
    }

    _onChinhChuDangTinPressed() {
        let chinhChuDangTin = this.props.postAds.chinhChuDangTin;
        this.props.actions.onPostAdsFieldChange('chinhChuDangTin', !chinhChuDangTin);
    }

    _onBanDoPressed() {
        let {geo} = this.props.postAds.place;
        Actions.MMapView({ showSuggestionPosition: true, onPress: this._onDiaChinhSelected.bind(this), location: geo });
    }

    _onDiaChinhSelected(position) {
        let diaChinhDto = JSON.parse(JSON.stringify(position.diaChinh));

        // remove diaChinh co dau
        diaChinhDto.tinh = undefined;
        diaChinhDto.huyen = undefined;
        diaChinhDto.xa = undefined;

        this.props.actions.getDiaChinhFromGoogleData(diaChinhDto);

        var {place} = this.props.postAds;
        place.geo = position.location;
        place.diaChinh.tinh = position.diaChinh.tinh;
        place.diaChinh.huyen = position.diaChinh.huyen;
        place.diaChinh.xa = position.diaChinh.xa;

        this.props.actions.onPostAdsFieldChange('place', place);

        let diaChinhFullName = placeUtil.getDiaChinhFullName(position);

        this.setState({ diaChinhFullName: diaChinhFullName });

    }

    _getBanDoValue() {
        if (!this.state.diaChinhFullName || this.state.diaChinhFullName.length <= 0) {
            return "Chọn vị trí";
        } else {
            var diaChinhFullName = this.state.diaChinhFullName;
            if (this.state.diaChinhFullName.length > 30) {
                diaChinhFullName = diaChinhFullName.substring(0, 30) + '...';
            }
            return diaChinhFullName;
        }
    }

    _onNumberValueChange(stateName, text) {
        let value = text.replace(',', '.');
        this.onValueChange(stateName, value);
    }

    _onDiaChiPressed() {
        Actions.PostAdsAddress({ diaChinhFullName: this.state.diaChinhFullName, onComplete: this._onDiaChiChosed.bind(this) });
    }

    _onLienHePressed() {
        Actions.PostAdsLienHe();
    }

    _onDiaChiChosed(diaChiChiTiet){
        this.setState({diaChiChiTiet: diaChiChiTiet});
    }

    _getDiaChiValue() {
        // var {place} = this.props.postAds;
        // var diaChiChiTiet = place.diaChiChiTiet;

        var diaChiChiTiet = this.state.diaChiChiTiet;

        if (!diaChiChiTiet || diaChiChiTiet.length <= 0)
            return '';

        if (diaChiChiTiet.length > 30) {
            diaChiChiTiet = diaChiChiTiet.substring(0, 30) + '...';
        }

        return diaChiChiTiet;
    }

    _getLienHeValue() {
        var {lienHe} = this.props.postAds;

        if (!lienHe)
            return '';

        var lienHeTxt = '';
        if (lienHe.showTenLienLac && lienHe.tenLienLac && lienHe.tenLienLac.length > 0)
            lienHeTxt = lienHeTxt + lienHe.tenLienLac;
        if (lienHe.showPhone && lienHe.phone && lienHe.phone.length > 0)
            lienHeTxt = lienHeTxt + "-" + lienHe.phone;
        if (lienHe.showEmail && lienHe.email && lienHe.email.length > 0)
            lienHeTxt = lienHeTxt + "-" + lienHe.email;

        let result = lienHeTxt.substring(0, 30) + '...';

        return result;
    }


    _renderGia() {
        return (
            <View style={[{ paddingTop: 9, marginBottom: 5 }, myStyles.headerSeparator]}>
                <TouchableHighlight
                    disabled = {!this.isUploading.bind(this)}
                    onPress={() => this._onGiaPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Giá
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.grayLabel}> {this._getGiaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    _onGiaPressed() {
        this.setState({ editGia: true });
        Actions.PostAdsPrice();
    }

    _getGiaValue() {
        var {gia, donViTien} = this.props.postAds;
        return DanhMuc.getGiaForDisplay(gia, donViTien);
    }

    _onSegmentTextChanged(key, val) {
        let maxValue = 7;

        this.onValueChange(key, val);
        if (isNaN(val) || val == '') {
            val = (maxValue + 1).toString();
        }
        var value = Number(val) > maxValue ? -1 : Number(val) - 1;
        if (key == 'soTangText') {
            this.onValueChange('soTangSelectedIdx', value);
        }
        else if (key == 'soPhongNguText') {
            this.onValueChange('soPhongNguSelectedIdx', value);
        }
        else {
            this.onValueChange('soNhaTamSelectedIdx', value);
        }
    }

    _onSegmentChanged(key, event) {
        var index = event.nativeEvent.selectedSegmentIndex;
        this.onValueChange(key, index);
        var value = '';
        if (key == 'soTangSelectedIdx') {
            value = DanhMuc.getAdsSoTangByIndex(index);
            this.onValueChange('soTangText', value);
        }
        else if (key == 'soPhongNguSelectedIdx') {
            value = DanhMuc.getAdsSoPhongByIndex(index);
            this.onValueChange('soPhongNguText', value);
        }
        else {
            value = DanhMuc.getAdsSoPhongTamByIndex(index);
            this.onValueChange('soNhaTamText', value);
        }
    }

    _renderSegment(label, values, selectedIndexAttribute, onChange, textValue, textField, onTextChange) {
        return (
            <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                              onChange={onChange}
                              textValue={textValue ? textValue.toString() : ''}
                              textField={textField}
                              onTextChange={onTextChange} placeholder={"Khác"} />
        );
    }

    _onChiTietPressed() {
        Actions.PostAdsTitle();
    }

    _getChiTietValue() {
        let {chiTiet} = this.props.postAds;
        if (!chiTiet) {
            return '';
        }

        let index = chiTiet.indexOf('\n');
        let val = index >= 0 ? chiTiet.substring(0, index) : chiTiet;
        if (val.length > 30) {
            return val.substring(0, 30) + '...';
        } else if (val.length != chiTiet.length) {
            return val + '...';
        }
        return chiTiet;

    }

    onValueChange(key: string, value: string) {
        this.props.actions.onPostAdsFieldChange(key, value);
    }

    onPostAds() {
        var {photos} = this.props.postAds;
        errorMessage = '';
        uploadFiles = [];
        for (var i = 0; i < photos.length; i++) {
            var filepath = photos[i].uri;
            if (filepath == '') {
                continue;
            }

            uploadFiles.push({ filepath: filepath });
        }
        if (!this.isValidInputData()) {
            log.info(errorMessage);
            Alert.alert('Thông báo', errorMessage);
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
            return;
        }

        this.props.actions.onPostAdsFieldChange("uploading", true);

        count = 0;
        const userID = this.props.global.currentUser.userID;
        for (var i = 0; i < uploadFiles.length; i++) {
            if (errorMessage != '') {
                Alert.alert('Thông báo', errorMessage);
                this.props.actions.onPostAdsFieldChange('error', errorMessage);
                return;
            }
            var filepath = uploadFiles[i].filepath;
            ImageResizer.createResizedImage(filepath, 745, 510, 'JPEG', 85, 0, null).then((resizedImageUri) => {
                var ms = moment().toDate().getTime();
                var filename = 'Ads_' + userID + '_' + ms + resizedImageUri.substring(resizedImageUri.lastIndexOf('.'));
                this.props.actions.onUploadImage(filename, resizedImageUri, this.uploadCallBack.bind(this));
            }).catch((err) => {
                this.props.actions.onPostAdsFieldChange("uploading", false);
                log.error(err);
            });
        }
    }

    isValidInputData() {
        var errors = '';
        if (uploadFiles.length === 0) {
            errors += ' (ảnh)';
        }
        var {loaiNhaDat, place, gia, dienTich, matTien
            , soTangText, soPhongNguText, soNhaTamText} = this.props.postAds;
        if (loaiNhaDat == '' || loaiNhaDat === 0) {
            errors += ' (loại nhà)';
        }
        if (place.geo.lat == '' || place.geo.lon == '') {
            errors += ' (vị trí trên bản đồ)';
        }
        if (place.diaChi == '') {
            errors += ' (địa chỉ)';
        }
        if (!dienTich) {
            errors += ' (diện tích)';
        }
        if (errors != '') {
            errorMessage = 'Bạn chưa chọn' + errors + '!';
            return false;
        }
        if (gia && isNaN(gia)) {
            errors += ' (giá)';
        }
        if (dienTich && isNaN(dienTich)) {
            errors += ' (diện tích)';
        }
        if (matTien && isNaN(matTien)) {
            errors += ' (mặt tiền)';
        }
        if (soTangText && isNaN(soTangText)) {
            errors += ' (số tầng)';
        }
        if (soPhongNguText && isNaN(soPhongNguText)) {
            errors += ' (số phòng ngủ)';
        }
        if (soNhaTamText && isNaN(soNhaTamText)) {
            errors += ' (số phòng tắm)';
        }
        if (errors != '') {
            errorMessage = 'Sai kiểu giá trị:' + errors + '!';
            return false;
        }
        return true;
    }

    uploadCallBack = function (err, result) {
        var {data} = result;
        if (err || data == '') {
            errorMessage = 'Upload ảnh không thành công!';
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
            this.props.actions.onPostAdsFieldChange("uploading", false);
            return;
        }
        var {success, file} = JSON.parse(data);
        if (success) {
            var {url} = file;
            this.state.uploadUrls.push(url);
            count++;
            if (count == uploadFiles.length) {
                this.onSaveAds();
            }
        } else {
            errorMessage = 'Upload ảnh không thành công!';
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
            this.props.actions.onPostAdsFieldChange("uploading", false);
        }
    }

    onSaveAds() {
        var {uploadUrls} = this.state;
        var {id, loaiTin, loaiNhaDat, gia, donViTien, dienTich, matTien, namXayDung,
            soTangText, soPhongNguText, soNhaTamText, chiTiet, huongNha, duongTruocNha,
            place, selectedDiaChinh, selectedDuAn, lienHe} = this.props.postAds;

        var {nhaMoiXay, nhaLoGoc, otoDoCua, nhaKinhDoanhDuoc, noiThatDayDu, chinhChuDangTin} = this.state;

        var imageUrls = [];
        uploadUrls.map(function (uploadUrl) {
            imageUrls.push(rootUrl + uploadUrl);
        });
        var image = { cover: '', images: [] };
        if (imageUrls.length > 0) {
            image.cover = imageUrls[0];
            imageUrls.shift();
            image.images = imageUrls;
        }

        var loaiTinVal = (loaiTin === 'ban') ? 0 : 1;

        var currentUser = this.props.global.currentUser;
        var token = currentUser.token;
        var dangBoi = {
            "email": currentUser.email,
            "name": currentUser.fullName,
            "phone": currentUser.phone,
            "userID": currentUser.userID
        };

        // remove lienHe if no information
        if (lienHe
            && (!lienHe.tenLienLac || lienHe.tenLienLac.length <= 0)
            && (!lienHe.phone || lienHe.phone.length <= 0)
            && (!lienHe.email || lienHe.phone.length <= 0))
            lienHe = undefined;

        //remove placeId
        place.placeId = undefined;
        place.diaChiFullName = undefined;
        place.duAn = undefined;
        place.duAnFullName = undefined;

        place.diaChi = place.diaChiChiTiet + ", " + this.state.diaChinhFullName
        if (selectedDiaChinh) {
            place.diaChinh.codeTinh = selectedDiaChinh.tinh || undefined;
            place.diaChinh.codeHuyen = selectedDiaChinh.huyen || undefined;
            place.diaChinh.codeXa = selectedDiaChinh.xa || undefined;
            place.diaChinh.tinhKhongDau = undefined;
            place.diaChinh.huyenKhongDau = undefined;
            place.diaChinh.xaKhongDau = undefined;
        }

        if (selectedDuAn) {
            place.diaChinh.codeDuAn = selectedDuAn.duAn || undefined;
            place.diaChinh.duAn = selectedDuAn.placeName || undefined;
        }

        var phongNgu = soPhongNguText != '' ? soPhongNguText : undefined;
        var soTang = soTangText != '' ? soTangText : undefined;
        var phongTam = soNhaTamText != '' ? soNhaTamText : undefined;
        var giaBan = Number(DanhMuc.calculateGia(gia, donViTien, dienTich));
        var giaM2 = 0;
        if (giaBan && dienTich) {
            giaM2 = Number((giaBan / dienTich).toFixed(3));
        }

        var ngayDangTin = moment().format('YYYYMMDD');

        var adsDto = {
            "id": id || undefined,
            "image": image,
            "loaiTin": loaiTinVal,
            "loaiNhaDat": loaiNhaDat,
            "dienTich": dienTich || -1,
            "matTien": matTien || undefined,
            "namXayDung": namXayDung || undefined,
            "soPhongNgu": phongNgu,
            "soPhongTam": phongTam,
            "soTang": soTang,
            "place": place,
            "huongNha": huongNha || -1,
            "duongTruocNha": duongTruocNha,
            "nhaMoiXay": nhaMoiXay,
            "nhaLoGoc": nhaLoGoc,
            "otoDoCua": otoDoCua,
            "nhaKinhDoanhDuoc": nhaKinhDoanhDuoc,
            "noiThatDayDu": noiThatDayDu,
            "chinhChu": chinhChuDangTin,
            "chiTiet": chiTiet || undefined,
            "gia": giaBan || -1,
            "giaM2": giaM2 || -1,
            "ngayDangTin": ngayDangTin || undefined,
            "lienHe": lienHe,
            "dangBoi": dangBoi
        };

        this.props.actions.postAds(adsDto, token)
            .then(res => {
                this.setState({
                    loading: false
                });

                if (res.status == 1) {
                    Alert.alert(res.err.message);
                } else {
                    let adsID = this.state.adsID;
                    this.onRefreshPostAds();
                    if (adsID && adsID.length > 0) {
                        Alert.alert("Thay đổi thành công");
                        Actions.pop();
                    } else {
                        Alert.alert("Đăng tin thành công");
                        this.props.actions.onAdsMgmtFieldChange('activeTab', loaiTinVal == 0 ? 1 : 2);
                        Actions.popTo('root');
                        Actions.AdsMgmt();
                    }
                }
            });
    }

    postAdsCallBack(adsID) {
        // Actions.SearchResultDetail({adsID: adsID, source: 'local'});
        this.onRefreshPostAds();
        Actions.Home();
    }

    isUploading(){
        return this.props.postAds.uploading;
    }

    onRefreshPostAds() {
        this.onValueChange("photos", [{ uri: '' }]);
        this.onValueChange("loaiTin", 'ban');
        this.onValueChange("loaiNhaDat", '');
        this.onValueChange("soPhongNguSelectedIdx", -1);
        this.onValueChange("soTangSelectedIdx", -1);
        this.onValueChange("soNhaTamSelectedIdx", -1);
        this.onValueChange("soPhongNguText", '');
        this.onValueChange("soTangText", '');
        this.onValueChange("soNhaTamText", '');
        this.onValueChange("dienTich", null);
        this.onValueChange("gia", null);
        this.onValueChange("matTien", null);
        this.onValueChange("namXayDung", null);
        this.onValueChange("huongNha", -1);
        this.onValueChange("duongTruocNha", null);
        this.onValueChange("nhaMoiXay", null);
        this.onValueChange("nhaLoGoc", null);
        this.onValueChange("otoDoCua", null);
        this.onValueChange("nhaKinhDoanhDuoc", null);
        this.onValueChange("noiThatDayDu", null);
        this.onValueChange("chinhChuDangTin", null);
        this.onValueChange("id", null);

        this.onValueChange("place", {
            duAn: '',
            duAnFullName: '',
            placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
            diaChiChiTiet: '',
            diaChi: '',
            diaChinh: {
                tinh: 'Hanoi',
                huyen: '',
                xa: '',
                duAn: '',
                tinhKhongDau: 'ha-noi',
                huyenKhongDau: '',
                xaKhongDau: '',
                codeTinh: '',
                codeHuyen: '',
                codeXa: '',
                codeDuAn: ''
            },
            geo: { lat: '', lon: '' }
        });
        this.onValueChange("lienHe", {
            tenLienLac: null,
            showTenLienLac: true,
            phone: null,
            showPhone: true,
            email: null,
            showEmail: true,
        });
        this.onValueChange("selectedDiaChinh", null);
        this.onValueChange("selectedDuAn", null);
        this.onValueChange("duAnList", null);
        this.onValueChange("chiTiet", '');
        this.onValueChange("error", '');

        this.state = {
            uploadUrls: [],
            chiTietExpanded: true,
            toggleState: false,
            editGia: false,
            showNamXayDung: false,
            initNamXayDung: '',
            inputNamXayDung: '',
            namXayDung: null,
            diaChinhFullName: '',
            adsID: null,
            showMoreContent: false
        }
    }

    onCancel() {
        Alert.alert('', 'Bạn muốn ngừng đăng tin ?',
            [   { text: 'Thoát', onPress: () => console.log('Cancel Pressed!') },
                {
                    text: 'Đồng ý', onPress: () => {
                        if (this.state.adsID && this.state.adsID.length > 0) {
                            // back to AdsMgmt if update Ads
                            this.onRefreshPostAds();
                            Actions.popTo('root');
                        } else {
                            this.onRefreshPostAds();
                            Actions.Home({ type: 'reset' });
                        }
                    }
                }
            ]);
    }

    onTakePhoto(imageIndex) {
        Actions.PostAds({ photos: this.props.postAds.photos, imageIndex: imageIndex });
    }

    onDeletePhoto(imageIndex){
        var {photos} = this.props.postAds;
        photos.splice(imageIndex, 1);
        this.setState({deletedPhoto: imageIndex});
        this.props.actions.onPostAdsFieldChange('photos', photos);
    }
}

class ImageItem extends React.Component {
    constructor(props) {
        super(props);
    }

    _onPhotoPressed(){
        this.props.onTakePhoto(`${this.props.imageIndex}`);
    }

    _onDeletePhoto(){
        this.props.onDeletePhoto(`${this.props.imageIndex}`);
    }

    _renderCoverTitle(){
        if (this.props.imageIndex ==0)
        return (
            <View style={myStyles.coverContent}>
                <Text style={myStyles.coverText}>
                Ảnh bìa
                </Text>
            </View>
        )
    }

    _renderDeleteButton(){
        if (this.props.imageIndex !=0)
            return (
                <TouchableOpacity
                    style={myStyles.deleteContent}
                    onPress={this._onDeletePhoto.bind(this)} >

                    <View style={myStyles.deleteButton}>
                        <RelandIcon name="close" color={'black'}
                                    mainProps={myStyles.captureIcon}
                                    size={10} textProps={{ paddingLeft: 0 }}
                                    noAction={true}
                        />
                    </View>
                </TouchableOpacity>
            )
    }

    render() {
        var photo = this.props.photo;

        if (photo && photo.uri) {
            return (
                <TouchableOpacity onPress={this._onPhotoPressed.bind(this)} >
                    <Image style={myStyles.imgItem} source={photo} >
                        {this._renderDeleteButton()}
                        {this._renderCoverTitle()}
                    </Image>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={this._onPhotoPressed.bind(this)} >
                    <View style={[myStyles.imgItem, { borderStyle: 'dashed', borderColor: gui.mainColor, borderWidth:1 }]}>
                        <RelandIcon name="plus" color={gui.mainColor}
                                    mainProps={myStyles.captureIcon}
                                    size={22} textProps={{ paddingLeft: 0 }}
                                    noAction={true}
                                    />
                        {this._renderCoverTitle()}
                    </View>
                </TouchableOpacity>
            );
        }

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
    arrowIcon: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingRight: 4
    },
    headerSeparator: {
        marginTop: 0,
        borderTopWidth: 0,
        borderTopColor: gui.separatorLine
    },
    imgList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 17,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    mimgList: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: 12,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    imgItem: {
        width: (width - 50) / 4,
        height: (width - 50) / 4,
        backgroundColor: "white",
        justifyContent: 'center',
        borderWidth: 0,
        marginLeft: 5,
        borderColor: gui.separatorLine,
    },
    captureIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        padding: 4,
        paddingRight: 10,
        height: 30,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        width: 80,
        textAlign: 'right',
        alignSelf: 'center'
    },
    label: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily
    },
    grayLabel: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        color: '#BBBBBB',
        paddingRight: 3
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        margin: 15
    },
    buttonText: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight: 'normal'
    },
    searchListButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        backgroundColor: gui.mainColor,
        height: 44
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0

    },
    categoryTitle: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingRight: 8,
        paddingLeft: 17,
        paddingTop: 12,
        paddingBottom: 5,
        borderTopWidth: 0,
        borderTopColor: '#f8f8f8',
        backgroundColor: '#f8f8f8'
    },
    categoryText: {
        fontSize: 12,
        fontFamily: gui.fontFamily,
        color: '#606060',
        justifyContent: 'space-between',
        padding: 0,
        borderTopWidth: 0,
        borderTopColor: gui.separatorLine
    },
    scrollView: {
        backgroundColor: 'white'
    },
    picker: {
        margin: 5,
        width: 200
    },
    picker2: {
        margin: 5,
        marginLeft: 20,
        marginRight: 15,
        width: Dimensions.get('window').width - 35
    },
    loadingContent: {
        position: 'absolute',
        top: -23,
        left: width / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resultContainer: {
        position: 'absolute',
        top: height / 2,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginVertical: 0,
        marginBottom: 0,
        backgroundColor: 'transparent'
    },
    deleteContent: {
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 0.5,
        top: 2,
        right: 2,
        alignSelf: 'auto'
    },
    deleteButton: {
        alignItems: 'center'
    },
    coverContent: {
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 0.8,
        bottom: 2,
        left: 2,
        alignSelf: 'auto'
    },
    coverText: {
        alignItems: 'center',
        fontFamily: gui.fontFamily,
        fontSize: 12
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(NPostAdsDetail);

