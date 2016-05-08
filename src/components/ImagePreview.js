import React,
{ AppRegistry,
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    Component,
    StatusBar
}
    from 'react-native';

import RelandIcon from './RelandIcon';

var Orientation = React.NativeModules.Orientation;

import Swiper from 'react-native-swiper';

import gui from '../lib/gui';

var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

class ImagePreview extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('default');
        this.state ={
            offset: new Animated.Value(deviceHeight),
        }
    }

    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 500,
            toValue: 0
        }).start();
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    componentWillMount() {
        Orientation.unlockAllOrientations();
    }

    closeModal() {
        Animated.timing(this.state.offset, {
            duration: 500,
            toValue: deviceHeight
        }).start(this.props.closeModal);
    }

    render() {
        console.log("Call ImagePreview.render");

        var imageItems = [];
        var imageIndex = 0;
        if (this.props.images) {
            this.props.images.map(function (imageUrl) {
                imageItems.push(
                    <View style={styles.imgView} key={"img"+(imageIndex++)}>
                        <Image style={styles.imgItem}
                               source={{uri: `${imageUrl}`}}
                               resizeMode={Image.resizeMode.contain}
                        >
                        </Image>
                    </View>
                );
            });
        }
        return (
            <Animated.View style={[styles.modal, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
                <View style={styles.container}>
                    <Swiper style={styles.imgSlide}
                            showsButtons={false} autoplay={false} loop={false}
                            dot={<View style={[styles.dot, {backgroundColor: 'transparent'}]} />}
                            activeDot={<View style={[styles.dot, {backgroundColor: 'transparent'}]}/>}
                            renderPagination={this._renderPagination}
                            paginationStyle={{
                                top: 28, left: deviceWidth/2-35, right: null,
                              }}
                    >
                        {imageItems}
                    </Swiper>
                    <View style={styles.closeView}>
                        <RelandIcon name={"left"} color={gui.mainColor} mainProps={styles.closeBtn}
                                    size={20} onPress={this.closeModal.bind(this)}>
                        </RelandIcon>
                    </View>
                </View>
            </Animated.View>
        )
    }

    _renderPagination(index, total, context) {
        return (
            <View style={{
      position: 'absolute',
      top: 28,
      left: deviceWidth/2-35,
    }}>
                <RelandIcon name="camera" color="white"
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

var styles = StyleSheet.create({
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
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 2,
        marginTop: 2
    },
    pagingView: {
        flexDirection: 'row',
        backgroundColor: gui.mainColor,
        borderRadius: 5
    },
    container: {
        backgroundColor: 'lightgray',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    closeView: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 30
    },
    closeBtn: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingLeft: 15,
        paddingRight: 15
    },
    imgSlide: {
        marginTop: 0,
        marginBottom: 0
    },
    imgView: {
        justifyContent: 'center',
        backgroundColor: 'transparent'
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
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
    thumb: {
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        marginTop: 2*deviceHeight/3,
        height: deviceHeight/3,
        width: deviceWidth,
        alignSelf: 'auto'
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
    heartButton: {
        marginBottom: 10
    },
    detail: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: deviceHeight/3-60,
        width: deviceWidth
    }
});


export default ImagePreview;