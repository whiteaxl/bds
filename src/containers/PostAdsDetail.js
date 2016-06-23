'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

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

import UploadApi from '../lib/UploadApi';

import dbService from "../lib/localDB";

import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000`;

const Item = Picker.Item;

const actions = [
    globalActions
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


class PostAdsDetail extends Component {


    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');
        
        var {photos} = props;

        if (!photos) {
            photos = [];
            for(var i=0; i<4; i++) {
                photos.push({uri: ''});
            }
        }
        
        this.state = {
            photos: photos,
            nguoiDang: 'chu_nha',
            nguoiDangExpanded: false,
            loaiTin: 'ban',
            loaiNha: '0',
            loaiNhaExpanded: false,
            diaChi: '',
            gia: '',
            dienTich: '',
            soTang: 0,
            phongNgu: 0,
            phongTam: 0,
            chiTiet: '',
            uploadUrls: [],
            geo: {"lat": '', "lon": ''},
            errorMessage: ''
        }
    }

    componentWillMount() {
        this.getCurrentLocation();
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    "lat": position.coords.latitude,
                    "lon": position.coords.longitude
                });
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
                <CommonHeader />
                <View style={myStyles.headerSeparator} />
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
                    {this._renderLoaiNha()}
                    {this._renderDienTich()}
                    {this._renderPhongNgu()}
                    {this._renderPhongTam()}
                    {this._renderSoTang()}
                    {this._renderDiaChi()}
                    {this._renderGia()}
                    {this._renderNguoiDang()}
                    {this._renderChiTiet()}
                    <Text style={[myStyles.label, {marginTop: 9, marginLeft: 15, color: 'red'}]}>
                        {this.state.errorMessage}</Text>
                </ScrollView>
                <View style={myStyles.searchButton}>
                    <View style={myStyles.searchListButton}>
                        <RelandIcon onPress={this.onTryAgain.bind(this)} name="close" size={24} text="Làm lại"
                                    mainProps={myStyles.button} textProps={myStyles.buttonText}/>
                        <RelandIcon onPress={this.onPostAds.bind(this)} name="save" size={24} text="Đăng tin"
                                    mainProps={myStyles.button} textProps={myStyles.buttonText}/>
                    </View>
                </View>
            </View>
        )
    }

    _renderPhoto() {
        return (
            <View style={myStyles.imgList} >
                <TouchableHighlight onPress={() => this.onTakePhoto(0)} >
                    <Image style={myStyles.imgItem} source={this.state.photos[0]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(1)} >
                    <Image style={myStyles.imgItem} source={this.state.photos[1]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(2)} >
                    <Image style={myStyles.imgItem} source={this.state.photos[2]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(3)} >
                    <Image style={myStyles.imgItem} source={this.state.photos[3]}/>
                </TouchableHighlight>
            </View>
        );
    }

    _renderNguoiDang() {
        var arrowName = this.state.nguoiDangExpanded ? "arrow-down" : "arrow-right";
        return (
            <View style={{marginTop: 9, marginBottom: 5}}>
                <TouchableHighlight
                    onPress={() => this._onNguoiDangPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Người đăng
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.label}> {this._getNguoiDangValue()} </Text>
                            <TruliaIcon name={arrowName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
                {this._renderNguoiDangPicker()}
            </View>
        );
    }

    _renderNguoiDangPicker() {
        if (this.state.nguoiDangExpanded) {
            return (
                <View>
                    <Picker style={myStyles.picker2}
                            selectedValue={this.state.nguoiDang}
                            onValueChange={this.onValueChange.bind(this, 'nguoiDang')}
                            mode="dropdown">
                        <Item label="Chủ nhà" value="chu_nha" />
                        <Item label="Môi giới" value="moi_gioi" />
                    </Picker>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    _onNguoiDangPressed() {
        this.setState({nguoiDangExpanded: !this.state.nguoiDangExpanded});
    }

    _getNguoiDangValue() {
        var nguoiDang = this.state.nguoiDang;
        return (nguoiDang == 'chu_nha') ? "Chủ nhà" : "Môi giới";
    }

    _renderLoaiTin() {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style = {{flex:1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
                    <LikeTabButton name={'ban'}
                                   onPress={this.onValueChange.bind(this, 'loaiTin')}
                                   selected={this.state.loaiTin === 'ban'}>BÁN</LikeTabButton>
                    <LikeTabButton name={'thue'}
                                   onPress={this.onValueChange.bind(this, 'loaiTin')}
                                   selected={this.state.loaiTin === 'thue'}>CHO THUÊ</LikeTabButton>
                </View>
            </View>
        );
    }

    _renderLoaiNha() {
        var arrowName = this.state.loaiNhaExpanded ? "arrow-down" : "arrow-right";
        return (
            <View style={{marginTop: 9, marginBottom: 5}}>
                <TouchableHighlight
                    onPress={() => this._onLoaiNhaPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Loại nhà*
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.label}> {this._getLoaiNhaValue()} </Text>
                            <TruliaIcon name={arrowName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
                {this._renderLoaiNhaPicker()}
            </View>
        );
    }

    _renderLoaiNhaPicker() {
        if (this.state.loaiNhaExpanded) {
            var {loaiTin} = this.state;
            var hashLoaiNha = (loaiTin == "ban") ? DanhMuc.LoaiNhaDatBan : DanhMuc.LoaiNhaDatThue;
            var dmLoaiNha = DanhMuc.getDanhMucKeys(hashLoaiNha);
            var loaiNhaItems = [];
            dmLoaiNha.map(function (loaiNha) {
                loaiNhaItems.push(<Item label={hashLoaiNha[loaiNha]} value={loaiNha}></Item>);
            })
            return (
                <View>
                    <Picker style={myStyles.picker2}
                            selectedValue={this.state.loaiNha}
                            onValueChange={this.onValueChange.bind(this, 'loaiNha')}
                            mode="dropdown">
                        {loaiNhaItems}
                    </Picker>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    _onLoaiNhaPressed() {
        this.setState({loaiNhaExpanded: !this.state.loaiNhaExpanded});
    }

    _getLoaiNhaValue() {
        var {loaiTin, loaiNha} = this.state;
        var hashLoaiNha = (loaiTin == "ban") ? DanhMuc.LoaiNhaDatBan : DanhMuc.LoaiNhaDatThue;
        return hashLoaiNha[loaiNha];
    }

    _renderDiaChi() {
        return (
            <View style={myStyles.imgList} >
                <Text style={myStyles.label}>Địa chỉ*</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.diaChi}
                    onChangeText={(text) => this.setState({diaChi: text})}
                />
            </View>
        );
    }

    _renderGia() {
        return (
            <View style={myStyles.imgList} >
                <Text style={myStyles.label}>Giá*</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.gia}
                    onChangeText={(text) => this.setState({gia: text})}
                />
            </View>
        );
    }

    _renderDienTich() {
        return (
            <View style={myStyles.imgList} >
                <Text style={myStyles.label}>Diện tích*</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.dienTich}
                    onChangeText={(text) => this.setState({dienTich: text})}
                />
            </View>
        );
    }

    _renderSoTang() {
        return (
            <View style={myStyles.imgList} >
                <Text style={myStyles.label}>Số tầng</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.soTang}
                    onChangeText={(text) => this.setState({soTang: text})}
                    keyboardType={"numeric"}
                />
            </View>
        );
    }

    _renderSoTang() {
        return this._renderSegment("Số tầng", DanhMuc.getSoTangValues(),
            this.state.soTang, this._onSegmentChanged.bind(this, 'soTang'));
    }

    _renderPhongNgu() {
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.state.phongNgu, this._onSegmentChanged.bind(this, 'phongNgu'));
    }

    _renderPhongTam() {
        return this._renderSegment("Số phòng tắm", DanhMuc.getSoPhongTamValues(),
            this.state.phongTam, this._onSegmentChanged.bind(this, 'phongTam'));
    }

    _onSegmentChanged(key, event) {
        console.log(key, event);
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
            <View>
                <Text style={myStyles.label2}>Mô tả chi tiết</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.textArea}
                    value={this.state.chiTiet}
                    onChangeText={(text) => this.setState({chiTiet: text})}
                    multiline={true}
                />
            </View>
        );
    }

    onValueChange(key: string, value: string) {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    onPostAds() {
        var {photos} = this.state;
        this.state.errorMessage = '';
        uploadFiles = [];
        for(var i=0; i<photos.length; i++) {
            var filepath = photos[i].uri;
            if (filepath == '') {
                continue;
            }
            var filename = filepath.substring(filepath.lastIndexOf('/')+1);
            uploadFiles.push({filename: filename, filepath: filepath});
        }
        if (!this.isValidInputData()) {
            Alert.alert(
                'Thông báo',
                this.state.errorMessage
            );
            return;
        }
        count = 0;
        for(var i=0; i<uploadFiles.length; i++) {
            if (this.state.errorMessage != '') {
                Alert.alert(
                    'Thông báo',
                    this.state.errorMessage
                );
                return;
            }
            var filename = uploadFiles[i].filename;
            var filepath = uploadFiles[i].filepath;
            UploadApi.onUpload(filename, filepath, this.uploadCallBack.bind(this));
        }
    }

    isValidInputData() {
        var errors = '';
        if (uploadFiles.length === 0) {
            errors += ' (ảnh)';
        }
        var {loaiNha, diaChi, gia, dienTich} = this.state;
        if (loaiNha === 0) {
            errors += ' (loại nhà)';
        }
        if (diaChi == '') {
            errors += ' (địa chỉ)';
        }
        if (gia == '') {
            errors += ' (giá)';
        }
        if (dienTich == '') {
            errors += ' (diện tích)';
        }
        if (errors != '') {
            this.state.errorMessage = 'Bạn chưa chọn' + errors + '!';
            this.setState({errorMessage: 'Bạn chưa chọn' + errors + '!'});
            return false;
        }
        return true;
    }

    uploadCallBack = function (err, result) {
        var {data} = result;
        if (err || data == '') {
            this.state.errorMessage = 'Upload ảnh không thành công!';
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
            this.state.errorMessage = 'Upload ảnh không thành công!';
        }
    }

    onSaveAds() {
        var {loaiTin, loaiNha, diaChi, gia, dienTich, soTang, phongNgu, phongTam, chiTiet, uploadUrls, geo} = this.state;
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
        dbService._createAds({loaiTin: loaiTinVal, loaiNha: loaiNha, diaChi: diaChi, gia: gia,
            dienTich: dienTich, soTang: soTang, phongNgu: phongNgu, phongTam: phongTam, chiTiet: chiTiet,
            uploadUrls: imageUrls, userID: currentUser.userID, geo: geo, tenLoaiNhaDat: tenLoaiNhaDat,
            tenLoaiTin: tenLoaiTin, dangBoi: dangBoi}, this.createAdsCallBack.bind(this));
    }

    createAdsCallBack(adsID) {
        Actions.SearchResultDetail({adsID: adsID, source: 'local'});
    }

    onTryAgain() {
        Actions.pop();
    }

    onTakePhoto(imageIndex) {
        var {photos} = this.state;
        Actions.PostAds({photos: photos, imageIndex: imageIndex});
    }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    imgList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    imgItem: {
        width: 90,
        height: 90,
        backgroundColor: "#A18EBC"
    },
    input: {
        padding: 4,
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        width: 200,
        alignSelf: 'center'
    },
    textArea: {
        fontSize: gui.normalFontSize,
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
    },
    label2: {
        fontSize: gui.normalFontSize,
        paddingLeft: 10
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        margin: 10
    },
    buttonText: {
        fontSize: gui.fontSize,
        fontFamily: gui.fontFamily
    },
    searchListButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#E2E2E2',
        width: Dimensions.get('window').width,
        height: 44
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    scrollView: {
        height: Dimensions.get('window').height-108
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

