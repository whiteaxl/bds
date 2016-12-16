'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    ActivityIndicator,
    CameraRoll,
    Image,
    ListView,
    Platform,
    StyleSheet,
    View,
    TouchableHighlight,
    Dimensions,
    StatusBar
} = ReactNative;

import CommonHeader from './CommonHeader';

import gui from "../lib/gui";
import log from "../lib/logUtil";
import danhMuc from '../assets/DanhMuc';

import {Actions} from 'react-native-router-flux';
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as postAdsActions from '../reducers/postAds/postAdsActions';
import * as chatActions from '../reducers/chat/chatActions';
import * as registerActions from '../reducers/register/registerActions';

import ImageResizer from 'react-native-image-resizer';

import moment from 'moment';

import cfg from "../cfg";

var rootUrl = `https://${cfg.server}`;

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

var groupByEveryN = require('groupByEveryN');
var logError = require('logError');

var propTypes = {
    /**
     * The group where the photos will be fetched from. Possible
     * values are 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream'
     * and SavedPhotos.
     */
    groupTypes: React.PropTypes.oneOf([
        'Album',
        'All',
        'Event',
        'Faces',
        'Library',
        'PhotoStream',
        'SavedPhotos',
    ]),

    /**
     * Number of images that will be fetched in one page.
     */
    batchSize: React.PropTypes.number,

    /**
     * A function that takes a single image as a parameter and renders it.
     */
    renderImage: React.PropTypes.func,

    /**
     * imagesPerRow: Number of images to be shown in each row.
     */
    imagesPerRow: React.PropTypes.number,

    /**
     * The asset type, one of 'Photos', 'Videos' or 'All'
     */
    assetType: React.PropTypes.oneOf([
        'Photos',
        'Videos',
        'All',
    ]),

};

const IMAGE_SIZE = Dimensions.get('window').width/2 - 30;

var CameraRollView = React.createClass({
    propTypes: propTypes,

    getDefaultProps: function(): Object {
        return {
            groupTypes: 'SavedPhotos',
            batchSize: 5,
            imagesPerRow: 2,
            assetType: 'Photos',
            renderImage: function(asset) {
                var imageStyle = [styles.image, {width: IMAGE_SIZE, height: IMAGE_SIZE}];
                return (
                    <Image
                        source={asset.node.image}
                        style={imageStyle}
                    />
                );
            },
        };
    },

    getInitialState: function() {
        StatusBar.setBarStyle('default');
        var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
        var {photos, imageIndex, owner} = this.props;

        return {
            assets: [],
            groupTypes: this.props.groupTypes,
            lastCursor: null,
            assetType: this.props.assetType,
            noMore: false,
            loadingMore: false,
            dataSource: ds,
            photos: photos,
            imageIndex: imageIndex,
            owner: owner
    };
    },

    /**
     * This should be called when the image renderer is changed to tell the
     * component to re-render its assets.
     */
    rendererChanged: function() {
        var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
        this.state.dataSource = ds.cloneWithRows(
            groupByEveryN(this.state.assets, this.props.imagesPerRow)
        );
    },

    componentDidMount: function() {
        this.fetch();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.groupTypes !== nextProps.groupTypes) {
            this.fetch(true);
        }
    },

    _fetch: function(clear) {
    if (clear) {
        this.setState(this.getInitialState(), this.fetch);
        return;
    }

    var fetchParams: Object = {
        first: this.props.batchSize,
        groupTypes: this.props.groupTypes,
        assetType: this.props.assetType,
    };
    if (Platform.OS === "android") {
        // not supported in android
        delete fetchParams.groupTypes;
    }
    if (this.state.lastCursor) {
        fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams)
        .then((data) => this._appendAssets(data), (e) => logError(e));
},

/**
 * Fetches more images from the camera roll. If clear is set to true, it will
 * set the component to its initial state and re-fetch the images.
 */
fetch: function(clear) {
    if (!this.state.loadingMore) {
        this.setState({loadingMore: true}, () => { this._fetch(clear); });
    }
},

render: function() {
    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <CommonHeader backTitle={"Kho ảnh"} />
                <View style={styles.headerSeparator} />
            </View>
            <ListView
                renderRow={this._renderRow}
                renderFooter={this._renderFooterSpinner}
                onEndReached={this._onEndReached}
                style={styles.list}
                dataSource={this.state.dataSource}
            />
        </View>
    );
},

