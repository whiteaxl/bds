'use strict';

import React, {Component} from 'react';

import { Text, View, StyleSheet, Navigator, TouchableOpacity,
    TouchableHighlight, Dimensions, StatusBar } from 'react-native'

import {Actions} from 'react-native-router-flux';
import MapView from 'react-native-maps';
import Button from 'react-native-button';

import TruliaIcon from '../TruliaIcon';

import gui from '../../lib/gui';

import log from '../../lib/logUtil';

import findApi from '../../lib/FindApi';

import placeUtil from '../../lib/PlaceUtil';

import RelandIcon from '../RelandIcon';

import utils from '../../lib/utils';

var Slider = require('react-native-slider');

import ScalableText from 'react-native-text';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.00616620000177733;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/**
 * ## Redux boilerplate
 */

class MMapSearch extends Component {

    constructor(props) {
        log.info("Call MMapSearch.constructor");
        super(props);
        StatusBar.setBarStyle('default');

        var location = props.location;

        var region ={}
        if (!location || !location.latitude ||location.latitude == '') {
            region.latitude = LATITUDE;
            region.longitude = LONGITUDE;
            region.latitudeDelta = LATITUDE_DELTA;
            region.longitudeDelta = LONGITUDE_DELTA;
        } else{
            region = location;
        }

        this.state = {
            showSuggestionPosition: props.showSuggestionPosition || false,
            region: region,
            firstRegion: region,
            diaChi: null,
            mapType: "standard",
            mapName: "Satellite",
            circle: {
                center: {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                },
                radius: 100,
            }
        }
    }

    _onThucHien(){
        this.props.onPress(this.state.circle);
        Actions.pop();
    }

