'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {
    Text, View, Image, ListView, Dimensions, StatusBar
    , RecyclerViewBackedScrollView, TouchableHighlight, StyleSheet
} from 'react-native'

import {Actions} from 'react-native-router-flux';
import TruliaIcon from '../components/TruliaIcon';

import styles from './styles';
import SearchResultFooter from '../components/SearchResultFooter';

import LinearGradient from 'react-native-linear-gradient';

import Swiper from 'react-native-swiper';
import SearchHeader from '../components/SearchHeader';

import gui from '../lib/gui';

import DanhMuc from '../assets/DanhMuc';

import GiftedSpinner from "../components/GiftedSpinner";

import {MenuContext} from '../components/menu';

const actions = [
    globalActions
];

function mapStateToProps(state) {
    console.log("Call SearchResultList.mapStateToProps");
    console.log(state);
    return {
        listAds: state.search.result.listAds,
        loading: state.search.loadingFromServer,
        errorMsg: state.search.result.errorMsg,
        placeFullName: state.search.form.fields.place.fullName,
        place: state.search.form.fields.place
    };
}

function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        //actions: bindActionCreators(creators, dispatch),
        //dispatch
    };
}

var imgHeight = 181;

var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SearchResultList extends Component {
    constructor(props) {
        super(props);
        console.log("Call SearchResultList.constructor: ");
        StatusBar.setBarStyle('light-content');

        console.log(props);
    }

    _getListContent() {
        console.log("Call SearchResultList._getListContent");

        let myProps = this.props;
        if (myProps.loading) {
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
                    {/*<Text> Loading ... </Text>*/}
                    <GiftedSpinner />
                </View>
            )
        }

        if (myProps.errorMsg) {
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
                    <Text style={styles.welcome}>{myProps.errorMsg}</Text>
                </View>
            )
        }

        if (myProps.listAds.length === 0 ) {
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
                    <Text style = {gui.styles.defaultText}> {gui.INF_KhongCoKetQua} </Text>
                </View>
            )
        }

        let ds = myDs.cloneWithRows(myProps.listAds);
        //this.setState({dataSource:ds});

        return (
            <ListView
                dataSource={ds}
                renderRow={this.renderRow.bind(this)}
                renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
                style={myStyles.searchListView}
            />
        )
    }

    render() {
        console.log("Call SearchResultList render");
        console.log(this.props);
        return (
            <MenuContext style={{ flex : 1 }}>
            <View style={myStyles.fullWidthContainer}>
                <View style={myStyles.search}>
                    <SearchHeader placeName={this.props.placeFullName}/>
                </View>

                {this._getListContent()}

                <SearchResultFooter place={this.props.place} />
            </View>
            </MenuContext>
        )
    }

    _renderImageStack(rowData) {
        var imageIndex  = 0;
        if (rowData.image) {
            if (!rowData.image.images || rowData.image.images.length===0) {
                return (
                    <MyImage imageIndex={0} rowData={rowData} imageUrl={rowData.image.cover} />
                )
            }

            return rowData.image.images.map(imageUrl => {
                return <MyImage key={imageIndex} imageIndex={imageIndex++} rowData={rowData} imageUrl={imageUrl} />
            });

        } else {
            return (
                <MyImage imageIndex={0} rowData={rowData} imageUrl={''} />
            );
        }
    }

    renderRow(rowData, sectionID, rowID) {
        
        var diaChi = rowData.diaChi;
        var loaiNhaDat = rowData.loaiNhaDat;
        var dienTich = '';
        if (rowData.dienTich) {
            dienTich = '· ' + rowData.dienTichFmt;
        }
        var soPhongNgu = '';
        if (rowData.soPhongNguFmt) {
            soPhongNgu = " " + rowData.soPhongNguFmt;
        }

        var soTang = '';
        if (rowData.soTangFmt) {
            soTang = " " + rowData.soTangFmt;
        }
        var maxDiaChiLength = 25;

        var index = diaChi.indexOf(',', maxDiaChiLength - 5);
        var length = 0;
        if (index !== -1 && index <= maxDiaChiLength) {
            length = index;
        } else {
            index = diaChi.indexOf(' ', maxDiaChiLength - 5);
            length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
        }
        diaChi = diaChi.substring(0, length);
        if (diaChi.length < rowData.diaChi.length) {
            diaChi = diaChi + '...';
        }
        var moreInfo = this.getMoreInfo(loaiNhaDat, dienTich, soPhongNgu, soTang);

        return (
            <View key={rowData.adsID}>
                <View style={myStyles.detail}>
                    <Swiper style={myStyles.wrapper} height={imgHeight}
                            showsButtons={false} autoplay={false} loop={false}
                            onMomentumScrollEnd={function(e, state, context){console.log('index:', state.index)}}
                            dot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]} />}
                            activeDot={<View style={[myStyles.dot, {backgroundColor: 'transparent'}]}/>}
                    >
                        {this._renderImageStack(rowData)}
                    </Swiper>

                    <View style={myStyles.itemContent}
                          onStartShouldSetResponder={(evt) => false}
                          onMoveShouldSetResponder={(evt) => false}
                    >
                        <View
                            onStartShouldSetResponder={(evt) => false}
                            onMoveShouldSetResponder={(evt) => false}
                        >
                            <Text style={myStyles.price}
                                  onStartShouldSetResponder={(evt) => false}
                                  onMoveShouldSetResponder={(evt) => false}
                            >{rowData.giaFmt}</Text>
                            <Text style={myStyles.text}>{diaChi}{moreInfo}</Text>
                        </View>
                        <TruliaIcon name="heart-o" mainProps={myStyles.heartButton_45} color={'white'} size={23}/>
                    </View>

                </View>

            </View>
        );
    }

    getMoreInfo(loaiNhaDat, dienTich, soPhongNgu, soTang) {
        var moreInfo = '';
        if (loaiNhaDat == DanhMuc.LoaiNhaDatKey[1]) {
            moreInfo = ' ' + dienTich + soPhongNgu;
        }
        if ((loaiNhaDat == DanhMuc.LoaiNhaDatKey[2])
            || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[3])
            || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[4])) {
            moreInfo = ' ' + dienTich + soTang;
        }
        if ((loaiNhaDat == DanhMuc.LoaiNhaDatKey[5])
            || (loaiNhaDat == DanhMuc.LoaiNhaDatKey[6])) {
            moreInfo = ' ' + dienTich;
        }
        return moreInfo;
    }
}