_rowHasChanged: function(r1: Array<Image>, r2: Array<Image>): boolean {
    if (r1.length !== r2.length) {
        return true;
    }

    for (var i = 0; i < r1.length; i++) {
        if (r1[i] !== r2[i]) {
            return true;
        }
    }

    return false;
},

_renderFooterSpinner: function() {
    if (!this.state.noMore) {
        return <ActivityIndicator style={styles.spinner} />;
    }
    return null;
},

// rowData is an array of images
_renderRow: function(rowData: Array<Image>, sectionID: string, rowID: string)  {
    var key = 0;
    var images = rowData.map((image) => {
        if (image === null) {
            return null;
        }
        return (
            <TouchableHighlight key={key++} onPress={this.selectImage.bind(this, image)}>
                {this.props.renderImage(image)}
            </TouchableHighlight>
        );
    });

    return (
        <View style={styles.row}>
            {images}
        </View>
    );
},

selectImage: function (asset) {
    var {photos, imageIndex, owner} = this.state;
    if (!photos) {
        photos = [];
        for(var i=0; i<4; i++) {
            photos.push({uri: ''});
        }
        imageIndex = 0;
    }
    photos[imageIndex] = {uri: asset.node.image.uri};
    if (owner == 'chat') {
        this.onSendImage(asset.node.image.uri);
    } else if (owner == 'register') {
        this.onSelectAvatar(asset.node.image.uri);
    } else {
        Actions.PostAdsDetail({photos: photos, type: "reset"});
    }
},

onSelectAvatar: function (uri) {
    ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
        this.props.actions.onRegisterFieldChange('image', resizedImageUri);
        Actions.pop();
        Actions.pop();
    }).catch((err) => {
        log.error(err);
    });
},

onSendImage: function (uri) {
    const userID = this.props.global.currentUser.userID;
    // var shortname = uri.substring(uri.indexOf('id=')+3, uri.indexOf('&'));
    // var ext = uri.substring(uri.indexOf('ext=')+4);
    // var filename = shortname + '.' + ext;
    ImageResizer.createResizedImage(uri, cfg.maxWidth, cfg.maxHeight, 'JPEG', 85, 0, null).then((resizedImageUri) => {
        var ms = moment().toDate().getTime();
        var filename = 'Chat_' + userID + '_' + ms + resizedImageUri.substring(resizedImageUri.lastIndexOf('.'));
        this.props.actions.onUploadImage(filename, resizedImageUri, this.uploadCallBack);
    }).catch((err) => {
        log.error(err);
    });
},

uploadCallBack: function (err, result) {
    var {data} = result;
    if (err || data == '') {
        return;
    }
    var {success, file} = JSON.parse(data);
    if (success) {
        var {url} = file;
        this.onSaveMsg(rootUrl + url);
        Actions.pop();
        Actions.pop();
    }
},

onSaveMsg: function (url) {
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
},

_appendAssets: function(data: Object) {
    var assets = data.edges;
    var newState: Object = { loadingMore: false };

    if (!data.page_info.has_next_page) {
        newState.noMore = true;
    }

    if (assets.length > 0) {
        newState.lastCursor = data.page_info.end_cursor;
        newState.assets = this.state.assets.concat(assets);
        newState.dataSource = this.state.dataSource.cloneWithRows(
            groupByEveryN(newState.assets, this.props.imagesPerRow)
        );
    }

    this.setState(newState);
},

_onEndReached: function() {
    if (!this.state.noMore) {
        this.fetch();
    }
},
});

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1,
        margin: 10,
        marginBottom: 0
    },
    url: {
        fontSize: 9,
        marginBottom: 14,
    },
    image: {
        margin: 10,
        marginBottom: 0
    },
    info: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
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
    list: {
        flex: 1
    },
    spinner: {
    }
});

//module.exports = CameraRollView;

export default connect(mapStateToProps, mapDispatchToProps)(CameraRollView);