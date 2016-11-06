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
import danhMuc from '../assets/DanhMuc';

import LoginRegister from './LoginRegister'

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';
import * as chatActions from '../reducers/chat/chatActions';
import * as registerActions from '../reducers/register/registerActions';
import * as meActions from '../reducers/me/meActions';

import RelandIcon from '../components/RelandIcon';

import ImageResizer from 'react-native-image-resizer';

import moment from 'moment';

import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000`;

const actions = [
    globalActions,
    postAdsActions,
    chatActions,
    registerActions,
    meActions
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

class PostAds extends Component {
    constructor(props) {
        super(props);
        var {photos, imageIndex, owner} = props;
        this.state = {
            photos: photos||[],
            imageIndex: imageIndex,
            owner: owner
        }
    }

    render() {

        console.log("Calling PostAds.render ..., loggedIn = ", this.props.global.loggedIn);

        if (this.props.global.loggedIn || this.state.owner == 'register') {
            let buttonItems =
                (<View style={styles.buttonContainer}>
                    <View style={styles.capture2}>
                        <RelandIcon name="close-circle" color='white' mainProps={styles.captureIcon2}
                                    size={22} textProps={{paddingLeft: 0}}
                                    onPress={this.onHome.bind(this)} />
                    </View>
                    <View style={styles.capture}>
                        <RelandIcon name="camera" color="black"
                                    mainProps={styles.captureIcon}
                                    size={22} textProps={{paddingLeft: 0}}
                                    onPress={this.takePicture.bind(this)} />
                    </View>
                    <View style={styles.capture2}>
                        <RelandIcon name="photos" color="white"
                                    mainProps={styles.captureIcon2}
                                    size={22} textProps={{paddingLeft: 0}}
                                    onPress={this.pickPhoto.bind(this)} />
                    </View>
                </View>);
            return (
                <View style={[styles.container]} >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        // captureTarget={Camera.constants.CaptureTarget.disk}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}
                        captureAudio={false}
                    >
                        {buttonItems}
                    </Camera>
                </View>
            )
        } else {
            return (
                <View style={styles.container} >
                    <LoginRegister />
                </View>
            )
        }
    }

    onHome() {
        if (this.state.photos || this.state.owner == 'chat' || this.state.owner == 'register') {
            Actions.pop();
        }
        else {
            Actions.Main();
        }
    }

    takePicture() {
        this.camera.capture()
            .then((data) => this.imageCropper(data))
            .catch(err => console.error(err));
    }

    pickPhoto() {
        Actions.CameraRollView({...this.state});
    }

    imageCropper(data) {
        var {photos, imageIndex, owner} = this.state;
        if (!photos) {
            photos = [];
            for(var i=0; i<4; i++) {
                photos.push({uri: ''});
            }
            imageIndex = 0;
        }

        photos[imageIndex] = {uri: data.path};
        if (owner == 'chat') {
            this.onSendImage(data.path);
        } else if (owner == 'register') {
            this.onSelectAvatar(data.path);
        } else if (owner == 'profile'){
            this.onSelectAvartarProfile(data.path);
        } else {
            this.props.actions.onPostAdsFieldChange('photos', this.state.photos);
            Actions.PostAdsDetail();
        }
    }

    onSelectAvatar(uri) {
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            this.props.actions.onRegisterFieldChange('image', resizedImageUri);
            Actions.pop();
        }).catch((err) => {
            log.error(err);
        });
    }

    onSelectAvartarProfile(uri) {
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            this.props.actions.onProfileFieldChange('avatar', resizedImageUri);
            Actions.pop();
        }).catch((err) => {
            log.error(err);
        });
    }

    onSendImage(uri) {
        const userID = this.props.global.currentUser.userID;
        // var shortname = uri.substring(uri.indexOf('id=')+3, uri.indexOf('&'));
        // var ext = uri.substring(uri.indexOf('ext=')+4);
        // var filename = shortname + '.' + ext;
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            var ms = moment().toDate().getTime();
            var filename = 'Chat_' + userID + '_' + ms + resizedImageUri.substring(resizedImageUri.lastIndexOf('.'));
            this.props.actions.onUploadImage(filename, resizedImageUri, this.uploadCallBack.bind(this));
        }).catch((err) => {
            log.error(err);
        });
    }

    uploadCallBack(err, result) {
        var {data} = result;
        if (err || data == '') {
            return;
        }
        var {success, file} = JSON.parse(data);
        if (success) {
            var {url} = file;
            this.onSaveMsg(rootUrl + url);
            Actions.pop();
        }
    }

    onSaveMsg(url) {
        log.info("Enter onSaveMsg...");

        const userID = this.props.global.currentUser.userID;
        const chatID = "Chat_" + userID + "_" + new Date().getTime();

        let myMsg = {
            _id : chatID,
            chatID : chatID,
            id : chatID,
            fromUserID : userID,
            fromFullName : this.props.global.currentUser.fullName,
            toUserID : this.props.chat.partner.userID,
            toFullName : this.props.chat.partner.fullName,
            relatedToAds : this.props.chat.ads,
            avatar: this.props.global.currentUser.avatar,
            content: url,
            msgType : danhMuc.CHAT_MESSAGE_TYPE.IMAGE,
            read: false,
            date : new Date(),
            type: 'Chat',
            timeStamp : new Date().getTime()
        };

        log.info("start send myMsg=", myMsg);

        this.props.actions.sendChatMsg(myMsg);
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
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
    capture2: {
        backgroundColor: 'transparent',
        borderRadius: 5
    },
    captureIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 80,
        padding: 5
    },
    captureIcon2: {
        flexDirection: 'row',
        justifyContent: 'center',
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