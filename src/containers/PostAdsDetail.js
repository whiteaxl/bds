'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

import React, {Component} from 'react';

import { Text, View, StyleSheet, TextInput } from 'react-native'

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import log from "../lib/logUtil";
import gui from "../lib/gui";


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
        return (
            <View myStyles={styles.container}>
                <Text style={styles.label}>Nguoi dang</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.nguoiDang}
                    onChangeText={(text) => this.setState({nguoiDang: text})}
                />
                <Text style={myStyles.label}>Hinh thuc</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.hinhThuc}
                    onChangeText={(text) => this.setState({hinhThuc: text})}
                />
                <Text style={myStyles.label}>Loai nha</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.loaiNha}
                    onChangeText={(text) => this.setState({loaiNha: text})}
                />
                <Text style={myStyles.label}>Dia chi</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.diaChi}
                    onChangeText={(text) => this.setState({diaChi: text})}
                />
                <Text style={myStyles.label}>Gia</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.gia}
                    onChangeText={(text) => this.setState({gia: text})}
                />
                <Text style={myStyles.label}>Dien tich</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.dienTich}
                    onChangeText={(text) => this.setState({dienTich: text})}
                />
                <Text style={myStyles.label}>So tang</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.soTang}
                    onChangeText={(text) => this.setState({soTang: text})}
                />
                <Text style={myStyles.label}>Phong ngu</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.phongNgu}
                    onChangeText={(text) => this.setState({phongNgu: text})}
                />
                <Text style={myStyles.label}>Mo ta chi tiet</Text>
                <TextInput
                    secureTextEntry={false}
                    style={myStyles.input}
                    value={this.state.chiTiet}
                    onChangeText={(text) => this.setState({chiTiet: text})}
                />
                <Text style={myStyles.label}>{this.state.errorMessage}</Text>
                <Button style={myStyles.button} onprogress={() => this.onPostAds()}>Dang tin</Button>
            </View>
        )
    }

    onPostAds() {
        console.log('PostAds!');
    }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        fontSize: 18
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostAdsDetail);

