'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, StatusBar, TextInput, Image, Dimensions, ScrollView, Picker, TouchableHighlight, Alert } from 'react-native'

import KeyboardSpacer from 'react-native-keyboard-spacer';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import CommonHeader from '../CommonHeader';

import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import DanhMuc from '../../assets/DanhMuc';

import LikeTabButton from '../LikeTabButton';

import SegmentedControl from '../SegmentedControl2';

import dbService from "../../lib/localDB";

import ImageResizer from 'react-native-image-resizer';

import moment from 'moment';

import dismissKeyboard from 'react-native-dismiss-keyboard';

import cfg from "../../cfg";

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
        StatusBar.setBarStyle('light-content');
        errorMessage = this.props.postAds.error;
        this.state = {
            uploadUrls: [],
            chiTietExpanded: true,
            toggleState: false,
            editGia: false
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
        var {toggleState} = this.state;
        var scrollHeight = toggleState ? Dimensions.get('window').height-290 :
            Dimensions.get('window').height-64;
        return (
            <View myStyles={myStyles.container}>
                <View style={{paddingTop: 24, backgroundColor: gui.mainColor}} />
                <ScrollView
                    ref={(scrollView) => { this._scrollView = scrollView; }}
                    automaticallyAdjustContentInsets={false}
                    vertical={true}
                    style={[myStyles.scrollView, {height: scrollHeight}]}
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
                {this.state.toggleState ? <Button onPress={() => dismissKeyboard()}
                        style={[myStyles.buttonText, {textAlign: 'right', color: gui.mainColor}]}>Xong</Button> : null}
                <KeyboardSpacer onToggle={(toggleState) => this.onKeyboardToggle.bind(this, toggleState)}/>
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

    onKeyboardToggle(toggleState) {
        this.setState({toggleState: toggleState});
        if (this.state.editGia) {
            var scrollTo = toggleState ? (Dimensions.get('window').height-64)/2 :
            (Dimensions.get('window').height-64)/2-226;
            this._scrollView.scrollTo({y: scrollTo});
        } else {
            this._scrollView.scrollTo({y: 0});
        }
    }

    _renderPhoto() {
        return (
            <View style={[myStyles.imgList, {marginTop: 19, marginBottom: 10, paddingLeft: 17, paddingRight: 15}]} >
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
                    <View style={[myStyles.imgItem, {borderStyle: 'dashed', borderColor: gui.mainColor}]}>
                        <RelandIcon name="plus" color={gui.mainColor}
                                    mainProps={myStyles.captureIcon}
                                    size={22} textProps={{paddingLeft: 0}}
                                    onPress={() => this.onTakePhoto(`${imageIndex}`)} />
                    </View>
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
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.gia}
                    onChangeText={(text) => this.onValueChange("gia", text)}
                    onFocus={() => this.setState({editGia: true})}
                />
            </View>
        );
    }

    _renderGia() {
        return (
            <View style={[{paddingTop: 9, marginBottom: 5}, myStyles.headerSeparator]}>
                <TouchableHighlight
                    onPress={() => this._onGiaPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Giá
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getGiaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _onGiaPressed() {
        this.setState({editGia: true});
        Actions.PostAdsPrice();
    }

    _getGiaValue() {
        var {gia, donViTien} = this.props.postAds;
        return DanhMuc.getGiaForDisplay(gia, donViTien);
    }

    _renderDienTich() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Diện tích (m²)</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.dienTich}
                    onChangeText={(text) => this.onValueChange("dienTich", text)}
                    onFocus={() => this.setState({editGia: false})}
                />
            </View>
        );
    }

    _renderSoTang() {
        return this._renderSegment("Số tầng", DanhMuc.getAdsSoTangValues(),
            this.props.postAds.soTangSelectedIdx, this._onSegmentChanged.bind(this, 'soTangSelectedIdx'),
            this.props.postAds.soTangText, "soTangText", () => {});
    }

    _renderPhongNgu() {
        return this._renderSegment("Số phòng ngủ", DanhMuc.getAdsSoPhongNguValues(),
            this.props.postAds.soPhongNguSelectedIdx, this._onSegmentChanged.bind(this, 'soPhongNguSelectedIdx'),
            this.props.postAds.soPhongNguText, "soPhongNguText", () => {});
    }

    _renderPhongTam() {
        return this._renderSegment("Số phòng tắm", DanhMuc.getAdsSoPhongTamValues(),
            this.props.postAds.soNhaTamSelectedIdx, this._onSegmentChanged.bind(this, 'soNhaTamSelectedIdx'),
            this.props.postAds.soNhaTamText, "soNhaTamText", () => {});
    }

    _onSegmentChanged(key, event) {
        var index = event.nativeEvent.selectedSegmentIndex;
        this.onValueChange(key, index);
        // var value = '';
        // if (key == 'soTangSelectedIdx') {
        //     value = DanhMuc.getAdsSoTangByIndex(index);
        //     this.onValueChange('soTangText', value);
        // }
        // else if (key == 'soPhongNguSelectedIdx') {
        //     value = DanhMuc.getAdsSoPhongByIndex(index);
        //     this.onValueChange('soPhongNguText', value);
        // }
        // else {
        //     value = DanhMuc.getAdsSoPhongTamByIndex(index);
        //     this.onValueChange('soNhaTamText', value);
        // }
    }

    _renderSegment(label, values, selectedIndexAttribute, onChange, textValue, textField, onTextChange) {
        return (
            <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                              onChange={onChange} textValue={textValue} textField={textField}
                              onTextChange={onTextChange} placeholder={"Khác"}/>
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
        let {chiTiet} = this.props.postAds;
        let index = chiTiet.indexOf('\n');
        let val = index >= 0 ? chiTiet.substring(0, index) : chiTiet;
        if (val.length > 30) {
            return val.substring(0,30) + '...';
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
        for(var i=0; i<photos.length; i++) {
            var filepath = photos[i].uri;
            if (filepath == '') {
                continue;
            }
            //var filename = filepath.substring(filepath.lastIndexOf('/')+1);
            // var shortname = filepath.substring(filepath.indexOf('id=')+3, filepath.indexOf('&'));
            // var ext = filepath.substring(filepath.indexOf('ext=')+4);
            // var filename = shortname + '.' + ext;
            uploadFiles.push({filepath: filepath});
        }
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
        const userID = this.props.global.currentUser.userID;
        for(var i=0; i<uploadFiles.length; i++) {
            if (errorMessage != '') {
                Alert.alert(
                    'Thông báo',
                    errorMessage
                );
                this.props.actions.onPostAdsFieldChange('error', errorMessage);
                return;
            }
            var filepath = uploadFiles[i].filepath;
            ImageResizer.createResizedImage(filepath, 745, 510, 'JPEG', 85, 0, null).then((resizedImageUri) => {
                var ms = moment().toDate().getTime();
                var filename = 'Ads_' + userID + '_' + ms + resizedImageUri.substring(resizedImageUri.lastIndexOf('.'));
                this.props.actions.onUploadImage(filename, resizedImageUri, this.uploadCallBack.bind(this));
            }).catch((err) => {
                log.error(err);
            });
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
        var {loaiTin, loaiNhaDat, gia, donViTien, dienTich, soTangText, soPhongNguText, soNhaTamText, chiTiet, place} = this.props.postAds;
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
        var phongNgu = soPhongNguText != '' ? soPhongNguText : undefined;
        var soTang = soTangText != '' ? soTangText : undefined;
        var phongTam = soNhaTamText != '' ? soNhaTamText : undefined;
        var giaBan = DanhMuc.calculateGia(gia, donViTien, dienTich);
        dbService._createAds({loaiTin: loaiTinVal, loaiNha: loaiNhaDat,
            place: place, gia: Number(giaBan),
            dienTich: Number(dienTich), soTang: soTang,
            phongNgu: phongNgu, phongTam: phongTam, chiTiet: chiTiet || undefined,
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
        this.onValueChange("soPhongNguSelectedIdx", null);
        this.onValueChange("soTangSelectedIdx", null);
        this.onValueChange("soNhaTamSelectedIdx", null);
        this.onValueChange("soPhongNguText", '');
        this.onValueChange("soTangText", '');
        this.onValueChange("soNhaTamText", '');
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
        width: 85,
        height: 90,
        backgroundColor: "white",
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: gui.separatorLine
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

