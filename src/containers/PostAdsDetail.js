'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, StatusBar, TextInput, Image, Dimensions, ScrollView, Picker, TouchableHighlight, Alert } from 'react-native'

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../lib/logUtil";
import gui from "../lib/gui";

import CommonHeader from '../components/CommonHeader';

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';

import DanhMuc from '../assets/DanhMuc';

import LikeTabButton from '../components/LikeTabButton';

import SegmentedControl from '../components/SegmentedControl';

import dbService from "../lib/localDB";

import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000`;

const Item = Picker.Item;

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

var count = 0;
var uploadFiles = [];
var errorMessage = '';


class PostAdsDetail extends Component {


    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');
        errorMessage = this.props.postAds.error;
        this.state = {
            uploadUrls: [],
            chiTietExpanded: true
        }
    }

    componentWillMount() {
        this.onValueChange('photos', this.props.photos);
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
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    render() {
        var _scrollView: ScrollView;
        return (
            <View myStyles={myStyles.container}>
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    automaticallyAdjustContentInsets={false}
                    vertical={true}
                    style={myStyles.scrollView}
                    //onScroll={this.handleScroll.bind(this)}
                    //scrollEventThrottle={1}
                >
                    {this._renderPhoto()}
                    {this._renderLoaiTin()}

                    <View style={myStyles.searchSectionTitle}>
                        <Text style={myStyles.cacDieuKienText}>
                            ĐẶC ĐIỂM
                        </Text>
                    </View>

                    {this._renderLoaiNha()}
                    {this._renderDienTich()}
                    {this._renderPhongNgu()}
                    {this._renderPhongTam()}
                    {this._renderSoTang()}

                    <View style={[myStyles.searchSectionTitle, myStyles.headerSeparator]}>
                        <Text style={myStyles.cacDieuKienText}>
                            VỊ TRÍ
                        </Text>
                    </View>

                    {this._renderBanDo()}
                    {this._renderDiaChi()}

                    <View style={[myStyles.searchSectionTitle, myStyles.headerSeparator]}>
                        <Text style={myStyles.cacDieuKienText}>
                            GIÁ
                        </Text>
                    </View>

                    {this._renderGia()}

                    <View style={[myStyles.searchSectionTitle, myStyles.headerSeparator]}>
                        <Text style={myStyles.cacDieuKienText}>
                            THÔNG TIN CHI TIẾT
                        </Text>
                    </View>

                    {this._renderChiTiet()}
                    <Text style={[myStyles.label, {marginTop: 9, marginLeft: 15, color: 'red'}]}>
                        {this.props.postAds.error}</Text>
                </ScrollView>
                <View style={myStyles.searchButton}>
                    <View style={myStyles.searchListButton}>
                        <Button onPress={this.onCancel.bind(this)}
                                style={myStyles.buttonText}>Thoát</Button>
                        <Button onPress={this.onPostAds.bind(this)}
                                style={myStyles.buttonText}>Đăng tin</Button>
                    </View>
                </View>
            </View>
        )
    }

    _renderPhoto() {
        return (
            <View style={[myStyles.imgList, {marginTop: 30, paddingLeft: 10}]} >
                {this._renderPhotoItem(0)}
                {this._renderPhotoItem(1)}
                {this._renderPhotoItem(2)}
                {this._renderPhotoItem(3)}
            </View>
        );
    }

    _renderPhotoItem(imageIndex) {
        var {photos} = this.props.postAds;
        var photo = photos[imageIndex];

        if (photo.uri) {
            return (
                <TouchableHighlight onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <Image style={myStyles.imgItem} source={photo}/>
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight onPress={() => this.onTakePhoto(`${imageIndex}`)} >
                    <View style={[myStyles.imgItem, {borderStyle: 'dashed'}]}/>
                </TouchableHighlight>
            );
        }
    }

    _renderLoaiTin() {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style = {{flex:1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
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
            <View style={[{paddingTop: 9, marginBottom: 5}, myStyles.headerSeparator]}>
                <TouchableHighlight
                    onPress={() => this._onLoaiNhaPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Loại nhà
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getLoaiNhaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _onLoaiNhaPressed() {
        Actions.PropertyTypes({func: 'postAds'});
    }

    _getLoaiNhaValue() {
        var {loaiTin, loaiNhaDat} = this.props.postAds;
        return DanhMuc.getLoaiNhaDatForDisplay(loaiTin, loaiNhaDat);
    }

    _renderBanDo() {
        return (
            <View style={[{paddingTop: 9, marginBottom: 7}, myStyles.headerSeparator]}>
                <TouchableHighlight
                    onPress={() => this._onBanDoPressed()}>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>
                            Bản đồ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getBanDoValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _onBanDoPressed() {
        Actions.PostAdsMapView();
    }

    _getBanDoValue() {
        var {place} = this.props.postAds;
        var tinh = place.diaChinh.tinh;
        var huyen = place.diaChinh.huyen;
        var xa = place.diaChinh.xa;
        if (!xa) {
            return "Chọn vị trí";
        } else {
            var diaChinhFullName = xa + ', ' + huyen + ', ' + tinh;
            if (diaChinhFullName.length > 30) {
                diaChinhFullName = diaChinhFullName.substring(0,30) + '...';
            }
            return diaChinhFullName;
        }
    }

    _renderDiaChi() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onDiaChiPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Địa chỉ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getDiaChiValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _onDiaChiPressed() {
        Actions.PostAdsAddress();
    }

    _getDiaChiValue() {
        var {place} = this.props.postAds;
        var diaChi = place.diaChi;
        if (diaChi.length > 30) {
            diaChi = diaChi.substring(0,30) + '...';
        }
        return diaChi;
    }

    _renderGia() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator]} >
                <Text style={myStyles.label}>Giá (triệu)</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.props.postAds.gia}
                    onChangeText={(text) => this.onValueChange("gia", text)}
                />
            </View>
        );
    }

    _renderDienTich() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Diện tích (m²)</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.props.postAds.dienTich}
                    onChangeText={(text) => this.onValueChange("dienTich", text)}
                />
            </View>
        );
    }

    _renderSoTang() {
        return this._renderSegment("Số tầng", DanhMuc.getSoTangValues(),
            this.props.postAds.soTangSelectedIdx, this._onSegmentChanged.bind(this, 'soTangSelectedIdx'));
    }

    _renderPhongNgu() {
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.props.postAds.soPhongNguSelectedIdx, this._onSegmentChanged.bind(this, 'soPhongNguSelectedIdx'));
    }

    _renderPhongTam() {
        return this._renderSegment("Số phòng tắm", DanhMuc.getSoPhongTamValues(),
            this.props.postAds.soNhaTamSelectedIdx, this._onSegmentChanged.bind(this, 'soNhaTamSelectedIdx'));
    }

    _onSegmentChanged(key, event) {
        console.log(key, event.nativeEvent.selectedSegmentIndex);
        this.onValueChange(key, event.nativeEvent.selectedSegmentIndex);
    }

    _renderSegment(label, values, selectedIndexAttribute, onChange) {
        return (
            <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                              onChange={onChange} />
        );
    }

    _renderChiTiet() {
        return (
            <View style={[{paddingTop: 9, marginBottom: 7}, myStyles.headerSeparator]} >
                <TouchableHighlight
                    onPress={() => this._onChiTietPressed()}>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>
                            Chi tiết
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getChiTietValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _onChiTietPressed() {
        Actions.PostAdsTitle();
    }

    _getChiTietValue() {
        var {chiTiet} = this.props.postAds;
        if (chiTiet.length > 30) {
            return chiTiet.substring(0,30) + '...';
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
        for(var i=0; i<photos.length; i++) {
            var filepath = photos[i].uri;
            if (filepath == '') {
                continue;
            }
            var filename = filepath.substring(filepath.lastIndexOf('/')+1);
            uploadFiles.push({filename: filename, filepath: filepath});
        }
        log.info("errorMessage" + errorMessage);
        if (!this.isValidInputData()) {
            log.info(errorMessage);
            Alert.alert(
                'Thông báo',
                errorMessage
            );
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
            return;
        }
        count = 0;
        for(var i=0; i<uploadFiles.length; i++) {
            if (errorMessage != '') {
                Alert.alert(
                    'Thông báo',
                    errorMessage
                );
                this.props.actions.onPostAdsFieldChange('error', errorMessage);
                return;
            }
            var filename = uploadFiles[i].filename;
            var filepath = uploadFiles[i].filepath;
            this.props.actions.onUploadImage(filename, filepath, this.uploadCallBack.bind(this));
        }
    }

    isValidInputData() {
        var errors = '';
        if (uploadFiles.length === 0) {
            errors += ' (ảnh)';
        }
        var {loaiNhaDat, place, gia, dienTich} = this.props.postAds;
        if (loaiNhaDat == '' || loaiNhaDat === 0) {
            errors += ' (loại nhà)';
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
        return true;
    }

    uploadCallBack = function (err, result) {
        var {data} = result;
        if (err || data == '') {
            errorMessage = 'Upload ảnh không thành công!';
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
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
        }
    }

    onSaveAds() {
        var {uploadUrls} = this.state;
        var {loaiTin, loaiNhaDat, gia, dienTich, soTangSelectedIdx, soPhongNguSelectedIdx, soNhaTamSelectedIdx, chiTiet, place} = this.props.postAds;
        var imageUrls = [];
        uploadUrls.map(function (uploadUrl) {
            imageUrls.push(rootUrl + uploadUrl);
        });
        var tenLoaiNhaDat = this._getLoaiNhaValue();
        var loaiTinVal = (loaiTin === 'ban') ? 0 : 1;
        var tenLoaiTin = DanhMuc.LoaiTin[loaiTinVal];
        var currentUser = this.props.global.currentUser;
        var dangBoi = {
            "email": currentUser.email,
            "name": currentUser.fullName,
            "phone": currentUser.phone,
            "userID": currentUser.userID
        };
        var phongNgu = DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx);
        phongNgu = phongNgu ? phongNgu : null;
        var soTang = DanhMuc.getSoTangByIndex(soTangSelectedIdx);
        soTang = soTang ? soTang : null;
        var phongTam = DanhMuc.getSoPhongTamByIndex(soNhaTamSelectedIdx);
        phongTam = phongTam ? phongTam : null;
        dbService._createAds({loaiTin: loaiTinVal, loaiNha: loaiNhaDat, place: place, gia: gia,
            dienTich: dienTich, soTang: soTang, phongNgu: phongNgu, phongTam: phongTam, chiTiet: chiTiet,
            uploadUrls: imageUrls, userID: currentUser.userID, tenLoaiNhaDat: tenLoaiNhaDat,
            tenLoaiTin: tenLoaiTin, dangBoi: dangBoi}, this.createAdsCallBack.bind(this));
    }

    createAdsCallBack(adsID) {
        // Actions.SearchResultDetail({adsID: adsID, source: 'local'});
        this.onRefreshPostAds();
        Actions.Home();
    }

    onRefreshPostAds() {
        this.onValueChange("photos", [{uri: ''},{uri: ''},{uri: ''},{uri: ''}]);
        this.onValueChange("loaiTin", 'ban');
        this.onValueChange("loaiNhaDat", '');
        this.onValueChange("soPhongNguSelectedIdx", 0);
        this.onValueChange("soTangSelectedIdx", 0);
        this.onValueChange("soNhaTamSelectedIdx", 0);
        this.onValueChange("dienTich", null);
        this.onValueChange("gia", null);
        this.onValueChange("place", {
            duAn: '',
            duAnFullName: '',
            placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
            diaChi: '',
            diaChiFullName: "Hanoi",
            diaChinh: {
                tinh: 'Hanoi',
                huyen: '',
                xa: '',
                tinhKhongDau: 'Hanoi',
                huyenKhongDau: '',
                xaKhongDau: ''
            },
            geo: {lat: '', lon: ''}
        });
        this.onValueChange("chiTiet", '');
        this.onValueChange("error", '');
    }

    onCancel() {
        Actions.Home();
    }

    onTakePhoto(imageIndex) {
        Actions.PostAds({photos: this.props.postAds.photos, imageIndex: imageIndex});
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
        borderTopWidth: 1,
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
    imgItem: {
        width: 90,
        height: 90,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: gui.separatorLine
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        padding: 4,
        paddingRight: 10,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        width: 80,
        textAlign: 'right',
        alignSelf: 'center'
    },
    textArea: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        padding: 4,
        height: 80,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        marginLeft: 20,
        marginRight: 15,
        width: Dimensions.get('window').width-35,
        alignSelf: 'center'
    },
    label: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily
    },
    label2: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        paddingLeft: 17
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
        fontWeight : 'normal'
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
        justifyContent: 'flex-end'
    },
    searchSectionTitle: {
        flexDirection : "row",
        //borderWidth:1,
        //borderColor: "red",
        justifyContent :'space-between',
        paddingRight: 8,
        paddingLeft: 17,
        paddingTop: 12,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#f8f8f8',
        backgroundColor: '#f8f8f8'
    },
    cacDieuKienText: {
        fontSize: 12,
        fontFamily: gui.fontFamily,
        color: '#606060',
        justifyContent :'space-between',
        padding: 0,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    scrollView: {
        height: Dimensions.get('window').height-44,
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
        width: Dimensions.get('window').width-35
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsDetail);

