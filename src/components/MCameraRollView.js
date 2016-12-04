'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert
} from 'react-native';

import gui from "../lib/gui";
import log from "../lib/logUtil";

import TruliaIcon from './TruliaIcon';

import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';
import * as chatActions from '../reducers/chat/chatActions';
import * as registerActions from '../reducers/register/registerActions';
import * as meActions from '../reducers/me/meActions';

import CameraRollPicker from './cameraRoll/CameraRollPicker';

import ImageResizer from 'react-native-image-resizer';

import {Actions} from 'react-native-router-flux';

import moment from 'moment';

import danhMuc from '../assets/DanhMuc';

import cfg from "../cfg";

var rootUrl = `${cfg.serverUrl}`;

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

class MCameraRollView extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        let {photos, imageIndex, owner} = props;

        let maxImage = 0;

        switch (owner) {
            case 'register':
                imageIndex = 0;
                maxImage = 1;
                break;
            case 'profile':
                imageIndex = 0;
                maxImage = 1;
                break;
            case 'chat':
                imageIndex = 0;
                maxImage = 1;
                break;
            default:
                imageIndex = imageIndex;
                maxImage = 20;
                for (let i=0; i< photos.length; i++){
                    if (photos[i].uri && photos[i].uri.length>0)
                        maxImage = maxImage -1;
                }
                if (maxImage<=0){
                    maxImage = 1;
                }
        }

        this.state = {
            num: 0,
            selected: [],
            photos : photos,
            imageIndex: imageIndex,
            maxImage: maxImage,
            owner: owner
        };
    }

    getSelectedImages(images, current) {
        var num = images.length;
        this.setState({
            num: num,
            selected: images,
        });

        console.log("action click");
        console.log(images);
        console.log(current);
        console.log("action click end");
    }

    _onChonPressed(){
        let owner = this.state.owner;
        let selectedPhotos = this.state.selected || [];
        let photos = this.state.photos || [];

        if (['register','chat', 'profile'].indexOf(owner) >=0){
            if (selectedPhotos.length >=0){
                let firstPhoto = selectedPhotos[0];
                switch(owner) {
                    case 'register':
                        console.log("take photo for registering user");
                        this._onSelectRegisterAvatar(firstPhoto.image.uri);
                        break;
                    case 'chat':
                        console.log("take photo for chatting");
                        this._onSendImage(firstPhoto.image.uri);
                        break;
                    case 'profile':
                        console.log("take photo for updating profile");
                        this._onSelectProfileAvatar(firstPhoto.image.uri);
                        break;
                    default:
                        console.log("do nothing");
                }

            }
            return;
        }

        if ( selectedPhotos.length > 0 ){
            photos[this.state.imageIndex] = {uri: selectedPhotos[0].image.uri, location: selectedPhotos[0].location};

            for (var i=1; i<selectedPhotos.length; i++){
                for (var j=0; j<20; j++){
                    if (!photos[j] || !photos[j].uri || photos[j].uri.length<=0){
                        photos[j] = {uri: selectedPhotos[i].image.uri, location: selectedPhotos[i].location}
                        break;
                    }
                }
            }
        }

        this.props.actions.onPostAdsFieldChange('photos', this.state.photos);
        Actions.PostAdsDetail({type: 'replace'});
    }

    _onBack(){
        Actions.pop();
    }

    _onSelectRegisterAvatar(uri) {
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            this.props.actions.onRegisterFieldChange('image', resizedImageUri);
            Actions.pop();
            Actions.pop();
        }).catch((err) => {
            log.error(err);
        });
    }

    _onSelectProfileAvatar(uri) {
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            this.props.actions.onProfileFieldChange('avatar', resizedImageUri);
            Actions.pop();
            Actions.pop();
        }).catch((err) => {
            log.error(err);
        });
    }

    _onSendImage(uri) {
        const userID = this.props.global.currentUser.userID;
        ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
            var ms = moment().toDate().getTime();
            var filename = 'Chat_' + userID + '_' + ms + resizedImageUri.substring(resizedImageUri.lastIndexOf('.'));
            this.props.actions.onUploadImage(filename, resizedImageUri, this._uploadCallBack.bind(this));
        }).catch((err) => {
            log.error(err);
        });
    }

    _uploadCallBack(err, result) {
        var {data} = result;
        if (err || data == '') {
            return;
        }
        var {success, file} = JSON.parse(data);
        if (success) {
            var {url} = file;
            this._onSaveMsg(rootUrl + url);
            Actions.pop();
            Actions.pop();
        }
    }

    _onSaveMsg(url) {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TruliaIcon onPress = {() => this._onBack()}
                                name="arrow-left" color={gui.mainColor} size={25}
                                mainProps={styles.backButton} text={this.props.backTitle}
                                textProps={styles.backButtonText} >
                    </TruliaIcon>
                    <View style={styles.customPageTitle}>
                        <Text style={styles.customPageTitleText}>
                            Kho ảnh
                        </Text>
                    </View>
                    <TouchableOpacity onPress = {() => this._onChonPressed()}>
                        <View style={styles.thoatButton}>
                            <Text style={styles.thoatButtonText}>
                                Chọn
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <CameraRollPicker
                    scrollRenderAheadDistance={500}
                    initialListSize={1}
                    pageSize={3}
                    removeClippedSubviews={false}
                    groupTypes='SavedPhotos'
                    batchSize={5}
                    maximum={this.state.maxImage}
                    selected={this.state.selected}
                    assetType='Photos'
                    imagesPerRow={3}
                    imageMargin={5}
                    callback={this.getSelectedImages.bind(this)} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    search: {
        top:0,
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    content: {
        marginTop: 15,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 16,
        alignItems: 'center',
        color: '#fff',
    },
    bold: {
        fontWeight: 'bold',
    },
    info: {
        fontSize: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        height: 60
    },
    backButton: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 18,
        paddingRight: 18
    },
    backButtonText: {
        color: gui.mainColor,
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        textAlign: 'left',
        marginLeft: 7
    },
    customPageTitle: {
        left:60,
        right:60,
        marginTop: 31,
        marginBottom: 10,
        position: 'absolute'
    },
    customPageTitleText: {
        color: gui.mainColor,
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'center'
    },
    thoatButton: {
        marginTop: 31,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 18,
        paddingRight: 18
    },
    thoatButtonText: {
        color: gui.mainColor,
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'right',
        marginRight: 7
    }
});

//module.exports = CameraRollView;

export default connect(mapStateToProps, mapDispatchToProps)(MCameraRollView);