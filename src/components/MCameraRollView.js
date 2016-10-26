'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';

import CommonHeader from './CommonHeader';

import gui from "../lib/gui";
import log from "../lib/logUtil";
import danhMuc from '../assets/DanhMuc';

import TruliaIcon from './TruliaIcon';

import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';
import * as chatActions from '../reducers/chat/chatActions';
import * as registerActions from '../reducers/register/registerActions';

import CameraRollPicker from 'react-native-camera-roll-picker';

import ImageResizer from 'react-native-image-resizer';

import {Actions} from 'react-native-router-flux';

import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000`;

const actions = [
    globalActions,
    postAdsActions,
    chatActions,
    registerActions
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
        let {photos, imageIndex} = props;

        this.state = {
            num: 0,
            selected: [],
            photos : photos,
            imageIndex: imageIndex
        };
    }

    getSelectedImages(images, current) {
        var num = images.length;
        this.setState({
            num: num,
            selected: images,
        });

        let photos = this.state.photos;

        if (this.state.imageIndex){
            photos[this.state.imageIndex] = {uri: current.uri};
        } else {
            photos = images.map((e) => {return {uri: e.uri}})
        }
        this.setState({photos: photos});
        console.log(current);
        console.log(this.state.selected);
    }

    _onChonPressed(){
        console.log("Chọn");

        Actions.PostAdsDetail({photos: this.state.photos, type: "reset"});
        console.log("End Chọn");
    }

    _onBack(){
        console.log("Quay lại");
        Actions.pop();
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
                    maximum={this.state.imageIndex ? 1 : 4}
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