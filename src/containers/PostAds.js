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

export default class PostAds extends Component {
    constructor(props) {
        super(props);
        var {photos, imageIndex} = props;
        this.state = {
            photos: photos,
            imageIndex: imageIndex
        }
    }

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
                        <View style={styles.buttonContainer}>
                            <View style={styles.capture}>
                            <RelandIcon name="close" color='black' mainProps={styles.captureIcon}
                                        size={20} textProps={{paddingLeft: 0}}
                                        onPress={this.onHome.bind(this)} />
                            </View>
                            <View style={styles.capture}>
                            <RelandIcon name="camera" color="black"
                                        mainProps={styles.captureIcon}
                                        size={20} textProps={{paddingLeft: 0}}
                                        onPress={this.takePicture.bind(this)} />
                            </View>
                        </View>
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

    onHome() {
        Actions.Launch({type:"reset"});
    }

    takePicture() {
        this.camera.capture()
            .then((data) => this.imageCropper(data))
            .catch(err => console.error(err));
    }

    imageCropper(data) {
        //console.log(data);
        //Actions.SquareImageCropper({photo: data});
        var {photos, imageIndex} = this.state;
        if (!photos) {
            photos = [];
            for(var i=0; i<4; i++) {
                photos.push({uri: ''});
            }
            imageIndex = 0;
        }
        photos[imageIndex] = {uri: data.path};
        Actions.PostAdsDetail({photos: photos});
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
        backgroundColor: '#fff',
        borderRadius: 5
    },
    captureIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 80,
        padding: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 80,
        width: Dimensions.get('window').width
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(PostAds);