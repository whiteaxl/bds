'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, StatusBar, TextInput, Image, UIManager, Dimensions,
    ScrollView, Picker, TouchableHighlight, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

import PickerExt2 from '../picker/PickerExt2';

import GiftedSpinner from 'react-native-gifted-spinner';

import moment from 'moment';

import dismissKeyboard from 'react-native-dismiss-keyboard';

import cfg from "../../cfg";

var rootUrl = `http://${cfg.server}:5000`;

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

class PostAdsDetail extends Component {

    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        errorMessage = this.props.postAds.error;
        let adsID = props.postAds.id;

        this.state = {
            uploadUrls: [],
            chiTietExpanded: true,
            toggleState: false,
            editGia: false,
            showNamXayDung: false,
            initNamXayDung: '',
            inputNamXayDung: '',
            namXayDung: null,
            adsID: adsID,
            showMoreContent: false
        }
    }

    componentWillMount() {
        let { place, photos} = this.props.postAds

        console.log("================ mount photos");
        console.log(photos);
        console.log("================ mount photos end");

        if (place && place.geo && place.geo.lat && place.geo.lon)
            return;

        this.getAdsLocation(photos);
    }

    getAdsLocation(photos){
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
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    render() {
        var {toggleState} = this.state;
        var scrollHeight = toggleState ? Dimensions.get('window').height-290 :
            Dimensions.get('window').height-74;

        return (
            <View myStyles={myStyles.container}>
                <View style={{paddingTop: 25, backgroundColor: gui.mainColor}} />

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
                    {this._renderPhongNgu()}
                    {this._renderPhongTam()}
                    {this._renderSoTang()}

                    {this._renderCategoryTitle('VỊ TRÍ')}
                    {this._renderBanDo()}
                    {this._renderDiaChi()}
                    {this._renderDuAn()}
                    {this._renderHuongNha()}

                    {this._renderCategoryTitle('GIÁ VÀ LIÊN HỆ')}
                    {this._renderGia()}
                    {this._renderLienHe()}

                    {this._renderCategoryTitle('THÔNG TIN CHI TIẾT')}
                    {this._renderChiTiet()}


                    {this._renderMoreButton()}

                    {this._renderCategoryTitle('')}
                    {this._renderResetButton()}


                    <View style={{borderTopColor:'lightgray', borderTopWidth: 1}}></View>
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
                                style={myStyles.buttonText}>{ this.state.adsID ? 'Cập nhật' : 'Đăng tin'}</Button>
                    </View>
                </View>
                {this._renderLoadingView()}
            </View>
        )
    }

    onKeyboardToggle(toggleState) {
        this.setState({toggleState: toggleState});
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
        var {photos} = this.props.postAds;
        let numOfPhoto = photos.length;
        let indexArr = [];
        for (var i=0; i<= photos.length; i++ ){
            if (i< 8){
                indexArr.push(i)
            }
        }
        return (
            <View>
                <View style={[myStyles.mimgList, {marginTop: 10, marginBottom: 5, paddingLeft: 17, paddingRight: 15}]} >
                    {indexArr.map( (e) => { if (e<4) return this._renderPhotoItem(e)})}
                </View>
                <View style={[myStyles.mimgList, {marginTop: numOfPhoto>=4 ? 5 : 0, marginBottom: numOfPhoto>=4 ? 10 : 0, paddingLeft: 17, paddingRight: 15}]} >
                    {indexArr.map( (e) => { if (e>=4) return this._renderPhotoItem(e)})}
                </View>
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
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
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
        return (

            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Mặt tiền (m)</Text>
                <TextInput ref="matTien"
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.matTien ? this.props.postAds.matTien.toString() : ''}
                    onChangeText={(text) => this._onNumberValueChange("matTien", text)}
                    onFocus={this.scrolldown.bind(this,'matTien')}
                />
            </View>

        );
    }

    scrolldown(ref) {
        const self = this;
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            if (windowHeight/py < 1.65){
                this._scrollView.scrollTo({y: py + 40});
            }

        });
    }

    _renderNamXayDung() {
        return (
            <View>
                <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                    <TouchableHighlight onPress={() => this._onNamXayDungPressed()}>
                        <View style={[myStyles.imgList, {paddingLeft: 0}]} >
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
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onDiaChiPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
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
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onDuAnPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
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
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, marginLeft: 17, paddingLeft: 0}]} >
                <TouchableHighlight
                    onPress={() => this._onHuongNhaPressed()}>
                    <View style={[myStyles.imgList, {paddingLeft: 0}]} >
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
        return (
            <View style={[myStyles.imgList, myStyles.headerSeparator, {marginLeft: 17, paddingLeft: 0}]} >
                <Text style={myStyles.label}>Đường trước nhà (m)</Text>
                <TextInput
                    ref='duongTruocNha'
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    style={myStyles.input}
                    value={this.props.postAds.duongTruocNha ? this.props.postAds.duongTruocNha.toString() : ''}
                    onChangeText={(text) => this._onNumberValueChange("duongTruocNha", text)}
                    onFocus={this.scrolldown.bind(this,'duongTruocNha')}
                />
            </View>
        );
    }

    _renderMoreButton() {
        if (this.state.showMoreContent){
            return (
                <View>
                    {this._renderCategoryTitle('THÔNG TIN KHÁC')}
                    {this._renderMatTien()}
                    {this._renderDuongTruocNha()}
                    {this._renderNamXayDung()}

                    {this._renderCategoryTitle('')}
                    {this._renderNhaMoiXay()}
                    {this._renderNhaLoGoc()}
                    {this._renderOtoDoCua()}
                    {this._renderNhaKinhDoanhDuoc()}
                    {this._renderNoiThatDayDu()}
                    {this._renderChinhChuDangTin()}
                </View>
            )
        } else {
            return (
                <View>
                    {this._renderCategoryTitle('')}
                    <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, paddingLeft: 0}]} >
                        <TouchableOpacity
                            onPress={() => this._onMoreButtonPressed()}>
                            <View style={[myStyles.imgList,{justifyContent: 'center'}]} >
                                <Text style={[myStyles.label, {color: gui.mainColor}]}>
                                    Mở rộng
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    _renderResetButton() {
        return (
            <View style={[myStyles.headerSeparator, {paddingTop: 9, marginBottom: 7, paddingLeft: 0}]} >
                <TouchableOpacity
                    onPress={() => this._onResetButtonPressed()}>
                    <View style={[myStyles.imgList,{justifyContent: 'center'}]} >
                        <Text style={[myStyles.label, {color: 'red'}]}>
                            Thiết lập lại
                        </Text>
                    </View>
                </TouchableOpacity>
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
                                        color={this.props.postAds.nhaMoiXay ? gui.mainColor : gui.arrowColor} size={18} />
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
                                        color={this.props.postAds.nhaLoGoc ? gui.mainColor : gui.arrowColor} size={18} />
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
                                        color={this.props.postAds.otoDoCua ? gui.mainColor : gui.arrowColor} size={18} />
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
                                        color={this.props.postAds.nhaKinhDoanhDuoc ? gui.mainColor : gui.arrowColor} size={18} />
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
                                        color={this.props.postAds.noiThatDayDu ? gui.mainColor : gui.arrowColor} size={18} />
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
                                        color={this.props.postAds.chinhChuDangTin ? gui.mainColor : gui.arrowColor} size={18} />
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
                    value={this.props.postAds.gia ? this.props.postAds.gia.toString() : ''}
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
            <View style={[{paddingTop: 9, marginBottom: 7}, myStyles.headerSeparator]} >
                <TouchableHighlight
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
                               inputValue={String(inputNamXayDung||'')} onTextChange={onTextChange} onTextFocus={onTextFocus}
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

    _initDanhMucNam(numberOfYear){
        let latestYear = parseInt(moment().format("YYYY"), 10);
        let yearRange = []

        for (var i=latestYear; i > latestYear-numberOfYear; i--){
            yearRange.push(i.toString());
        }
        yearRange.unshift('Bất kỳ');
        return yearRange;
    }

    _onNamXayDungInputChange(value) {
        value = (isNaN(parseInt(value))) ? undefined : value;
        this.onValueChange('namXayDung', value);
        this.setState({inputNamXayDung: value});
    }

    _onScrollNamXayDung() {
        var scrollTo = Dimensions.get('window').height/2-238;
        this._scrollView.scrollTo({y: scrollTo});
    }

    _onNamXayDungChanged(pickedValue) {
        let value = pickedValue;
        value = (isNaN(parseInt(value))) ? undefined : value;
        this.onValueChange('namXayDung', value);
        this.setState({initNamXayDung: value, inputNamXayDung: value});
    }

    _namXayDungVal2Display(namXayDung) {
        return namXayDung;
    }

    _onNamXayDungPressed(){
        var {showNamXayDung} = this.state;
        this.setState({showNamXayDung: !showNamXayDung});
        /*if (!showNamXayDung) {
            this._onScrollNamXayDung();
        }*/
    }

    _onPressNamXayDungHandle() {
        var {showNamXayDung} = this.state;
        this.setState({showNamXayDung: !showNamXayDung});
        if (!showNamXayDung) {
            this._onScrollNamXayDung();
        }
    }

    _getNamXayDungValue(){
        var {namXayDung} = this.props.postAds;
        return namXayDung||'';
    }

    _onResetButtonPressed(){
        console.log("Press _onResetButton");
        this.setState({showMoreContent: false});
        this.onRefreshPostAds();
    }

    _onMoreButtonPressed(){
        console.log("Press _onMoreButton");
        this.setState({showMoreContent: true});
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
        let nhaMoiXay = this.props.postAds.nhaMoiXay;
        this.props.actions.onPostAdsFieldChange('nhaMoiXay', !nhaMoiXay);
    }

    _onNhaLoGocPressed(){
        let nhaLoGoc = this.props.postAds.nhaLoGoc;
        this.props.actions.onPostAdsFieldChange('nhaLoGoc', !nhaLoGoc);
    }

    _onOtoDoCuaPressed(){
        let otoDoCua = this.props.postAds.otoDoCua;
        this.props.actions.onPostAdsFieldChange('otoDoCua', !otoDoCua);
    }

    _onNhaKinhDoanhDuocPressed(){
        let nhaKinhDoanhDuoc = this.props.postAds.nhaKinhDoanhDuoc;
        this.props.actions.onPostAdsFieldChange('nhaKinhDoanhDuoc', !nhaKinhDoanhDuoc);
    }

    _onNoiThatDayDuPressed(){
        let noiThatDayDu = this.props.postAds.noiThatDayDu;
        this.props.actions.onPostAdsFieldChange('noiThatDayDu', !noiThatDayDu);
    }

    _onChinhChuDangTinPressed(){
        let chinhChuDangTin = this.props.postAds.chinhChuDangTin;
        this.props.actions.onPostAdsFieldChange('chinhChuDangTin', !chinhChuDangTin);
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

    _onNumberValueChange(stateName, text){
        let value = text.replace(',','.');
        this.onValueChange(stateName, value);
    }

    _onDiaChiPressed() {
        Actions.PostAdsAddress();
    }

    _onLienHePressed() {
        Actions.PostAdsLienHe();
    }

    _getDiaChiValue() {
        var {place} = this.props.postAds;
        var diaChiChiTiet = place.diaChiChiTiet;

        if (!diaChiChiTiet || diaChiChiTiet.length <=0)
            return '';

        if (diaChiChiTiet.length > 30) {
            diaChiChiTiet = diaChiChiTiet.substring(0,30) + '...';
        }
        return diaChiChiTiet;
    }

    _getLienHeValue(){
        var {lienHe} = this.props.postAds;

        if (!lienHe)
            return '';

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
                            <Text style={myStyles.grayLabel}> {this._getGiaValue()} </Text>
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
        let maxValue = 7;

        this.onValueChange(key, val);
        if (isNaN(val) || val == '') {
            val = (maxValue+1).toString();
        }
        var value = Number(val) > maxValue ? -1 : Number(val)-1;
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
                              onTextChange={onTextChange} placeholder={"Khác"}/>
        );
    }

    _onChiTietPressed() {
        Actions.PostAdsTitle();
    }

    _getChiTietValue() {
        let {chiTiet} = this.props.postAds;
        if (!chiTiet){
            return '';
        }

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
        var {id, loaiTin, loaiNhaDat, gia, donViTien, dienTich, matTien, namXayDung,
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
            && (!lienHe.tenLienLac || lienHe.tenLienLac.length <=0)
            && (!lienHe.phone || lienHe.phone.length <=0)
            && (!lienHe.email || lienHe.phone.length <=0))
            lienHe = undefined;

        //remove placeId
        place.placeId = undefined;
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
            "id"                : id || undefined,
            "image"             : image,
            "loaiTin"           : loaiTinVal,
            "loaiNhaDat"        : loaiNhaDat,
            "dienTich"          : dienTich||-1,
            "matTien"           : matTien||undefined,
            "namXayDung"        : namXayDung||undefined,
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

                    let adsID = this.state.adsID;
                    this.onRefreshPostAds();
                    if ( adsID && adsID.length >0 ){
                        Alert.alert("Thay đổi thành công");
                        Actions.pop();
                    } else {
                        Alert.alert("Đăng tin thành công");
                        this.props.actions.onAdsMgmtFieldChange('activeTab', loaiTinVal==0 ? 1 : 2);
                        Actions.pop();
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
    mimgList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 17,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    imgItem: {
        width: (width-50)/4,
        height:(width-50)/4,
        backgroundColor: "white",
        justifyContent: 'center',
        borderWidth: 1,
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
        fontWeight : 'normal'
    },
    searchListButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        backgroundColor: gui.mainColor,
        height: 50
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
    },

    loadingContent: {
        position: 'absolute',
        top: -23,
        left: width/2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resultContainer: {
        position: 'absolute',
        top: height/2,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginVertical: 0,
        marginBottom: 0,
        backgroundColor: 'transparent'
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsDetail);