class MyImage extends Component {
    render() {
        return(
        <View style={myStyles.slide} key={"img"+(this.props.imageIndex)}>
            <TouchableHighlight onPress={() => Actions.SearchResultDetail({adsID: this.props.rowData.adsID})}>
                <Image style={myStyles.thumb} source={{uri: `${this.props.imageUrl}`}}>
                    <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                                    style={myStyles.linearGradient2}>
                    </LinearGradient>
                </Image>
            </TouchableHighlight>
        </View>
        );
    }
}

// Later on in your styles..
var myStyles = StyleSheet.create({
    welcome: {
        marginTop: -50,
        marginBottom: 50,
        fontSize: 16,
        textAlign: 'center',
        margin: 10
    },
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    search: {
        backgroundColor: gui.mainColor,
        height: 30
    },
    searchContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {},
    slide: {
        justifyContent: 'center',
        backgroundColor: 'transparent'
        //
    },
    separator: {
        height: 0.5,
        backgroundColor: 'transparent'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
        bottom: 32
    },
    detail: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: "transparent"
    },
    linearGradient2: {
        marginTop: imgHeight / 2,
        height: imgHeight / 2,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: "transparent"
    },
    thumb: {
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        height: imgHeight,
        alignSelf: 'auto'
    },
    searchListView: {
        marginTop: 30,
        margin: 0,
        backgroundColor: 'gray'
    },

    searchListViewRowAlign: {
        position: 'absolute',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: imgHeight - 53,
        width: Dimensions.get('window').width
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 15,
        color: 'white'
    },
    text: {
        fontSize: 14,
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 15,
        marginBottom: 15,
        margin: 5,
        marginTop: 2,
        color: 'white'
    },
    heartButton: {
        marginBottom: 10,
        paddingRight: 18
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
