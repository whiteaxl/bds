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

import {Actions} from 'react-native-router-flux';
import {Map} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
        var {photos, imageIndex} = this.props;

        return {
            assets: [],
            groupTypes: this.props.groupTypes,
            lastCursor: null,
            assetType: this.props.assetType,
            noMore: false,
            loadingMore: false,
            dataSource: ds,
            photos: photos,
            imageIndex: imageIndex
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
    var images = rowData.map((image) => {
        if (image === null) {
            return null;
        }
        return (
            <TouchableHighlight onPress={this.selectImage.bind(this, image)}>
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
    var {photos, imageIndex} = this.state;
    if (!photos) {
        photos = [];
        for(var i=0; i<4; i++) {
            photos.push({uri: ''});
        }
        imageIndex = 0;
    }
    photos[imageIndex] = {uri: asset.node.image.uri};
    Actions.PostAdsDetail({photos: photos, type: "reset"});
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