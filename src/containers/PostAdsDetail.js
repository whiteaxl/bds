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
            hinhThuc: 'ban',
            hinhThucExpanded: false,
            loaiNha: '0',
            loaiNhaExpanded: false,
            diaChi: '',
            gia: '',
            dienTich: '',
            soTang: '',
            phongNgu: '',
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
                    {this._renderNguoiDang()}
                    {this._renderHinhThuc()}
                    {this._renderLoaiNha()}
                    {this._renderDiaChi()}
                    {this._renderGia()}
                    {this._renderDienTich()}
                    {this._renderSoTang()}
                    {this._renderPhongNgu()}
                    {this._renderChiTiet()}
                    <Text style={[myStyles.label, {marginTop: 9}]}>{this.state.errorMessage}</Text>
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

    _renderHinhThuc() {
        var arrowName = this.state.hinhThucExpanded ? "arrow-down" : "arrow-right";
        return (
            <View style={{marginTop: 9, marginBottom: 5}}>
                <TouchableHighlight
                    onPress={() => this._onHinhThucPressed()}>
                    <View style={myStyles.imgList}>
                        <Text style={myStyles.label}>
                            Hình thức*
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.label}> {this._getHinhThucValue()} </Text>
                            <TruliaIcon name={arrowName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableHighlight>
                {this._renderHinhThucPicker()}
            </View>
        );
    }

    _renderHinhThucPicker() {
        if (this.state.hinhThucExpanded) {
            return (
                <View>
                    <Picker style={myStyles.picker2}
                            selectedValue={this.state.hinhThuc}
                            onValueChange={this.onValueChange.bind(this, 'hinhThuc')}
                            mode="dropdown">
                        <Item label="Bán" value="ban" />
                        <Item label="Cho thuê" value="thue" />
                    </Picker>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    _onHinhThucPressed() {
        this.setState({hinhThucExpanded: !this.state.hinhThucExpanded});
    }

    _getHinhThucValue() {
        var hinhThuc = this.state.hinhThuc;
        var loaiTin = (hinhThuc == 'ban') ? 0 : 1;
        return DanhMuc.LoaiTin[loaiTin];
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
            var hinhThuc = this.state.hinhThuc;
            var hashLoaiNha = (hinhThuc == "ban") ? DanhMuc.LoaiNhaDatBan : DanhMuc.LoaiNhaDatThue;
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
        var {hinhThuc, loaiNha} = this.state;
        var hashLoaiNha = (hinhThuc == "ban") ? DanhMuc.LoaiNhaDatBan : DanhMuc.LoaiNhaDatThue;
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

    _renderPhongNgu() {
        return (
            <View style={myStyles.imgList} >
                <Text style={myStyles.label}>Phòng ngủ</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.phongNgu}
                    onChangeText={(text) => this.setState({phongNgu: text})}
                    keyboardType={"numeric"}
                />
            </View>
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
            return false;
        }
        return true;
    }

    uploadCallBack = function (err, result) {
        if (err) {
            this.state.errorMessage = 'Upload ảnh không thành công!';
            return;
        }
        var {data} = result;
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
        var {hinhThuc, loaiNha, diaChi, gia, dienTich, soTang, phongNgu, chiTiet, uploadUrls, geo} = this.state;
        var imageUrls = [];
        uploadUrls.map(function (uploadUrl) {
            imageUrls.push(rootUrl + uploadUrl);
        });
        var tenLoaiNhaDat = this._getLoaiNhaValue();
        var loaiTin = (hinhThuc == 'ban') ? 0 : 1;
        var tenLoaiTin = DanhMuc.LoaiTin[loaiTin];
        var currentUser = this.props.global.currentUser;
        var dangBoi = {
            "email": currentUser.email,
            "name": currentUser.fullName,
            "phone": currentUser.phone,
            "userID": currentUser.userID
        };
        var adsID = dbService._createAds({loaiTin: loaiTin, loaiNha: loaiNha, diaChi: diaChi, gia: gia,
            dienTich: dienTich, soTang: soTang, phongNgu: phongNgu, chiTiet: chiTiet, uploadUrls: imageUrls,
            userID: currentUser.userID, geo: geo, tenLoaiNhaDat: tenLoaiNhaDat, tenLoaiTin: tenLoaiTin,
            dangBoi: dangBoi});
        Alert.alert(
            'Thông báo',
            'Lưu thành công ads ' + adsID
        );
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
        fontSize: 18,
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
        fontSize: 18
    },
    label2: {
        fontSize: 18,
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

