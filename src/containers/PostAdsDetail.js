'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, StatusBar, TextInput, Image, Dimensions, ScrollView } from 'react-native'

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../lib/logUtil";
import gui from "../lib/gui";

import CommonHeader from '../components/CommonHeader';

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';


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



class PostAdsDetail extends Component {

    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');

        this.state = {
            photo: props.photo,
            nguoiDang: '',
            hinhThuc: '',
            loaiNha: '',
            diaChi: '',
            gia: '',
            dienTich: '',
            soTang: '',
            phongNgu: '',
            chiTiet: '',
            errorMessage: ''
        }
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
                    <View style={myStyles.imgList} >
                        <Image style={myStyles.imgItem} source={this.state.photo}/>
                        <Image style={myStyles.imgItem}/>
                        <Image style={myStyles.imgItem}/>
                        <Image style={myStyles.imgItem}/>
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Nguoi dang</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.nguoiDang}
                            onChangeText={(text) => this.setState({nguoiDang: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Hinh thuc</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.hinhThuc}
                            onChangeText={(text) => this.setState({hinhThuc: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Loai nha</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.loaiNha}
                            onChangeText={(text) => this.setState({loaiNha: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Dia chi</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.diaChi}
                            onChangeText={(text) => this.setState({diaChi: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Gia</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.gia}
                            onChangeText={(text) => this.setState({gia: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Dien tich</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.dienTich}
                            onChangeText={(text) => this.setState({dienTich: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>So tang</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.soTang}
                            onChangeText={(text) => this.setState({soTang: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Phong ngu</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.phongNgu}
                            onChangeText={(text) => this.setState({phongNgu: text})}
                        />
                    </View>
                    <View style={myStyles.imgList} >
                        <Text style={myStyles.label}>Mo ta chi tiet</Text>
                        <TextInput
                            secureTextEntry={false}
                            style={myStyles.input}
                            value={this.state.chiTiet}
                            onChangeText={(text) => this.setState({chiTiet: text})}
                        />
                    </View>
                    <Text style={myStyles.label}>{this.state.errorMessage}</Text>
                </ScrollView>
                <View style={myStyles.searchButton}>
                    <View style={myStyles.searchListButton}>
                        <RelandIcon onPress={this.onTryAgain} name="close" size={24} text="Làm lại"
                                    mainProps={myStyles.button} textProps={myStyles.buttonText}/>
                        <RelandIcon onPress={this.onPostAds} name="save" size={24} text="Đăng tin"
                                    mainProps={myStyles.button} textProps={myStyles.buttonText}/>
                    </View>
                </View>
            </View>
        )
    }

    onPostAds() {
        console.log('PostAds!');
    }

    onTryAgain() {
        Actions.pop();
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
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        width: 200,
        alignSelf: 'center'
    },
    label: {
        fontSize: 18
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
        flex: 1,
        paddingBottom: 75
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsDetail);