    render() {
        log.info("Call MMapSearch.render");
        const { circle} = this.state;

        return (
            <View style={styles.fullWidthContainer}>

                <View style={styles.search}>
                    <HeaderMMapSearch backTitle={"Trở lại"} headerRightTitle={"Thực hiện" } onPress={this._onThucHien.bind(this)} />
                    <View style={styles.headerSeparator} />
                </View>
                <View style={styles.map}>
                    <MapView
                        region={this.state.region}
                        style={styles.mapView}
                        mapType={this.state.mapType}
                        onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
                    >
                        <MapView.Circle
                            key = {(circle.center.latitude + circle.center.longitude + circle.radius)}
                            center={circle.center}
                            radius={circle.radius}
                            fillColor="rgba(165,207,255,0.5)"
                            strokeColor="#00a8e6"
                            position="absolute"
                            zIndex={1}
                            strokeWidth={1}
                        />
                    </MapView>

                    {this._renderGooglePlaceAutoComplete()}
                    <View style={styles.positionIcon}>
                        <RelandIcon name="home-marker" color={gui.mainColor}
                                    size={30} textProps={{ paddingLeft: 0 }}
                        />
                    </View>
                    {this._renderButtonOnMap()}
                    <View style={styles.mapButtonContainer}>
                        <View style={styles.searchListButton}>
                            <View style={styles.viewTopNav}>
                                <ScalableText style={styles.textSpaceTop}>5 km xung quanh {this.state.diaChi  ? this.state.diaChi : 'Chọn địa điểm'}</ScalableText>
                            </View>
                            <View style={styles.viewCenterNav}>
                                <Slider
                                    value={this.state.value}
                                    onValueChange={this._setRadiusCenter.bind(this)}
                                    trackStyle={styles.track}
                                    thumbStyle={styles.thumb}
                                    minimumValue={0}
                                    maximumValue={10}
                                    step={1}
                                    minimumTrackTintColor='#00a8e6'
                                    maximumTrackTintColor='#b7b7b7'
                                />
                            </View>
                            {this._renderSliderView()}
                            <View style={styles.viewBottomNav}>
                                <View style={{flex:1, justifyContent:'center', alignItems:'flex-start', flexDirection:'row'}}>
                                    <Text style={styles.textBottomLeft}>{0.5*this.state.circle.radius/1000}</Text>
                                    <Text style={styles.textBottomCenter}>KM</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={styles.textBottomRight}>ALL OF VIETNAM</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _setRadiusCenter(radius){
        var circle = JSON.parse(JSON.stringify(this.state.circle));
        circle.radius = radius*1000;
        this.setState({
            circle: circle});
    }

    _renderSliderView(){
        return (
            <View style={styles.viewMeasure}>
                <View style={styles.sliderDotOne}></View>
                <View style={styles.sliderDotTwo}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotThree}></View>
                <View style={styles.sliderDotFour}></View>
            </View>
        );
    }

    _renderGooglePlaceAutoComplete() {
        return (
            <TouchableHighlight onPress={this._onPress.bind(this)} style={styles.touchSearch}>
                <View style={styles.searchTextContainer}>
                    <View style={{height:68, width:40, backgroundColor:'transparent', left:20, justifyContent:'center', alignItems:'flex-start'}}>
                        <RelandIcon name="search" color='#8a8a8a' mainProps={{marginTop:10, marginLeft:5}}
                                    size={25} textProps={{}}
                        />
                    </View>
                    <View style={styles.viewSearch}>
                        <Text style={styles.searchTextTop}>
                            Tìm kiếm từ :
                        </Text>
                        <ScalableText style={styles.searchTextBottom}>
                            {this.state.diaChi ? this.state.diaChi  : 'Chọn địa điểm'}
                        </ScalableText>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _onPress(){
        console.log("PostAdsMapView press place");
        Actions.PostAdsGoogleAutoComplete({onPress: (data, details)=>this._setRegionFromGoogleAutoComplete(data, details)});
    }

    _renderButtonOnMap(){
        return (
            <View style={styles.inMapButtonContainer}>
                {this._renderSuggestionPositionButton()}
                {this._renderCurrentPositionButton()}
            </View>
        );
    }
    _renderCurrentPositionButton() {
        return (
            <View >
                <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
                    <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
                        <RelandIcon name="direction" color='black' mainProps={{flexDirection: 'row'}}
                                    size={20} textProps={{paddingLeft: 0}}
                                    noAction={true}></RelandIcon>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderSuggestionPositionButton() {
        if (!this.props.showSuggestionPosition)
            return;

        return (
            <View >
                <TouchableOpacity onPress={this._onSuggestionLocationPress.bind(this)} >
                    <View style={[styles.bubble, styles.button, {flexDirection: 'column', width: 60}]}>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <RelandIcon name="hand-o-up" color={'black'}
                                        mainProps={{flexDirection: 'row'}}
                                        size={20} textProps={{paddingLeft: 0}}
                                        noAction={true}></RelandIcon>
                            <Text style={[styles.positionSuggetionIconText, {color: 'black'}]}>Vị trí gợi ý</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _onCurrentLocationPress() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                this.setState({region: region});
            },
            (error) => {
                console.log(error);
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    _onSuggestionLocationPress() {
        let region = this.state.firstRegion;
        this.setState({region: region});
        findApi.getGeocoding(region.latitude, region.longitude, this._getDiaChinhContent.bind(this));
    }

    _setRegionFromGoogleAutoComplete(data, details){

        if (details.geometry && details.geometry.location){
            let location = details.geometry.location;
            let region = {  latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            }
            this.setState({region: region});
        }

        Actions.pop();
    }

    _onRegionChangeComplete(region) {
        console.log("========== on region change complete");
        var circle = JSON.parse(JSON.stringify(this.state.circle));
        circle.center.latitude = region.latitude;
        circle.center.longitude = region.longitude
        this.setState({region: region, circle: circle});
        findApi.getGeocoding(region.latitude, region.longitude, this._getDiaChinhContent.bind(this));
    }

    _onApply() {
        var {region} = this.state;
        findApi.getGeocoding(region.latitude, region.longitude, this.geoCallback.bind(this));
        Actions.pop();
    }

    _getDiaChinhContent(data){
        var places = data.results;
        console.log(places);
        if (places.length > 0){
            var newPlace = places[0];
            for (var i=0; i<places.length; i++) {
                var xa = placeUtil.getXa(places[i]);
                if (xa != '') {
                    newPlace = places[i];
                    break;
                }
            }

            for (var i=0; i<places.length; i++) {
                var diaDiem = placeUtil.getDiaDiem(places[i]);
                if (diaDiem != '') {
                    break;
                }
            }

            var tinh = placeUtil.getTinh(newPlace);
            var huyen = placeUtil.getHuyen(newPlace);
            var xa = placeUtil.getXa(newPlace);

            let fullName = tinh;
            if (huyen && huyen!=''){
                fullName = huyen + ', ' + fullName;
            }

            if (xa && xa!=''){
                fullName = xa + ', ' + fullName;
            }

            if (diaDiem && diaDiem.length >0){
                fullName = diaDiem + ', ' + fullName;
            }

            console.log(fullName);

            this.setState({diaChi: fullName});

        }
    }


    geoCallback(data) {
        let location = {};
        var {region} = this.state;
        location.lat = region.latitude;
        location.lon = region.longitude;
        var places = data.results;

        console.log("===================== print result");
        console.log(places);
        console.log("===================== print result end");

        if (places.length > 0) {
            var newPlace = places[0];
            for (var i=0; i<places.length; i++) {
                var xa = placeUtil.getXa(places[i]);
                if (xa != '') {
                    newPlace = places[i];
                    break;
                }
            }

            for (var i=0; i<places.length; i++) {
                var diaDiem = placeUtil.getDiaDiem(places[i]);
                if (diaDiem != '') {
                    break;
                }
            }

            var tinh = placeUtil.getTinh(newPlace);
            var huyen = placeUtil.getHuyen(newPlace);
            var xa = placeUtil.getXa(newPlace);
            var diaChinh = {};
            diaChinh.tinh = tinh;
            diaChinh.huyen = huyen;
            diaChinh.xa = xa;
            diaChinh.tinhKhongDau = utils.locDau(tinh);
            diaChinh.huyenKhongDau = utils.locDau(huyen);
            diaChinh.xaKhongDau = utils.locDau(xa);

        }
        var placeType = 'T';
        if (diaChinh.huyenKhongDau)
            placeType = 'H';
        if (diaChinh.xaKhongDau)
            placeType = 'X';

        var diaChinhDto = {
            tinhKhongDau: diaChinh.tinhKhongDau || undefined,
            tinh: diaChinh.tinh,
            huyenKhongDau: diaChinh.huyenKhongDau || undefined,
            huyen: diaChinh.huyen,
            xaKhongDau: diaChinh.xaKhongDau || undefined,
            xa: diaChinh.xa,
            placeType: placeType
        }

        let position = {
            location: location,
            diaChi: this.state.diaChi,
            diaChinh: diaChinhDto
        }

        this.props.onPress(position);

    }

    _onCancel() {
        Actions.pop();
    }



}

class HeaderMMapSearch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View style={styles.customPageHeader}>
            <View style={styles.customPageTitle}>
                <Text style={styles.customPageTitleText}>
                    {this.props.headerTitle}
                </Text>
            </View>
            <TruliaIcon onPress={this._onBack}
                        name="arrow-left" color={gui.mainColor} size={25}
                        mainProps={styles.backButton} text={this.props.backTitle}
                        textProps={styles.backButtonText} >
            </TruliaIcon>
            <TouchableOpacity onPress={this.props.onPress} style={styles.customPageRightTitle}>
                <Text style={styles.customPageRightTitleText}>
                    {this.props.headerRightTitle}
                </Text>
            </TouchableOpacity>
        </View>
    }

    _onBack() {
        Actions.pop();
    }
    _returnLatLonPress() {
        console.log('=============== print lat lon position map circle ')
        // var {region} = this.state;

        this.props.onPress(this.state.circle);
        Actions.pop();
    }

}


// Later on in your styles..
var styles = StyleSheet.create({
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'transparent',
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        marginTop: 0,
        marginBottom: 0
    },
    mapView: {
        flex: 1,
        marginTop: 0,
        marginBottom: 0
    },
    title: {
        top:0,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    search: {
        top:0,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    mapIcon: {
        color: 'white',
        textAlign: 'center'
    },
    text: {
        color: 'white'
    },
    mapButtonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        backgroundColor: 'white'
    },
    buttonText: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal'
    },
    searchListButton: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: width,
        backgroundColor: 'transparent',
        height: 95,
        borderTopWidth:1,
        borderColor:'lightgray'
    },
    searchTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 25,
        width: width
    },
    searchTextTop: {
        fontFamily: gui.fontFamily,
        fontSize: 13,
        textAlign: 'left',
        paddingLeft:0,
        paddingTop:8,
        backgroundColor:'transparent',
        fontWeight:'300',
        width:width-80,
        height:30,
        color:'#676769'
    },
    searchTextBottom: {
        fontFamily: gui.fontFamily,
        fontSize: 15,
        textAlign: 'left',
        paddingLeft:0,
        paddingTop:3,
        backgroundColor:'transparent',
        fontWeight:'400',
        width:width-80,
        height:38,
        color:'#1d1d1d'

    },
    positionIcon: {
        position: 'absolute',
        top: (height-60-25-60)/2 + 15,
        left: width/2 - 8,
        justifyContent: 'center',
        borderColor: gui.mainColor,
        backgroundColor: 'transparent'
    },
    inMapButtonContainer: {
        position: 'absolute',
        bottom: 120,
        right:12,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 5,
        marginBottom: 0,
        backgroundColor: 'transparent',
    },
    bubble: {
        backgroundColor: gui.mainColor,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#C5C2BA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 43,
        height: 38,
        paddingVertical: 5,
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: 'white',
        opacity: 0.9,
        marginLeft: 15
    },
    positionSuggetionIconText: {
        fontSize: 9,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal',
        textAlign: 'center'
    },
    touchSearch:{
        position: 'absolute',
        top: 15,
        borderRadius:4,
        paddingLeft:0,
        marginLeft:15,
        marginRight:15,
        marginTop: 5,
        height:70,
        width:width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth:1,
        borderColor:'lightgray',
        opacity: 0.9,
    },
    viewSearch:{
        width:width-80,
        height:68,
        right:20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor:'white',
        marginLeft:-10
    },
    textSpaceTop:{
        fontSize: 14,
        color:'#333333',
        textAlign:'center',
        marginTop: 8
    },
    textBottomLeft:{
        fontSize: 13,
        flex:1,
        color:'#676769',
        textAlign:'right',
        paddingLeft:5,
        marginBottom: 5
    },
    textBottomCenter:{
        fontSize: 13,
        flex:5,
        paddingLeft:3,
        color:'#676769',
        textAlign:'left',
        marginBottom: 5,

    },
    textBottomRight:{
        fontSize: 13,
        flex:1,
        color:'#676769',
        textAlign:'right',
        paddingRight:10,
        marginBottom: 5
    },
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 0.35,
    },
    viewTopNav: {
        backgroundColor: 'white',
        height: 25,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewCenterNav: {
        backgroundColor: 'white',
        height: 40,
        width: width - 30,
        right: 15,
        left: 15,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection:'column'
    },
    viewBottomNav: {
        backgroundColor: 'white',
        height: 30,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewMeasure: {
        backgroundColor: 'white',
        height: 5,
        width: width - 30,
        right: 15,
        left: 15,
        bottom: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    sliderDotOne: {
        backgroundColor: '#00a8e6',
        height: 5,
        width: 5,
        left: 6
    },

    sliderDotTwo: {
        backgroundColor: '#00a8e6',
        height: 5,
        width: 5,
        marginLeft: (width - 30) / 10
    },
    sliderDotThree: {
        backgroundColor: '#00a8e6',
        height: 5,
        width: 5,
        marginLeft: (width - 30) / 10 - 7
    },
    sliderDotFour: {
        backgroundColor: '#00a8e6',
        height: 5,
        width: 5,
        marginLeft: (width - 30) / 10 - 6
    },
    customPageHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        height: 60
    },
    customPageTitle: {
        left:36,
        right:36,
        marginTop: 31,
        marginBottom: 10,
        position: 'absolute'
    },
    customPageRightTitle:{
        marginTop: 28,
        alignItems: 'flex-end',
        justifyContent: 'center',
        height:30,
        width: 80,
        right:18,
        marginBottom: 10,
        position: 'absolute',
        backgroundColor:'transparent'
    },
    customPageTitleText: {
        color: 'black',
        fontSize: gui.normalFontSize,
        fontWeight: 'bold',
        fontFamily: gui.fontFamily,
        textAlign: 'center'
    },
    customPageRightTitleText: {
        color: gui.mainColor,
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        textAlign: 'right',
        fontWeight:'500'
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
    }
});

export default MMapSearch;
