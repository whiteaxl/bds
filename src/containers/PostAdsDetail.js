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
            loaiNhaExpanded: false,
            uploadUrls: []
        }
    }

    componentWillMount() {
        this.onValueChange('photos', this.props.photos);
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
                    {this._renderChiTiet()}
                    <Text style={[myStyles.label, {marginTop: 9, marginLeft: 15, color: 'red'}]}>
                        {this.props.postAds.error}</Text>
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
                    <Image style={myStyles.imgItem} source={this.props.postAds.photos[0]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(1)} >
                    <Image style={myStyles.imgItem} source={this.props.postAds.photos[1]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(2)} >
                    <Image style={myStyles.imgItem} source={this.props.postAds.photos[2]}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onTakePhoto(3)} >
                    <Image style={myStyles.imgItem} source={this.props.postAds.photos[3]}/>
                </TouchableHighlight>
            </View>
        );
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
            var {loaiTin, loaiNha} = this.props.postAds;
            var hashLoaiNha = (loaiTin == "ban") ? DanhMuc.LoaiNhaDatBan : DanhMuc.LoaiNhaDatThue;
            var dmLoaiNha = DanhMuc.getDanhMucKeys(hashLoaiNha);
            var loaiNhaItems = [];
            dmLoaiNha.map(function (val) {
                loaiNhaItems.push(<Item label={hashLoaiNha[val]} value={val}></Item>);
            })
            return (
                <View>
                    <Picker style={myStyles.picker2}
                            selectedValue={loaiNha}
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
        var {loaiTin, loaiNha} = this.props.postAds;
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
                    value={this.props.postAds.diaChi}
                    onChangeText={(text) => this.onValueChange("diaChi", text)}
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
                    value={this.props.postAds.gia}
                    onChangeText={(text) => this.onValueChange("gia", text)}
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
                    value={this.props.postAds.dienTich}
                    onChangeText={(text) => this.onValueChange("dienTich", text)}
                />
            </View>
        );
    }

    _renderSoTang() {
        return this._renderSegment("Số tầng", DanhMuc.getSoTangValues(),
            this.props.postAds.soTang, this._onSegmentChanged.bind(this, 'soTang'));
    }

    _renderPhongNgu() {
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.props.postAds.phongNgu, this._onSegmentChanged.bind(this, 'phongNgu'));
    }

    _renderPhongTam() {
        return this._renderSegment("Số phòng tắm", DanhMuc.getSoPhongTamValues(),
            this.props.postAds.phongTam, this._onSegmentChanged.bind(this, 'phongTam'));
    }

    _onSegmentChanged(key, event) {
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
                    value={this.props.postAds.chiTiet}
                    onChangeText={(text) => this.onValueChange("chiTiet", text)}
                    multiline={true}
                />
            </View>
        );
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
        if (!this.isValidInputData()) {
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
        var {loaiNha, diaChi, gia, dienTich} = this.props.postAds;
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
        var {loaiTin, loaiNha, gia, dienTich, soTang, phongNgu, phongTam, chiTiet, place} = this.props.postAds;
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
        dbService._createAds({loaiTin: loaiTinVal, loaiNha: loaiNha, place: place, gia: gia,
            dienTich: dienTich, soTang: soTang, phongNgu: phongNgu, phongTam: phongTam, chiTiet: chiTiet,
            uploadUrls: imageUrls, userID: currentUser.userID, tenLoaiNhaDat: tenLoaiNhaDat,
            tenLoaiTin: tenLoaiTin, dangBoi: dangBoi}, this.createAdsCallBack.bind(this));
    }

    createAdsCallBack(adsID) {
        Actions.SearchResultDetail({adsID: adsID, source: 'local'});
    }

    onTryAgain() {
        Actions.pop();
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

