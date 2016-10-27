'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, StatusBar, TextInput, Image,
    Dimensions, ScrollView, Picker, TouchableHighlight, Alert } from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";

import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import DanhMuc from '../../assets/DanhMuc';

import LikeTabButton from '../LikeTabButton';

import SegmentedControl from '../SegmentedControl2';

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
            editGia: false,
            nhaXayMoi: false,
            nhaLoGoc: false,
            otoDoCua: false,
            nhaKinhDoanhDuoc: false,
            noiThatDayDu: false,
            chinhChuDangTin: false
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
            Dimensions.get('window').height-74;
        return (
            <View myStyles={myStyles.container}>
                <View style={{paddingTop: 30, backgroundColor: gui.mainColor}} />
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

                    <View style={myStyles.categoryTitle}>
                        <Text style={myStyles.categoryText}>
                            ĐẶC ĐIỂM
                        </Text>
                    </View>

                    {this._renderLoaiNha()}
                    {this._renderDienTich()}
                    {this._renderMatTien()}
                    {this._renderNamXayDung()}
                    {this._renderPhongNgu()}
                    {this._renderPhongTam()}
                    {this._renderSoTang()}

                    {this._renderCategoryTitle('VỊ TRÍ')}

                    {this._renderBanDo()}
                    {this._renderDiaChi()}
                    {this._renderDuAn()}
                    {this._renderHuongNha()}
                    {this._renderDuongTruocNha()}

                    {this._renderCategoryTitle('THÔNG TIN KHÁC')}
                    {this._renderNhaMoiXay()}
                    {this._renderNhaLoGoc()}
                    {this._renderOtoDoCua()}
                    {this._renderNhaKinhDoanhDuoc()}
                    {this._renderNoiThatDayDu()}
                    {this._renderChinhChuDangTin()}

                    {this._renderCategoryTitle('GIÁ VÀ LIÊN HỆ')}

                    {this._renderGia()}
                    {this._renderLienHe()}

                    {this._renderCategoryTitle('THÔNG TIN CHI TIẾT')}

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

    _renderCategoryTitle(title){
        return (
            <View style={[myStyles.categoryTitle, myStyles.headerSeparator]}>
                <Text style={myStyles.categoryText}>
                    {title}
                </Text>
            </View>
        );
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

        if (photo && photo.uri) {
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

    _renderMatTien() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Mặt tiền (m)</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.matTien}
                    onChangeText={(text) => this.onValueChange("matTien", text)}
                    onFocus={() => this.setState({editGia: false})}
                />
            </View>
        );
    }

    _renderNamXayDung() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Năm xây dựng</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.namXayDung}
                    onChangeText={(text) => this.onValueChange("namXayDung", text)}
                    onFocus={() => this.setState({editGia: false})}
                />
            </View>
        );
    }

    _renderPhongNgu() {
        return this._renderSegment(
            "Số phòng ngủ",
            DanhMuc.getAdsSoPhongNguValues(),
            this.props.postAds.soPhongNguSelectedIdx,
            this._onSegmentChanged.bind(this, 'soPhongNguSelectedIdx'),
            this.props.postAds.soPhongNguText, "soPhongNguText",
            (key, value) => this._onSegmentTextChanged(key, value));
    }

    _renderPhongTam() {
        return this._renderSegment(
            "Số phòng tắm",
            DanhMuc.getAdsSoPhongTamValues(),
            this.props.postAds.soNhaTamSelectedIdx,
            this._onSegmentChanged.bind(this, 'soNhaTamSelectedIdx'),
            this.props.postAds.soNhaTamText, "soNhaTamText",
            (key, value) => this._onSegmentTextChanged(key, value));
    }

    _renderSoTang() {
        return this._renderSegment(
            "Số tầng",
            DanhMuc.getAdsSoTangValues(),
            this.props.postAds.soTangSelectedIdx,
            this._onSegmentChanged.bind(this, 'soTangSelectedIdx'),
            this.props.postAds.soTangText, "soTangText",
            (key, value) => this._onSegmentTextChanged(key, value));
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

    _renderDuAn() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onDuAnPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Thuộc dự án
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getDuAnValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderHuongNha() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onHuongNhaPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Hướng nhà
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getHuongNhaValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderDuongTruocNha() {
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Đường trước nhà</Text>
                <TextInput
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.duongTruocNha}
                    onChangeText={(text) => this.onValueChange("duongTruocNha", text)}
                    onFocus={() => this.setState({editGia: false})}
                />
            </View>
        );
    }

    _renderNhaMoiXay() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onNhaXayMoiPressed()}>
                    <View style={[myStyles.imgList]} >
                        <Text style={myStyles.label}>
                            Nhà mới xây
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onNhaXayMoiPressed()}
                                        color={this.state.nhaXayMoi ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderNhaLoGoc() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onNhaLoGocPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Nhà lô góc
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onNhaLoGocPressed()}
                                        color={this.state.nhaLoGoc ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderOtoDoCua() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onOtoDoCuaPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Ôtô đỗ cửa
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onOtoDoCuaPressed()}
                                        color={this.state.otoDoCua ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderNhaKinhDoanhDuoc() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onNhaKinhDoanhDuocPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Nhà kinh doanh được
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onNhaKinhDoanhDuocPressed()}
                                        color={this.state.nhaKinhDoanhDuoc ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
    _renderNoiThatDayDu() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onNoiThatDayDuPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Nội thất đầy đủ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onNoiThatDayDuPressed()}
                                        color={this.state.noiThatDayDu ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
    _renderChinhChuDangTin() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onChinhChuDangTinPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Chính chủ đăng tin
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <TruliaIcon name={"check"}
                                        onPress = {() => this._onChinhChuDangTinPressed()}
                                        color={this.state.chinhChuDangTin ? gui.mainColor : gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
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
                    value={this.props.postAds.gia}
                    onChangeText={(text) => this.onValueChange("gia", text)}
                    onFocus={() => this.setState({editGia: true})}
                />
            </View>
        );
    }

    _renderLienHe() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onLienHePressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
                        <Text style={myStyles.label}>
                            Liên hệ
                        </Text>
                        <View style={myStyles.arrowIcon}>
                            <Text style={myStyles.label}> {this._getLienHeValue()} </Text>
                            <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
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

    _onLoaiNhaPressed() {
        Actions.PropertyTypes({func: 'postAds'});
    }

    _onHuongNhaPressed() {
        Actions.MHuongNha({func: 'postAds'});
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

    _onNhaXayMoiPressed(){
        let nhaXayMoi = this.state.nhaXayMoi;
        this.setState({nhaXayMoi: !nhaXayMoi});
    }

    _onNhaLoGocPressed(){
        let nhaLoGoc = this.state.nhaLoGoc;
        this.setState({nhaLoGoc: !nhaLoGoc});
    }

    _onOtoDoCuaPressed(){
        let otoDoCua = this.state.otoDoCua;
        this.setState({otoDoCua: !otoDoCua});
    }

    _onNhaKinhDoanhDuocPressed(){
        let nhaKinhDoanhDuoc = this.state.nhaKinhDoanhDuoc;
        this.setState({nhaKinhDoanhDuoc: !nhaKinhDoanhDuoc});
    }

    _onNoiThatDayDuPressed(){
        let noiThatDayDu = this.state.noiThatDayDu;
        this.setState({noiThatDayDu: !noiThatDayDu});
    }

    _onChinhChuDangTinPressed(){
        let chinhChuDangTin = this.state.chinhChuDangTin;
        this.setState({chinhChuDangTin: !chinhChuDangTin});
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

    _onDiaChiPressed() {
        Actions.PostAdsAddress();
    }

    _onLienHePressed() {
        Actions.PostAdsLienHe();
    }

    _getDiaChiValue() {
        var {place} = this.props.postAds;
        var diaChi = place.diaChi;
        if (diaChi.length > 30) {
            diaChi = diaChi.substring(0,30) + '...';
        }
        return diaChi;
    }

    _getLienHeValue(){
        var {lienHe} = this.props.postAds;
        var lienHeTxt = '';
        if (lienHe.tenLienLac && lienHe.tenLienLac.length >0)
            lienHeTxt = lienHeTxt + lienHe.tenLienLac;
        if (lienHe.phone && lienHe.phone.length >0)
            lienHeTxt = lienHeTxt + "-" + lienHe.phone;
        return lienHeTxt;
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

    _onSegmentTextChanged(key, val) {
        this.onValueChange(key, val);
        if (isNaN(val) || val == '') {
            return;
        }
        var value = Number(val) > 7 ? -1 : Number(val)-1;
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
                              onChange={onChange} textValue={textValue} textField={textField}
                              onTextChange={onTextChange} placeholder={"Khác"}/>
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

            uploadFiles.push({filepath: filepath});
        }
        if (!this.isValidInputData()) {
            log.info(errorMessage);
            Alert.alert('Thông báo', errorMessage);
            this.props.actions.onPostAdsFieldChange('error', errorMessage);
            return;
        }
        count = 0;
        const userID = this.props.global.currentUser.userID;
        for(var i=0; i<uploadFiles.length; i++) {
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
                log.error(err);
            });
        }
    }

    isValidInputData() {
        var errors = '';
        if (uploadFiles.length === 0) {
            errors += ' (ảnh)';
        }
        var {loaiNhaDat, place, gia, dienTich, matTien, namXayDung
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
        if (namXayDung && isNaN(namXayDung)) {
            errors += ' (năm xây dựng)';
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
        var {loaiTin, loaiNhaDat, gia, donViTien, dienTich, matTien, namXayDung,
            soTangText, soPhongNguText, soNhaTamText, chiTiet, huongNha, duongTruocNha,
            place, selectedDiaChinh, selectedDuAn, lienHe} = this.props.postAds;

        var {nhaMoiXay, nhaLoGoc, otoDoCua, nhaKinhDoanhDuoc, noiThatDayDu, chinhChuDangTin} = this.state;

        var imageUrls = [];
        uploadUrls.map(function (uploadUrl) {
            imageUrls.push(rootUrl + uploadUrl);
        });
        var image = {cover: '', images: []};
        if (imageUrls.length > 0) {
            image.cover = imageUrls[0];
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
        if ((!lienHe.tenLienLac || lienHe.tenLienLac.length <=0)
            && (!lienHe.phone || lienHe.phone.length <=0)
            && (!lienHe.email || lienHe.phone.length <=0))
            lienHe = undefined;

        //remove placeId
        place.placeId = undefined;

        place.diaChi = place.diaChiFullName;
        place.diaChiFullName = undefined;
        place.duAn = undefined;
        place.duAnFullName = undefined;

        if(selectedDiaChinh){
            place.diaChinh.codeTinh = selectedDiaChinh.tinh || undefined;
            place.diaChinh.codeHuyen = selectedDiaChinh.huyen || undefined;
            place.diaChinh.codeXa = selectedDiaChinh.xa || undefined;
            place.diaChinh.tinhKhongDau = undefined;
            place.diaChinh.huyenKhongDau = undefined;
            place.diaChinh.xaKhongDau = undefined;
        }

        if(selectedDuAn){
            place.diaChinh.codeDuAn = selectedDiaChinh.duAn || undefined;
            place.diaChinh.duAn = selectedDiaChinh.placeName || undefined;
        }

        var phongNgu = soPhongNguText != '' ? soPhongNguText : undefined;
        var soTang = soTangText != '' ? soTangText : undefined;
        var phongTam = soNhaTamText != '' ? soNhaTamText : undefined;
        var giaBan = Number(DanhMuc.calculateGia(gia, donViTien, dienTich));
        var giaM2 = 0;
        if (giaBan && dienTich) {
            giaM2 = Number((giaBan/dienTich).toFixed(3));
        }

        var ngayDangTin = moment().format('YYYYMMDD');

        var adsDto = {
            "image"             : image,
            "loaiTin"           : loaiTinVal,
            "loaiNhaDat"        : loaiNhaDat,
            "dienTich"          : dienTich||-1,
            "matTien"           : matTien||-1,
            "namXayDung"        : namXayDung||-1,
            "soPhongNgu"        : phongNgu,
            "soPhongTam"        : phongTam,
            "soTang"            : soTang,
            "place"             : place,
            "huongNha"          : huongNha||-1,
            "duongTruocNha"     : duongTruocNha,
            "nhaMoiXay"         : nhaMoiXay,
            "nhaLoGoc"          : nhaLoGoc,
            "otoDoCua"          : otoDoCua,
            "nhaKinhDoanhDuoc"  : nhaKinhDoanhDuoc,
            "noiThatDayDu"      : noiThatDayDu,
            "chinhChu"          : chinhChuDangTin,
            "chiTiet"           : chiTiet || undefined,
            "gia"               : giaBan||-1,
            "giaM2"             : giaM2||-1,
            "ngayDangTin"       : ngayDangTin||undefined,
            "lienHe"            : lienHe,
            "dangBoi"           : dangBoi
        };

        this.props.actions.postAds(adsDto, token)
            .then(res=>{
                this.setState({
                    loading: false
                });

                if (res.status==1) {
                    Alert.alert(res.err.message);
                } else {
                    Alert.alert("Đăng ký bất động sản thành công");
                    this.onRefreshPostAds();
                }
            });
    }

    postAdsCallBack(adsID) {
        // Actions.SearchResultDetail({adsID: adsID, source: 'local'});
        this.onRefreshPostAds();
        Actions.Home();
    }

    onRefreshPostAds() {
        this.onValueChange("photos", [{uri: ''},{uri: ''},{uri: ''},{uri: ''}]);
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
                duAn: '',
                tinhKhongDau: 'Hanoi',
                huyenKhongDau: '',
                xaKhongDau: '',
                codeTinh: '',
                codeHuyen: '',
                codeXa: '',
                codeDuAn: ''
            },
            geo: {lat: '', lon: ''}
        });
        this.onValueChange("lienHe", {
            tenLienLac: null,
            showTenLienLac: false,
            phone: null,
            showPhone: false,
            email: null,
            showEmail: false,
        });
        this.onValueChange("selectedDiaChinh", null);
        this.onValueChange("selectedDuAn", null);
        this.onValueChange("duAnList", null);
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
    categoryTitle: {
        flexDirection : "row",
        justifyContent :'space-between',
        paddingRight: 8,
        paddingLeft: 17,
        paddingTop: 12,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#f8f8f8',
        backgroundColor: '#f8f8f8'
    },
    categoryText: {
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

