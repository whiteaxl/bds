'use strict';

import  React, {Component} from 'react';

import { View, Text, StyleSheet, Dimensions } from 'react-native';

import {Actions} from 'react-native-router-flux';
import log from "../lib/logUtil";
import gui from "../lib/gui";
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';

import LoginRegister from './LoginRegister'

import * as globalActions from '../reducers/global/globalActions';

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

export default class PostAds extends Component {
    render() {

        console.log("Calling PostAds.render ..., loggedIn = ", this.props.global.loggedIn);

        if (this.props.global.loggedIn) {
            return (
                <View style={[styles.container]} >
                    <Camera
                        ref={(cam) => {
                        this.camera = cam;
                      }}
                        captureTarget={Camera.constants.CaptureTarget.disk}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>Chụp ảnh</Text>
                    </Camera>
                </View>
            )
        } else {
            return (
                <View style={[styles.container, {marginTop: 30}]} >
                    <LoginRegister />
                </View>
            )
        }
    }

    takePicture() {
        this.camera.capture()
            .then((data) => this.imageCropper(data))
            .catch(err => console.error(err));
    }

    imageCropper(data) {
        console.log(data);
        Actions.SquareImageCropper({photo: data});
    }
}


var styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        backgroundColor: "white"
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        marginBottom: 80
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(PostAds);