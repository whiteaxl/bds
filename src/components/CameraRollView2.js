'use strict';

var React = require('react');
var ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    ScrollView,
    Image,
    CameraRoll,
    TouchableHighlight,
    Platform,
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

const IMAGE_SIZE = Dimensions.get('window').width/2 - 30;

const styles = StyleSheet.create({
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
    imageGrid: {
        margin: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        margin: 10
    }
});

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

var CameraRollView2 = React.createClass({
    propTypes: propTypes,

    getDefaultProps: function(): Object {
        return {
            groupTypes: 'SavedPhotos',
            batchSize: 25,
            imagesPerRow: 1,
            assetType: 'Photos'
        };
    },

    getInitialState() {
        StatusBar.setBarStyle('default');
        var {photos, imageIndex} = this.props;
        return {
            groupTypes: this.props.groupTypes,
            lastCursor: null,
            assetType: this.props.assetType,
            noMore: false,
            loadingMore: false,
            photos: photos,
            imageIndex: imageIndex,
            images: []
        };
    },
    storeImages(data) {
        const assets = data.edges;
        const images = assets.map( asset => asset.node.image );
        this.setState({
            images: images
        });
    },
    componentDidMount() {
        this.fetch();
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.groupTypes !== nextProps.groupTypes) {
            this.fetch(true);
        }
    },
    fetch: function(clear) {
        if (!this.state.loadingMore) {
            this.setState({loadingMore: true}, () => { this._fetch(clear); });
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
            .then((data) => this.storeImages(data), (e) => logError(e));
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.search}>
                    <CommonHeader backTitle={"Kho ảnh"} />
                    <View style={styles.headerSeparator} />
                </View>
                <ScrollView style={styles.list}>
                    <View style={styles.imageGrid}>
                        { this.state.images.map((image) => {
                            return (
                                <TouchableHighlight onPress={this.selectImage.bind(null, image.uri)}>
                                    <Image style={styles.image} source={{ uri: image.uri }} />
                                </TouchableHighlight>
                            );
                        })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    },
    selectImage(uri) {
        var {photos, imageIndex} = this.state;
        if (!photos) {
            photos = [];
            for(var i=0; i<4; i++) {
                photos.push({uri: ''});
            }
            imageIndex = 0;
        }
        photos[imageIndex] = {uri: uri};
        Actions.PostAdsDetail({photos: photos, type: "reset"});
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraRollView2);