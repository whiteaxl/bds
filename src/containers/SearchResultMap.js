'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';


import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text,
    View,
    StyleSheet,
    Navigator,
    TouchableOpacity,
    Dimensions,
    Image,
    SegmentedControlIOS,
    PanResponder,
    AlertIOS } from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelandIcon from '../components/RelandIcon';
import MapView from 'react-native-maps';

import SearchHeader from '../components/SearchHeader';
import PriceMarker from '../components/PriceMarker';

import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';

import gui from '../lib/gui';
import log from '../lib/logUtil';
import DanhMuc from '../assets/DanhMuc';

import findApi from '../lib/FindApi';

import apiUtils from '../lib/ApiUtils';

import Button from 'react-native-button';

import PlaceUtil from '../lib/PlaceUtil';

import MHeartIcon from '../components/MHeartIcon';

import LocationMarker from '../components/LocationMarker';

import * as Animatable from 'react-native-animatable';

import Swipeout from '../components/MSwipeout2';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);

const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.08616620000177733;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var id = 0;
var currentAdsIndex = 0;

const MAX_VIEWABLE_ADS = 25;
/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
];

function mapStateToProps(state) {
  console.log("SearchResultMap.mapStateToProps");
  let currentUser = state.global.currentUser;

  return {
    ... state,
    listAds: state.search.result.listAds,
    viewport: state.search.result.viewport,
    errorMsg: state.search.result.errorMsg,
    placeFullName: state.search.form.fields.place.fullName,
    loggedIn: state.global.loggedIn,
    userID: currentUser && currentUser.userID,
    loading: state.search.loadingFromServer
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

class SearchResultMap extends Component {
  _panResponder = {}
  _previousLeft = 0
  _previousTop = 0

  componentWillMount() {
    this.state.showMessage = true;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
    });
    this._previousLeft = 20;
    this._previousTop = 84;
    this.getCurrentLocation();
  }

  componentDidMount() {
    //this._refreshListData(this.props.search.form.fields.geoBox, [], () => {});
    this.setState({showMessage: true});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({showMessage: false}), 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            coordinate : position.coords
          });
        },
        (error) => {
          alert(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  constructor(props) {
    console.log("Call SearchResultMap.constructor");
    super(props);

    var region = this.props.search.form.fields.region;  //always in reset mode, so this method will be called every time...

    this.state = {
      modal: false,
      mapType: "Standard",
      mmarker:{},
      openLocalInfo: false,
      openDraw: false,
      openDetailAdsModal: false,
      markedList:[],
      editing: null,
      oldRegion: {},
      newRegion: this.props.search.form.fields.region,
      region: region,
      showMessage: true,
      coordinate : null
    };
  }

  getInitialRegion() {
    var region = isNaN(this.props.search.map.region.latitude) ? this.props.search.form.fields.region : this.props.search.map.region;
    if (Object.keys(region).length <= 0 || isNaN(region.latitude)) {
      region = {latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA};
    }
    return region;
  }
  _getHeaderTitle() {
      let place = this.props.search.form.fields.place;

      //1. Search by diaChinh, then name = diaChinh's name
      if (this.props.search.polygons && this.props.search.polygons.length) {
          //placeName = `[${r.latitude}, ${r.longitude}]`
          return 'Tìm theo Vẽ tay';
      }

      let placeName;
      let r = this.state.region;
      //2. Search by Polygon: name is just center
      if (place.placeId) {
        placeName = place.fullName;
      } else { //others: banKinh or currentLocation
          //let geoBox = apiUtils.getBbox(r);
          //placeName = geoBox.toString()
          placeName = 'Tìm tất cả theo khung nhìn'
      }

      return placeName;
  }
  render() {
    console.log("Call SearchResultMap.render, this.state.region=", this.state.region);

    let place = this.props.search.form.fields.place;
    let radius = null;
    //let region = this.state.region;
    console.log("RenderMAP, this.props.search.form.fields.place:", place);
    if (PlaceUtil.isDiaDiem(place)) {
      radius = place.radiusInKm;
    }

    let listAds = this.props.listAds;

    console.log("SearchResultMap: number of data " + listAds.length);

    let viewableList = this._getViewableAds(listAds);

    var region = this.getInitialRegion();

      //placeName = this.props.placeFullName
      let placeName = this._getHeaderTitle();

    let allMarkers = [];
    if (!this.props.search.drawMode || (this.props.search.polygons && this.props.search.polygons.length > 0)) {
      for (let i=0; i < viewableList.length; i++) {
        let marker = viewableList[i];
        allMarkers.push(
            <MapView.Marker key={marker.id} coordinate={marker.coordinate}
                // onSelect={()=>this._onMarkerPress(marker)}
                // onDeselect={this._onMarkerDeselect.bind(this)}
                            onPress={()=>this._onMarkerPress(marker, i)}>
              <PriceMarker color={this.state.mmarker && this.state.mmarker.id == marker.id ? '#E73E21' :
                    (this.state.markedList.indexOf(marker.id)>=0 ? "grey" : gui.mainColor)} amount={marker.price}/>
            </MapView.Marker>);
      }
    }
    return (
      <View style={styles.fullWidthContainer}>

        <View style={styles.search}>
          <SearchHeader placeName={placeName} containerForm="SearchResultMap"/>
        </View>

        <View style={styles.map}>
          <MapView
              ref="map"
              region={region}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
              style={styles.mapView}
              mapType={this.state.mapType.toLowerCase()}
          >
            {allMarkers}
            {this.props.search.polygons.map(polygon => (
                <MapView.Polygon
                    key={polygon.id}
                    coordinates={polygon.coordinates}
                    strokeColor={gui.mainColor}
                    fillColor="rgba(0,168,230,0.5)"
                    strokeWidth={2}
                />
            ))}
            {this.state.editing && (
                <MapView.Polyline
                    coordinates={this.state.editing.coordinates}
                    strokeColor={gui.mainColor}
                    fillColor="rgba(0,168,230,0.5)"
                    strokeWidth={2}
                />
            )}
            {/*
            {
              !this.state.editing && radius && (<MapView.Circle
                  key = {"" + region.longitude + region.latitude + radius}
                  center = {{longitude: this.state.region.longitude, latitude: this.state.region.latitude}}
                  radius = {radius * 1000}
                  strokeColor="#000"
                  fillColor="rgba(255,0,0,0.1)"
                  strokeWidth={1}
                />
              )
            }
             */}
            {this.state.coordinate ? <MapView.Marker coordinate={this.state.coordinate}>
              <LocationMarker iconName={'local-info'} size={30} animation={true}/>
            </MapView.Marker> : null}
          </MapView>
          <View style={styles.mapButtonContainer}>
            {this._renderDrawButton()}
            {this._renderCurrentPosButton()}
          </View>

          {this._renderRefreshButton()}
          {this._renderPreviousButton()}
          {this._renderNextButton()}

        </View>

        {/*
        <Image
          style={{height: 40, width: 40, position: "absolute", top: height/2, left:width/2}}
          resizeMode={Image.resizeMode.contain}
          source={require('../assets/image/map/circle_center.png')}
        />
        */}

        {this._renderTotalResultView()}

        <View style={styles.tabbar}>
          <View style={styles.searchListButton}>
            <Button onPress={this._onLocalInfoPressed.bind(this)}
                    style={styles.searchListButtonText}>Tiện ích</Button>
            <Button onPress={this._onSaveSearchPressed.bind(this)}
                    style={[styles.searchListButtonText, {fontWeight : '500'}]}>Lưu tìm kiếm</Button>
            <Button onPress={this._onListPressed}
                    style={styles.searchListButtonText}>Danh sách</Button>
            {/*<Icon.Button onPress={this._onLocalInfoPressed.bind(this)}
                         name="location-arrow" backgroundColor="white"
                         underlayColor="gray" color={gui.mainColor}
                         style={styles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this._onSaveSearchPressed}
                         name="hdd-o" backgroundColor="white"
                         underlayColor="gray" color={gui.mainColor}
                         style={styles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this._onListPressed}
                         name="list" backgroundColor="white"
                         underlayColor="gray" color={gui.mainColor}
                         style={styles.searchListButtonText} >
              Danh sách
            </Icon.Button>*/}
          </View>
        </View>

        {this._renderAdsModal()}
        
        {this._renderLocalInfoModal()}

        {this._renderDrawModal()}
        
      </View>
    )
  }

  _renderAdsModal() {
    let viewableList = this._getViewableAds(this.props.listAds);
    let leftMarker = currentAdsIndex <= 0 ? null : viewableList[currentAdsIndex-1];
    let rightMarker = currentAdsIndex >= viewableList.length-1 ? null : viewableList[currentAdsIndex+1];
    return (
        <Modal animationDuration={100} style={styles.adsModal} isOpen={this.state.openDetailAdsModal} position={"bottom"}
               ref={"detailAdsModal"} isDisabled={false} onPress={this._onDetailAdsPress.bind(this)}>
          <Swipeout right={[{component: rightMarker ? <View style={styles.detailAdsModal}>
                <Image style={styles.detailAdsModalThumb} source={{uri: `${rightMarker.cover}`}} >
                  <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                  style={styles.detailAdsModalLinearGradient}>
                    <View style={styles.detailAdsModalDetail}>
                      <View>
                        <Text style={styles.detailAdsModalPrice}>{rightMarker.price}</Text>
                        <Text style={styles.detailAdsModalText}>{this._getDiaChi(rightMarker.diaChi)}</Text>
                      </View>
                      <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                        <MHeartIcon noAction={true} color={'white'} size={19} />
                      </View>
                    </View>
                  </LinearGradient>
                </Image>
            </View> : null, text: '', backgroundColor: 'transparent',
              width: width, height: 181}]} onSwipeRightSuccess={this._onNextAds.bind(this)}
                    left={[{component: leftMarker ? <View style={styles.detailAdsModal}>
                <Image style={styles.detailAdsModalThumb} source={{uri: `${leftMarker.cover}`}} >
                  <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                  style={styles.detailAdsModalLinearGradient}>
                    <View style={styles.detailAdsModalDetail}>
                      <View>
                        <Text style={styles.detailAdsModalPrice}>{leftMarker.price}</Text>
                        <Text style={styles.detailAdsModalText}>{this._getDiaChi(leftMarker.diaChi)}</Text>
                      </View>
                      <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                        <MHeartIcon noAction={true} color={'white'} size={19} />
                      </View>
                    </View>
                  </LinearGradient>
                </Image>
            </View> : null, text: '', backgroundColor: 'transparent',
              width: width, height: 181}]} onSwipeLeftSuccess={this._onPreviousAds.bind(this)}>
            <View style={styles.detailAdsModal}>
              <TouchableOpacity onPress={this._onDetailAdsPress.bind(this)}>
                <Image style={styles.detailAdsModalThumb} source={{uri: `${this.state.mmarker.cover}`}} >
                  <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                  style={styles.detailAdsModalLinearGradient}>
                    <View style={styles.detailAdsModalDetail}>
                      <View>
                        <Text style={styles.detailAdsModalPrice}>{this.state.mmarker.price}</Text>
                        <Text style={styles.detailAdsModalText}>{this._getDiaChi(this.state.mmarker.diaChi)}</Text>
                      </View>
                      <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                        <MHeartIcon noAction={true} color={'white'} size={19} />
                      </View>
                    </View>
                  </LinearGradient>
                </Image>
              </TouchableOpacity>
            </View>
          </Swipeout>
        </Modal>
    );
  }
  _onNextAds() {
    let viewableList = this._getViewableAds(this.props.listAds);
    if (currentAdsIndex >= viewableList.length-1) {
      return;
    }
    currentAdsIndex++;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
  }

  _onPreviousAds() {
    let viewableList = this._getViewableAds(this.props.listAds);
    if (currentAdsIndex <= 0) {
      return;
    }
    currentAdsIndex--;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
  }

  _renderNextButton() {
    return (
        <View style={styles.nextButton}>
          {this.props.search.polygons && this.props.search.polygons.length > 0 ?
              <View>
                <RelandIcon name="next" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={16} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Sau</Text>
              </View> :
              <TouchableOpacity onPress={this._doNextPage.bind(this)} >
                <View>
                  <RelandIcon name="next" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={16} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Sau</Text>
                </View>
              </TouchableOpacity>}
        </View>
    );
  }

  _renderPreviousButton() {
    return (
        <View style={styles.previousButton}>
          {this.props.search.polygons && this.props.search.polygons.length > 0 ?
              <View>
                <RelandIcon name="previous" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={16} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Trước</Text>
              </View> :
              <TouchableOpacity onPress={this._doPreviousPage.bind(this)} >
                <View>
                  <RelandIcon name="previous" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={16} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Trước</Text>
                </View>
              </TouchableOpacity>}
        </View>
    );
  }

  _renderRefreshButton() {
    return (
        this.props.search.autoLoadAds ? null :
            <View style={styles.refreshButton}>
              {this.props.search.polygons && this.props.search.polygons.length > 0 ?
                  <View>
                    <RelandIcon name="refresh" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                                size={16} textProps={{paddingLeft: 0}}
                                noAction={true}></RelandIcon>
                    <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Refresh</Text>
                  </View> :
                  <TouchableOpacity onPress={this._doRefreshListData.bind(this)} >
                    <View>
                      <RelandIcon name="refresh" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                                  size={16} textProps={{paddingLeft: 0}}
                                  noAction={true}></RelandIcon>
                      <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Refresh</Text>
                    </View>
                  </TouchableOpacity>}
            </View>
    );
  }

  _renderCurrentPosButton() {
    return (
        this.props.search.polygons && this.props.search.polygons.length > 0 ?
            <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
              <RelandIcon name="local-info" color='black' mainProps={{flexDirection: 'row'}}
                          size={20} textProps={{paddingLeft: 0}}
                          noAction={true}></RelandIcon>
            </View> :
            <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
              <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
                <RelandIcon name="local-info" color='black' mainProps={{flexDirection: 'row'}}
                            size={20} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
              </View>
            </TouchableOpacity>
    );
  }
  _renderDrawButton() {
    let drawIconColor = this.props.search.polygons && this.props.search.polygons.length == 0 && this.props.search.drawMode ? gui.mainColor : 'black';
    return (
        <TouchableOpacity onPress={this._onDrawPressed.bind(this)} >
          <View style={[styles.bubble, styles.button, {flexDirection: 'column'}]}>
            {this.props.search.polygons && this.props.search.polygons.length > 0 ? (
                <RelandIcon name="close" color='black' mainProps={{flexDirection: 'row'}}
                            size={13} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>) :
                (
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                      <Icon name="hand-o-up" style={styles.mapIcon} color={this.props.search.drawMode ? gui.mainColor : 'black'}
                            size={20}></Icon>
                      <Text style={[styles.drawIconText, {color: drawIconColor}]}>Vẽ tay</Text>
                    </View>
                )}
          </View>
        </TouchableOpacity>
    );
  }

  _doPreviousPage() {
    if (this.props.search.polygons && this.props.search.polygons.length > 0) {
      return;
    }
    let pageNo = this.props.search.form.fields.pageNo;
    if (pageNo <= 1) {
      return;
    }
    pageNo = pageNo - 1;
    this.props.actions.onSearchFieldChange("pageNo", pageNo);
    this._refreshListData(this.props.search.form.fields.geoBox, [], () => {}, pageNo);
  }

  _doNextPage() {
    if (this.props.search.polygons && this.props.search.polygons.length > 0) {
      return;
    }
    let pageNo = this.props.search.form.fields.pageNo;

    let totalPages = this.props.search.countResult/ this.props.search.form.fields.limit;

    if (pageNo >= totalPages) {
      return;
    }

    pageNo = pageNo + 1;
    this.props.actions.onSearchFieldChange("pageNo", pageNo);
    this._refreshListData(this.props.search.form.fields.geoBox, [], () => {}, pageNo);
  }

  _renderTotalResultView(){
    let {loading, counting, listAds, search} = this.props;
    let numberOfAds = listAds.length;
    let countResult = search.countResult;
    let pageNo = search.form.fields.pageNo;
    let limit = search.form.fields.limit;
    let endAdsIndex = (pageNo-1)*limit+numberOfAds;
    let rangeAds = (endAdsIndex > 0 ? ((pageNo-1)*limit+1) + "-" + endAdsIndex : "0") + " / " + (countResult > 0 ? countResult: endAdsIndex);
    let textValue = rangeAds + " tin tìm thấy được hiển thị. Zoom bản đồ để xem thêm";

    if(loading || counting){
      console.log("SearchResultMap_renderTotalResultView");
      console.log(this.props.search.form.fields.region);
      console.log(this.props.search.map.region);
      return (<View style={styles.resultContainer}>
        <Animatable.View animation={this.state.showMessage ? "fadeIn" : "fadeOut"}
                         duration={this.state.showMessage ? 500 : 1000}>
          <View style={[styles.resultText]}>
            <Text style={styles.resultIcon}>  Đang tải dữ liệu ... </Text>
          </View>
        </Animatable.View>
      </View>)
    }

    return (<View style={styles.resultContainer}>
      <Animatable.View animation={this.state.showMessage ? "fadeIn" : "fadeOut"}
                       duration={this.state.showMessage ? 500 : 1000}>
        <View style={[styles.resultText]}>
            <Text style={styles.resultIcon}>  {textValue} </Text>
        </View>
      </Animatable.View>
    </View>)
  }

  _getViewableAds(listAds){
      var markerList = [];

      if (listAds) {
        var i = 0;
        listAds.map(function(item){
          if (item.place.geo.lat && item.place.geo.lon && i < MAX_VIEWABLE_ADS) {
            let marker = {
              coordinate: {latitude: item.place.geo.lat, longitude: item.place.geo.lon},
              price: item.giaFmt,
              id: item.adsID,
              cover: item.image.cover,
              diaChi: item.place.diaChi,
              dienTich: item.dienTich
                      };
                      markerList.push(marker);
                      i++;
                  }
              });
          }
          return markerList;
      }

  _onRegionChangeComplete(region) {
    console.log("Call SearhResultMap._onRegionChangeComplete");

    this.state.region = region;
    // this.setState({
    //   region :region
    // });

    this.props.actions.onMapChange("region", region);
    this.props.actions.onSearchFieldChange("region", region);

    var geoBox = apiUtils.getBbox(region);
    this.props.actions.onSearchFieldChange("geoBox", geoBox);

    if (this.props.search.autoLoadAds && this.props.search.polygons.length <= 0){
      this.props.actions.onSearchFieldChange("pageNo", 1);
      this._refreshListData(geoBox, [], () => {}, 1);
    }
  }

  _doRefreshListData() {
    if (this.props.search.polygons && this.props.search.polygons.length > 0) {
      return;
    }
    this.props.actions.onSearchFieldChange("pageNo", 1);
    this._refreshListData(this.props.search.form.fields.geoBox, [], () => {}, 1);
  }

  _refreshListData(geoBox, polygon, refreshCallback, newPageNo) {
    console.log("Call SearhResultMap._refreshListData");
    var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soTangSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, place, huongNha, ngayDaDang, pageNo, limit} = this.props.search.form.fields;
    var fields = {
      loaiTin: loaiTin,
      loaiNhaDat: loaiNhaDat,
      soPhongNguSelectedIdx: soPhongNguSelectedIdx,
      soTangSelectedIdx: soTangSelectedIdx,
      soNhaTamSelectedIdx : soNhaTamSelectedIdx,
      dienTich: dienTich,
      gia: gia,
      orderBy: orderBy,
      geoBox: geoBox,
      place: place,
      radiusInKmSelectedIdx: radiusInKmSelectedIdx,
      huongNha: huongNha,
      ngayDaDang: ngayDaDang,
      polygon: polygon,
      pageNo: newPageNo || pageNo,
      limit: limit};

    this.props.actions.search(
        fields
        , refreshCallback);
    this.setState({openDetailAdsModal: false, showMessage: true});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({showMessage: false}), 5000);
  }

  _renderLocalInfoModal(){
    return (
     <Modal style={[styles.modal]} isOpen={this.state.openLocalInfo} position={"center"} ref={"localInfoModal"} isDisabled={false}
            backdrop={false} onClosingState={this._onCloseLocalInfo.bind(this)}>
      <View style={styles.modalHeader}>
        <TouchableOpacity style={{flexDirection: "row", alignItems: "flex-start",position:'absolute', left:15}}
                          onPress={this._onCloseLocalInfo.bind(this)}>
          <RelandIcon name="close" color={gui.mainColor} size={13} noAction={true}/>
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>Local info</Text>
      </View>
      <View style={styles.modalTitle}>
         <Text style={styles.modalTitleText}>Loại bản đồ</Text>
      </View>
      <View style={{marginTop: 10}}>
        <SegmentedControlIOS
            values={DanhMuc.MapType}
            selectedIndex={DanhMuc.MapType.indexOf(this.state.mapType)}
            onChange={this._onMapTypeChange.bind(this)}
            tintColor={gui.mainColor} height={30} width={width-70}
        >
        </SegmentedControlIOS>
      </View>
    </Modal>
    )
  }

  _renderDrawModal(){
    return (
        <Modal style={[styles.drawModel]} isOpen={this.state.openDraw} position={"center"} ref={"drawModal"}
               isDisabled={false} backdrop={false} onClosingState={this._onCloseDraw.bind(this)}>
          <View style={{width: width, height: height, backgroundColor: 'transparent'}}
              {...this._panResponder.panHandlers}>
          </View>
        </Modal>
    )
  }

  _onCurrentLocationPress(){
    console.log("Call SearchResultMap._onCurrentLocationPress");
    if (this.props.search.polygons && this.props.search.polygons.length > 0) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
          //this._requestNearby(position.coords.latitude, position.coords.longitude);
          let data = {
            currentLocation : {
              "lat": position.coords.latitude,
              "lon": position.coords.longitude
            }
          };

          var region = {
            latitude: data.currentLocation.lat,
            longitude: data.currentLocation.lon,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
          };

          this.setState({
            region :region
          });

          var geoBox = apiUtils.getBbox(region);

          this.props.actions.onSearchFieldChange("geoBox", geoBox);

          let place = this.props.search.form.fields.place;
          place.placeId = null;

          this.props.actions.onSearchFieldChange("place", place);
          this.props.actions.onSearchFieldChange("pageNo", 1);
          this._refreshListData(geoBox, [], () => {}, 1);

          this.props.actions.onMapChange("region", region);
        },
        (error) => {
          alert(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _onDrawPressed(){
    console.log("SearchResultMap._onDrawPressed");

    var {polygons} = this.props.search;
    var openDraw = !polygons || polygons.length === 0;
    if (openDraw) {
      this.props.actions.abortSearch();
      clearTimeout(this.timer);
      this.setState({
        showMessage: false,
        openDetailAdsModal: false,
        editing: null,
        openDraw: openDraw});
    } else {
      this.setState({
        openDetailAdsModal: false,
        editing: null,
        openDraw: openDraw
      });
    }
    this.props.actions.onDrawModeChange(openDraw);
    this.props.actions.onPolygonsChange([]);
    this.props.actions.onSearchFieldChange("polygon", []);
  }

  _onDetailAdsPress(){
    console.log("Call SearchResultMap._onDetailAdsPress");
    Actions.SearchResultDetail({adsID: this.state.mmarker.id});
  }

  _onMapTypeChange(event){
    this.setState({
      mapType: DanhMuc.MapType[event.nativeEvent.selectedSegmentIndex],
      openLocalInfo: false
    });
  }

  _onCloseLocalInfo(){
    this.setState({
      openLocalInfo: false
    });
  }

  _onCloseDraw(){
    console.log("SearchResultMap._onCloseDraw");

    this.setState({
      openDetailAdsModal: false,
      editing: null,
      openDraw: false
    });
    this.props.actions.onDrawModeChange(false);
    this.props.actions.onPolygonsChange([]);
    this.props.actions.onSearchFieldChange("polygon", []);
  }

  _onMarkerPress(marker, index) {
    console.log("Call SearchResultMap._onMarkerPress");
    console.log(marker.id);
    console.log(this.state.markedList);
    var markedList = this.state.markedList;

    markedList.push(marker.id);
    currentAdsIndex = index;

    this.setState({
      openDetailAdsModal: true,
      mmarker: marker,
      markedList: markedList
    });
  }

  _onMarkerDeselect(){
    console.log("Call SearchResultMap._onMarkerDeselect");
    this.setState({openDetailAdsModal: false});
  }

  _onLocalInfoPressed() {
    console.log("On Local Info pressed!");
    this.setState({
      openLocalInfo: true
    });
  }

  _onSaveSearchPressed() {
    if (!this.props.loggedIn) {
      Actions.LoginRegister({page:1});
    } else {
      var name = this.props.placeFullName;
      AlertIOS.prompt('Tên tìm kiếm cần lưu', 'Ví dụ: Gần chỗ làm, gần bệnh viện',
          [{
            text: 'Lưu lại',
            onPress: this._onSaveSearch.bind(this)
          }, {
            text: 'Thoát',
            style: 'cancel'
          }], 'plain-text', name);
    }
  }

  _onSaveSearch(name) {
    console.log("On Save Search pressed!", name);

    let saveSearch = {
      name : name,
      query : findApi.convertFieldsToQueryParams(this.props.search.form.fields),
      timeModified : new Date().getTime()
    };

    this.props.actions.saveSearch(this.props.userID, saveSearch);
  }

  _onListPressed() {
    console.log("On List pressed!");
    Actions.SearchResultList({type: "replace"});
    console.log("On List pressed completed!");
  }

  _getDiaChi(param){
    var diaChi = param;
    var originDiaChi = param;
    if (diaChi) {
      var maxDiaChiLength = 35;
      var index = diaChi.indexOf(',', maxDiaChiLength-5);
      var length = 0;
      if (index !== -1 && index <= maxDiaChiLength) {
        length = index;
      } else {
        index = diaChi.indexOf(' ', maxDiaChiLength-5);
        length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
      }
      diaChi = diaChi.substring(0,length);
      if (diaChi.length < originDiaChi.length) {
        diaChi = diaChi + '...';
      }
    }
    return diaChi;
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  _handlePanResponderGrant(e, gestureState) {
    this._previousLeft = gestureState.x0;
    this._previousTop = gestureState.y0;
  }

  _handlePanResponderMove(e, gestureState) {
    this._refreshPolygons(gestureState);
  }

  _handlePanResponderEnd(e, gestureState) {
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;

    var { editing } = this.state;
    var polygons = editing ? [editing] : [];

    if (polygons.length > 0) {
        var geoBox = apiUtils.getPolygonBox(polygons[0]);
        var polygon = apiUtils.convertPolygon(polygons[0]);
        this.props.actions.onSearchFieldChange("geoBox", geoBox);
        this.props.actions.onSearchFieldChange("polygon", polygon);
        this.props.actions.onSearchFieldChange("pageNo", 1);
        this._refreshListData(geoBox, polygon, () => this.setState({
          openDetailAdsModal: false,
          editing: null,
          openDraw: false
        }), 1);
    } else {
      this.setState({
        openDetailAdsModal: false,
        editing: null,
        openDraw: false
      });
    }
    this.props.actions.onDrawModeChange(false);
    this.props.actions.onPolygonsChange(polygons);
  }

  _refreshPolygons(gestureState) {
    var region = this.state.region;
    if (isNaN(region.latitude) || isNaN(region.longitude)) {
      return;
    }
    var x0 = this._previousLeft + gestureState.dx;
    var y0 = this._previousTop + gestureState.dy;
    var lat = region.latitude + region.latitudeDelta*(0.5-(y0-64)/(height-110));
    var lon = region.longitude + region.longitudeDelta*(x0/width-0.5);
    var coordinate = {latitude: lat, longitude: lon};
    var { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [coordinate]
        }
      });
    } else {
      this.setState({
        editing: {
          ...editing,
          coordinates: [
            ...editing.coordinates,
            coordinate
          ]
        }
      });
    }
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
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
  searchListButtonText: {
      marginTop: 10,
      paddingLeft: 0,
      fontSize: gui.buttonFontSize,
      fontFamily: gui.fontFamily,
      fontWeight : 'normal',
      color: '#1396E0',
      textAlign: 'center'
  },

  map: {
    flex: 1,
    marginTop: 0,
    marginBottom: 44
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
    opacity: 0.75,
    marginLeft: 15
  },
  mapIcon: {
  },
  resultIcon: {
    color: 'black',
    fontSize: gui.capitalizeFontSize,
    fontFamily: gui.fontFamily,
    fontWeight : 'normal',
    textAlign: 'center'
  },
  drawIconText: {
    fontSize: 9,
    fontFamily: gui.fontFamily,
    fontWeight : 'normal',
    textAlign: 'center'
  },
  text: {
    color: 'white',
  },
  mapButtonContainer: {
    position: 'absolute',
    top: height-241,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  refreshButton: {
    position: 'absolute',
    top: height-170,
    left: width/2-15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 30,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.75,
  },
  previousButton: {
    position: 'absolute',
    top: height-170,
    left: width/2-60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 30,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.75,
  },
  nextButton: {
    position: 'absolute',
    top: height-170,
    left: width/2+30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 30,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.75,
  },

  resultContainer: {
    position: 'absolute',
    top: 64,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  resultText: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.85
  },

  tabbar: {
    position: 'absolute',
    top: height-44,
    left: 0,
    right: 0,
    bottom: 0
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderColor : 'lightgray'
  },
  sumBds: {
    marginBottom: 10,
    paddingLeft: 20,
    color: 'white',
  },
  drawModel: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: height,
    width: width,
    marginVertical: 0,
    borderRadius: 5,
    backgroundColor: 'transparent'
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 150,
    width: width-40,
    marginVertical: 0,
    borderRadius: 5
  },
  modalHeader: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    marginVertical: 0,
    width: width-40,
    borderTopColor: '#f8f8f8',
    borderRadius: 5
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    color: '#606060',
    justifyContent :'center',
    alignItems: 'center',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  modalTitle: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 5,
    borderTopWidth: 1,
    marginVertical: 0,
    width: width-40,
    borderTopColor: '#f8f8f8',
    backgroundColor: '#f8f8f8'
  },
  modalTitleText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#606060',
    justifyContent :'space-between',
    alignItems: 'center',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  adsModal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 181,
    width: width,
    marginVertical: 0,
  },
  detailAdsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 181,
    width: width
  },
  detailAdsModalThumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: 181,
    width: width,
    alignSelf: 'auto'
  },
  detailAdsModalLinearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  detailAdsModalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  detailAdsModalText: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginBottom: 15,
    margin: 5,
    color: 'white'
  },
  detailAdsModalTextHeartButton: {
    marginBottom: 10
  },
  detailAdsModalDetail: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 121,
    width: width
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);