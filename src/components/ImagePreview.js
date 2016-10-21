
import React, {Component} from 'react';

import
{ AppRegistry,
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar
}
    from 'react-native';

import RelandIcon from './RelandIcon';

var Orientation = require('react-native-orientation');

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

import LinearGradient from 'react-native-linear-gradient';

import PhotoView from 'react-native-photo-view';

import SearchResultDetailFooter from './detail/SearchResultDetailFooter';

import cfg from "../cfg";

import CommonUtils from '../lib/CommonUtils';

const noCoverUrl = cfg.noCoverUrl;

var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

class ImagePreview extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');
        this.state ={
            offset: new Animated.Value(deviceHeight)
        }
    }

    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 300,
            toValue: 0
        }).start();
    }

    componentWillUnmount() {
        StatusBar.setBarStyle('light-content');
        // if (this.props.owner != 'chat') {
        //     Orientation.lockToPortrait();
        // }
    }

    componentWillMount() {
        // var isChatOwner = this.isChatOwner();
        // this.imageWidth = isChatOwner ? deviceWidth : deviceHeight;
        // this.imageHeight = isChatOwner ? deviceHeight : deviceWidth;
        this.imageWidth = deviceWidth;
        this.imageHeight = deviceHeight;

        this.styles = {
            pagingText: {
                fontSize: 14,
                fontFamily: gui.fontFamily,
                fontWeight: 'normal',
                color: 'white',
                marginRight: 10,
                marginBottom: 2,
                marginTop: 2
            },
            pagingIcon: {
                borderRadius: 0,
                marginLeft: 10,
                marginBottom: 2,
                marginTop: 2
            },
            pagingView: {
                flexDirection: 'row',
                backgroundColor: 'transparent',
                borderRadius: 5
            },
            container: {
                backgroundColor: 'black',
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
            },
            closeView: {
                position: 'absolute',
                backgroundColor: 'transparent',
                top: 35
            },
            closeBtn: {
                flexDirection: 'row',
                backgroundColor: 'transparent',
                paddingLeft: 20,
                paddingRight: 15,
                paddingBottom: 20
            },
            imgSlide: {
                marginTop: 0,
                marginBottom: 0,
                backgroundColor: 'black'
            },
            imgView: {
                justifyContent: 'center',
                backgroundColor: 'black'
                //
            },
            dot : {
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
                bottom: 32
            },
            imgItem: {
                flex:1,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'auto',
                width: this.imageWidth,
                height: this.imageHeight
            },
            flexCenter: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            modal: {
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            linearGradient: {
                flex: 1,
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor : "transparent"
            },
            price: {
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'left',
                backgroundColor: 'transparent',
                marginLeft: 10,
                color: 'white'
            },
            text: {
                fontSize: 14,
                textAlign: 'left',
                backgroundColor: 'transparent',
                marginLeft: 10,
                marginBottom: 15,
                margin: 5,
                color: 'white'
            },
            heartButton_45: {
                marginBottom: 10
            }
        };
        // if (this.props.owner != 'chat') {
        //     Orientation.lockToLandscape();
        // }
    }

    closeModal() {
        Animated.timing(this.state.offset, {
            duration: 300,
            toValue: deviceHeight
        }).start(this.props.closeModal);
    }

    isChatOwner() {
        return this.props.owner == 'chat';
    }

    render() {
        console.log("Call ImagePreview.render");
        var styles = this.styles;
        var imageWidth = this.imageWidth;
        var imageHeight = this.imageHeight;
        var imageItems = [];
        var imageIndex = 0;
        if (this.props.images) {
            this.props.images.map(function (imageUrl) {
                let imageUri = {uri: imageUrl};
                if (noCoverUrl == imageUrl) {
                    imageUri = require('../assets/image/reland_house_large.jpg');
                }
                imageItems.push(
                    <View style={styles.imgView} key={"img"+(imageIndex++)}>
                        <PhotoView style={styles.imgItem}
                               source={imageUri}
                               loadingIndicatorSource={CommonUtils.getNoCoverImage()}
                               resizeMode={Image.resizeMode.contain}
                               minimumZoomScale={1}
                               maximumZoomScale={3}
                               androidScaleType="center"
                               onLoad={() => {}}
                        >
                        </PhotoView>
                    </View>
                );
            });
        }
        var renderPagination = this.isChatOwner() ? null : this._renderPagination.bind(this);
        return (
            <Animated.View style={[styles.modal, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
                <View style={styles.container}>
                    <Swiper style={styles.imgSlide} width={imageWidth} height={imageHeight}
                            showsButtons={false} autoplay={false} loop={false} bounces={true}
                            dot={<View style={[styles.dot, {backgroundColor: 'transparent'}]} />}
                            activeDot={<View style={[styles.dot, {backgroundColor: 'transparent'}]}/>}
                            renderPagination={renderPagination}
                            paginationStyle={{
                                top: 30, left: imageWidth/2-35, right: null,
                              }}
                    >
                        {imageItems}
                    </Swiper>
                    <View style={styles.closeView}>
                        <RelandIcon name={"close"} color={'white'} mainProps={styles.closeBtn}
                                    size={14} onPress={this.closeModal.bind(this)}>
                        </RelandIcon>
                    </View>
                    <View style={{position: 'absolute', top: imageHeight-44, backgroundColor: 'transparent'}} >
                    <SearchResultDetailFooter mobile={this.props.mobile} onChat={this.props.onChat} isLiked={this.props.isLiked}
                                              userID={this.props.userID} ads={this.props.ads} loggedIn={this.props.loggedIn}
                                              likeAds={this.props.likeAds} unlikeAds={this.props.unlikeAds}
                                              style={{backgroundColor: 'transparent', borderTopColor: 'transparent'}}/>
                    </View>
                </View>
            </Animated.View>
        )
    }

    _renderPagination(index, total, context) {
        var styles = this.styles;
        var imageWidth = this.imageWidth;
        return (
            <View style={{
      position: 'absolute',
      top: 30,
      left: imageWidth/2-35,
    }}>
                <RelandIcon name="camera-o" color="white"
                            iconProps={{style: styles.pagingIcon}} size={16}
                            textProps={styles.pagingText}
                            mainProps={styles.pagingView}
                            text={(index + 1) + '/' + (total)}
                >
                </RelandIcon>
            </View>
        )
    }

}

export default ImagePreview;