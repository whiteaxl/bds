'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';
import moment from 'moment';
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
    AlertIOS,
    StatusBar,
    ListView } from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelandIcon from '../components/RelandIcon';
import MapView from 'react-native-maps';

import SearchHeader from '../components/search/SearchMapHeader';
import PriceMarker from '../components/marker/PriceMarker';
import PriceMarker2 from '../components/marker/PriceMarker2';

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

import LocationMarker from '../components/marker/LocationMarker';

import * as Animatable from 'react-native-animatable';

import Swiper from 'react-native-swiper';

import GiftedSpinner from "../components/GiftedSpinner";

import AdsRow from '../components/search/AdsRow';

var { width, height } = Dimensions.get('window');

var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import cfg from "../cfg";

import CommonUtils from '../lib/CommonUtils';

const noCoverUrl = cfg.noCoverUrl;

var imageHeight = 143;

const ASPECT_RATIO = width / (height-44);

const PADDING = 0.00000005;
const LATITUDE = 15.91246021276861;
const LONGITUDE = 105.7527299557314;
const LATITUDE_DELTA = 15.43258937437489;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var id = 0;
var currentAdsIndex = 0;

const delayDuration = 500;

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
];

function createMarkerObject(item, duplicate) {
    let marker = {
        coordinate: {latitude: item.place.geo.lat, longitude: item.place.geo.lon},
        price: item.giaFmt,
        id: item.adsID,
        loaiTin: item.loaiTin,
        loaiNhaDat: item.loaiNhaDat,
        cover: item.image.cover,
        diaChi: item.place.diaChi,
        dienTich: item.dienTich,
        dienTichFmt: item.dienTichFmt,
        soPhongNguFmt: item.soPhongNguFmt,
        soTangFmt: item.soTangFmt,
        duplicate: duplicate
    };
    return marker;
}

function getAllUniquePosAds(listAds) {
    let dupCount = {};
    let markerList = [];
    let markerData = [];
    let dupMarker = {};
    if (listAds) {
        for (var i=0; i<listAds.length; i++) {
            var item = listAds[i];
            if (item.place && item.place.geo.lat && item.place.geo.lon) {
                let indexOfItem = markerData.findIndex((oldItem) =>
                Math.abs(oldItem.place.geo.lat - item.place.geo.lat) <= PADDING
                && Math.abs(oldItem.place.geo.lon - item.place.geo.lon) <= PADDING);
                if (markerData.length === 0 || indexOfItem === -1) {
                    dupCount[item.adsID] = 1;
                    markerData.push(item);
                    let marker = createMarkerObject(item, dupCount[item.adsID]);
                    markerList.push(marker);
                    dupMarker[item.adsID] = [marker];
                } else {
                    let validAdsId;
                    let oldMarker = markerList[indexOfItem];
                    if ((item.gia && item.gia != -1) && ((!markerData[indexOfItem].gia || markerData[indexOfItem].gia == -1)
                        || item.gia < markerData[indexOfItem].gia)) {
                        validAdsId = item.adsID;
                        let oldAdsId = oldMarker.id;
                        dupCount[validAdsId] = dupCount[oldAdsId] + 1;
                        markerData[indexOfItem] = item;
                        let marker = createMarkerObject(item, dupCount[validAdsId]);
                        dupMarker[validAdsId] = [];
                        dupMarker[validAdsId] = dupMarker[validAdsId].concat(dupMarker[oldAdsId]);
                        dupMarker[validAdsId].push(marker);
                        dupCount[oldAdsId] = 0;
                        dupMarker[oldAdsId] = [];
                        markerList[indexOfItem] = marker;
                        oldMarker.duplicate = dupCount[validAdsId];
                    } else {
                        validAdsId = oldMarker.id;
                        dupCount[validAdsId] = dupCount[validAdsId] + 1;
                        let marker = createMarkerObject(item, dupCount[validAdsId]);
                        dupMarker[validAdsId].push(marker);
                        oldMarker.duplicate = dupCount[validAdsId];
                    }
                }
            }
        }
    }
    return {markerData: markerData, markerList: markerList, dupCount: dupCount, dupMarker: dupMarker};
}

function mapStateToProps(state) {
  console.log("SearchResultMap.mapStateToProps");
  let currentUser = state.global.currentUser;
  let allUniquePosAds = getAllUniquePosAds(state.search.result.listAds);
  let maxAdsInMapView = state.global.setting.maxAdsInMapView;
  return {
    ... state,
    listAds: state.search.result.listAds,
    errorMsg: state.search.result.errorMsg,
    totalCount: state.search.result.totalCount,
    diaChinhFullName: state.search.form.fields.diaChinh.fullName,
    loggedIn: state.global.loggedIn,
    adsLikes: currentUser && currentUser.adsLikes,
    userID: currentUser && currentUser.userID,
    loading: state.search.loadingFromServer,
    allUniquePosAds: allUniquePosAds,
    maxAdsInMapView: maxAdsInMapView,
    uploadingLikedAds: state.search.uploadingLikedAds
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
    // this._onShowMessage();
    if (this.props.listAds.length == 0) {
        setTimeout(this._doRefreshListData.bind(this), 1000);
    } else {
        this._onShowMessage();
    }
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
    StatusBar.setBarStyle('light-content');

    var region = this.getInitialRegion();

    this.state = {
      modal: false,
      mapType: "Standard",
      mmarker:{},
      openLocalInfo: false,
      openDraw: false,
      drawPressed: false,
      openDetailAdsModal: false,
      markedList:[],
      editing: null,
      region: region,
      coordinate : null,
      circle:{},
      // pageNo: 1,
      showMessage: false,
      endMsgAnimation: true,
      mounting: true,
      positionSearchPress: false,
      searchTime: moment().toDate().getTime(),
      noAdsCount: 0
    };
  }

  getInitialRegion() {
    var {viewport} = this.props.search.form.fields;
    var region = viewport && Object.keys(viewport).length == 2 ? apiUtils.getRegionByViewport(viewport) : {};
    if (Object.keys(region).length <= 0 || isNaN(region.latitude)) {
      region = {latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA};
    }
    return region;
  }

  _getHeaderTitle() {
      let diaChinh = this.props.search.form.fields.diaChinh;

      //1. Search by diaChinh, then name = diaChinh's name
      if (this.props.search.map.polygons && this.props.search.map.polygons.length) {
          //placeName = `[${r.latitude}, ${r.longitude}]`
          return 'Trong khu vực vẽ tay';
      }

      if (this.props.search.drawMode) {
        return 'Vẽ khu vực muốn tìm';
      }

      if (this.props.search.form.fields.center && Object.keys(this.props.search.form.fields.center).length > 0) {
        return 'Xung quanh vị trí hiện tại';
      }

      let placeName;
      let r = this.state.region;
      //2. Search by Polygon: name is just center
      if (diaChinh.tinhKhongDau) {
        placeName = diaChinh.fullName;
      } else if (diaChinh.fullName) {
          placeName = diaChinh.fullName;
      } else { //others: banKinh or currentLocation
          placeName = gui.KHUNG_NHIN_HIEN_TAI;
      }

      return placeName;
  }
  refreshRegion() {
    var region = this.getInitialRegion();
    this.props.actions.onSearchFieldChange("pageNo", 1);
    this.setState({region: region});
  }
  render() {
    console.log("Call SearchResultMap.render, this.state.region=", this.state.region);

    let {loading, listAds, errorMsg} = this.props;

    console.log("SearchResultMap: number of data " + listAds.length);

    let viewableList = this._getViewableAds();

    //placeName = this.props.diaChinhFullName
    let placeName = this._getHeaderTitle();

    let allMarkers = [];
    if (!this.props.search.drawMode || (!this.props.loading && !this.state.editing && this.props.search.map.polygons &&
        this.props.search.map.polygons.length > 0)) {
      for (let i=0; i < viewableList.length; i++) {
        let marker = viewableList[i];
        let isSelectedMarker = this.state.mmarker && this.state.mmarker.id == marker.id;
        allMarkers.push(
            <MapView.Marker key={i} coordinate={marker.coordinate} style={{zIndex: isSelectedMarker ? viewableList.length : i}}
                // onSelect={()=>this._onMarkerPress(marker)}
                // onDeselect={this._onMarkerDeselect.bind(this)}
                            onPress={()=>this._onMarkerPress(marker, i)}>
              {marker.duplicate == 1 ?
              <PriceMarker color={isSelectedMarker ? '#E73E21' :
                    (this.state.markedList.indexOf(marker.id)>=0 ? "grey" : gui.mainColor)} amount={marker.price}/> :
              <PriceMarker2 duplicate={marker.duplicate} color={isSelectedMarker ? '#E73E21' :
                    (this.state.markedList.indexOf(marker.id)>=0 ? "grey" : gui.mainColor)} amount={marker.price}/>
              }
            </MapView.Marker>);
      }
    }
    let {polygons} = this.props.search.map;
    let showPoline = (!polygons || polygons.length === 0) && this.state.editing;

    let {mounting, openDraw, showMessage, endMsgAnimation} = this.state;
    let numberOfAds = listAds.length;

    let showTotalAds = !loading && !mounting && !openDraw && (errorMsg || numberOfAds > 0 && (showMessage || !endMsgAnimation));
    let headerHeight = 70;
    if(showTotalAds){
      headerHeight = 95;
    }

    return (
      <View style={styles.fullWidthContainer}>

        <View style={styles.map}>
          <MapView
              ref="map"
              region={this.state.region}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
              style={styles.mapView}
              mapType={this.state.mapType.toLowerCase()}
              rotateEnabled={false}
              showsUserLocation={true}
              // followUserLocation={true}

          >
            {allMarkers}
            {this.props.search.map.polygons.map(polygon => (
                <MapView.Polygon
                    key={polygon.id}
                    coordinates={polygon.coordinates}
                    strokeColor={gui.mainColor}
                    fillColor="rgba(0,168,230,0.3)"
                    strokeWidth={3}
                />
            ))}
            {showPoline && (
                <MapView.Polyline
                    coordinates={this.state.editing.coordinates}
                    strokeColor={gui.mainColor}
                    fillColor="rgba(0,168,230,0.3)"
                    strokeWidth={3}
                />
            )}
            {this._renderMapCircle()}
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
            {/*this.state.coordinate ? <MapView.Marker coordinate={this.state.coordinate}>
              <LocationMarker iconName={'cur-pos'} size={30} animation={true}/>
            </MapView.Marker> : null*/}
            <View pointerEvents={this.state.openDraw ? "auto" : "none"}
                  style={{width: width, height: height-44, backgroundColor: 'transparent'}}
                  {...this._panResponder.panHandlers}>
            </View>
          </MapView>

            <View>
                <LinearGradient colors={['rgba(184, 184, 184, 0.85)', 'transparent']}
                                style={styles.linearGradient}>
                    <Text style={{height: headerHeight}}></Text>
                    <View style={styles.search}>
                        <SearchHeader placeName={placeName} containerForm="SearchResultMap"
                                      refreshRegion={() => this.refreshRegion()} onShowMessage={() => this._onShowMessage()}
                                      isHeaderLoading={() => this._isHeaderLoading()}
                                      loadHomeData={this.props.actions.loadHomeData}
                                      owner={'map'}
                                      isNotFoundAds={() => this._isNotFoundAds()}/>
                    </View>

                    {this._renderTotalResultView()}

                </LinearGradient>
            </View>

            <View style={styles.mapButtonContainer}>
            {this._renderNSearchMap()}    
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

        {this._renderLoadingOrNotFoundView()}

        <View style={styles.tabbar}>
          <View style={styles.searchListButton}>
            <Button onPress={this._onLocalInfoPressed.bind(this)}
                    style={[styles.searchListButtonText, {textAlign: 'left', paddingLeft: 17}]}>Tiện ích</Button>
            <Button onPress={this._onSaveSearchPressed.bind(this)}
                    style={[styles.searchListButtonText, {fontWeight : '500'}]}>Lưu tìm kiếm</Button>
            <Button onPress={this._onListPressed}
                    style={[styles.searchListButtonText, {textAlign: 'right', paddingRight: 17}]}>Danh sách</Button>
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

      </View>
    )
  }

  _renderMapCircle(){
        var circle = this.state.circle;
        if (JSON.stringify(circle) != JSON.stringify({})){
            return (
                <MapView.Circle
                    key={circle.center.latitude + circle.center.longitude + circle.radius}
                    center={circle.center}
                    radius={circle.radius}
                    fillColor="rgba(165,207,255,0.5)"
                    strokeColor="#00a8e6"
                    position="absolute"
                    zIndex={1}
                    strokeWidth={1}
                />
            )
        }
  }

  _isHeaderLoading() {
        return this.props.loading;
  }

  _renderAdsModal() {
    let {dupMarker} = this.props.allUniquePosAds;
    let selectedDupMarkers = dupMarker[this.state.mmarker.id];
    if (!selectedDupMarkers) {
        selectedDupMarkers = [];
    }
    let allItems = [];
    let i = 0;
      selectedDupMarkers.map((mmarker) => {
      let markerId = mmarker.id;
      allItems.push(
          <View style={styles.detailAdsModal} key={i++}>
            <TouchableOpacity onPress={() => {this._onDetailAdsPress(markerId)}}>
              <Image style={styles.detailAdsModalThumb} source={{uri: `${mmarker.cover}`}}
                     defaultSource={CommonUtils.getNoCoverImage()}>
                <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                style={styles.detailAdsModalLinearGradient}>
                  <View style={styles.detailAdsModalDetail}>
                    <View>
                      <Text style={styles.detailAdsModalPrice}>{mmarker.price}</Text>
                      <Text style={styles.detailAdsModalText}>{this._getDiaChi(mmarker.diaChi)}{this._getMoreInfo(mmarker)}</Text>
                    </View>
                    {this.renderLikeIcon(markerId)}
                  </View>
                </LinearGradient>
              </Image>
            </TouchableOpacity>
          </View>
      );
    });
    let modalContent = null;
    let modalHeight = allItems.length <= 1 ? imageHeight : (allItems.length > 2 ? imageHeight*2.25 : imageHeight*2);
    if (allItems.length <= 1) {
        modalContent = allItems;
    } else {
        let ds = myDs.cloneWithRows(allItems);
        modalContent =
            <ListView
                ref={(listView) => { this._listView = listView; }}
                dataSource={ds}
                renderRow={this.renderRow.bind(this)}
                stickyHeaderIndices={[]}
                initialListSize={1}
                style={styles.searchListView}
            />;
    }

    return (
        <Modal animationDuration={100} style={[styles.adsModal,{height: modalHeight}]} isOpen={this.state.openDetailAdsModal} position={"bottom"}
               ref={"detailAdsModal"} isDisabled={false} onPress={() => {this._onDetailAdsPress(this.state.mmarker.id)}}>
            {modalContent}
          </Modal>
      );

  }

    renderLikeIcon(adsID) {
        let isLiked = this.isLiked(adsID);
        // let color = isLiked ? '#A2A7AD' : 'white';
        let color = 'white';
        let bgColor = isLiked ? '#E50064' : '#4A443F';
        let bgStyle = isLiked ? {} : {opacity: 0.55};
        if (this.props.uploadingLikedAds.uploading && this.props.uploadingLikedAds.adsID == adsID){
            return (
                <View style={{position: "absolute", left: Dimensions.get('window').width-37}}>
                    <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                        <GiftedSpinner size="small" color="white"/>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{position: "absolute", left: Dimensions.get('window').width-57}}>
                    <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                        <MHeartIcon onPress={() => this.onLike(adsID)} color={color} bgColor={bgColor} bgStyle={bgStyle} size={19} />
                    </View>
                </View>);
        }
    }

    _getDiaChi(param){
        var diaChi = param;
        var originDiaChi = param;
        if (diaChi) {
            var maxDiaChiLength = 25;
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

    _getMoreInfo(mmarker) {
        var loaiTin = mmarker.loaiTin;
        var loaiNhaDat = mmarker.loaiNhaDat;
        var dienTich = '';
        if (mmarker.dienTichFmt && mmarker.dienTichFmt != 'Không rõ') {
            dienTich = ' · ' + mmarker.dienTichFmt;
        }
        var soPhongNgu = '';
        if (mmarker.soPhongNguFmt) {
            soPhongNgu = "   " + mmarker.soPhongNguFmt;
        }

        var soTang = '';
        if (mmarker.soTangFmt) {
            soTang = "   " + mmarker.soTangFmt;
        }
        var moreInfo = '';
        var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
        if (loaiNhaDat == loaiNhaDatKeys[1]) {
            moreInfo = dienTich + soPhongNgu;
        }
        else if ( !loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
            || (loaiNhaDat == loaiNhaDatKeys[3])
            || (loaiNhaDat == loaiNhaDatKeys[4])) ||
            loaiTin && ((loaiNhaDat == loaiNhaDatKeys[2])
            || (loaiNhaDat == loaiNhaDatKeys[3])
            || (loaiNhaDat == loaiNhaDatKeys[6]))) {
            moreInfo = dienTich + soTang;
        }
        else {
            moreInfo = dienTich;
        }
        return moreInfo;
    }

  renderRow(rowData) {
      return (
          rowData
      );
  }

  isLiked(adsID) {
    const {adsLikes} = this.props;
    return adsLikes && adsLikes.indexOf(adsID) > -1;
  }

  onLike(adsID) {
    if (!this.props.loggedIn) {
      //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',0);
      Actions.Login();
    } else {
      if (!this.isLiked(adsID)) {
        this.props.actions.likeAds(this.props.userID, adsID);
      } else {
        this.props.actions.unlikeAds(this.props.userID, adsID);
      }
    }
  }

  onrefreshCurrentAds(index) {
    let viewableList = this._getViewableAds();
    currentAdsIndex = index;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
  }
  _onNextAds() {
    let viewableList = this._getViewableAds();
    if (currentAdsIndex >= viewableList.length-1) {
      return;
    }
    currentAdsIndex++;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
  }

  _onPreviousAds() {
    let viewableList = this._getViewableAds();
    if (currentAdsIndex <= 0) {
      return;
    }
    currentAdsIndex--;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
  }

  _renderNextButton() {
    let {pageNo} = this.props.search.form.fields;
    let limit = this.props.maxAdsInMapView;
    let totalPages = this.props.totalCount/ limit;
    let hasNextPage = pageNo < totalPages;
    return (
        <View style={styles.nextButton}>
          {!hasNextPage ?
              <View style={styles.pagingView}>
                <RelandIcon name="next" color={'#C5C2BA'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={20} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 9, color: '#C5C2BA'}]}>Sau</Text>
              </View> :
              <TouchableOpacity onPress={this._doNextPage.bind(this)} >
                <View style={styles.pagingView}>
                  <RelandIcon name="next" color={'black'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={20} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 9, color: 'black'}]}>Sau</Text>
                </View>
              </TouchableOpacity>}
        </View>
    );
  }

  _renderPreviousButton() {
    let {pageNo} = this.props.search.form.fields;
    let hasPreviousPage = pageNo > 1;
    return (
        <View style={styles.previousButton}>
          {!hasPreviousPage ?
              <View style={styles.pagingView}>
                <RelandIcon name="previous" color={'#C5C2BA'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={20} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 9, color: '#C5C2BA'}]}>Trước</Text>
              </View> :
              <TouchableOpacity onPress={this._doPreviousPage.bind(this)} >
                <View style={styles.pagingView}>
                  <RelandIcon name="previous" color={'black'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={20} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 9, color: 'black'}]}>Trước</Text>
                </View>
              </TouchableOpacity>}
        </View>
    );
  }

  _renderRefreshButton() {
    return (
        this.props.global.setting.autoLoadAds ? null :
            <View style={styles.refreshButton}>
              <TouchableOpacity onPress={this._doRefreshListData.bind(this)} >
                <View style={styles.pagingView}>
                  <RelandIcon name="refresh" color={'black'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={20} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 9, color: 'black'}]}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
    );
  }

  _renderCurrentPosButton() {
    let {region} = this.state;
    let {center} = this.props.search.form.fields;
    let isCurrentPos = center && Math.abs(center.lat - region.latitude) <= PADDING
        && Math.abs(center.lon - region.longitude) <= PADDING;
    let color = isCurrentPos ? gui.mainColor : 'black';
    return (
        <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
          <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
            <RelandIcon name="direction" color={color} mainProps={{flexDirection: 'row'}}
                        size={20} textProps={{paddingLeft: 0}}
                        noAction={true}></RelandIcon>
          </View>
        </TouchableOpacity>
    );
  }

  _renderNSearchMap() {
        return (
            <TouchableOpacity onPress={this._onMMapSearch.bind(this)} >
                <View style={[styles.bubble, styles.button, {marginTop: 5}]}>
                    <RelandIcon name="share" color='black' mainProps={{flexDirection: 'row'}}
                                size={20} textProps={{paddingLeft: 0}}
                                noAction={true}></RelandIcon>
                </View>
            </TouchableOpacity>
        );
  }

  _onMMapSearch(){
      if (!this.state.positionSearchPress){
          this.setState({positionSearchPress: true});
          let location = {lat: this.state.region.latitude, lon: this.state.region.longitude};
          Actions.MMapSearch({ onPress: this._onVitri.bind(this), location: this.state.region });
      } else {
          this.setState({positionSearchPress: false});

          this.props.actions.onSearchFieldChange("circle", {});

          this.setState({circle: {}});
      }
  }

  _onVitri(circle) {
        var region = JSON.parse(JSON.stringify(this.state.region));
        region.latitude = circle.center.latitude;
        region.longitude = circle.center.longitude;


        let sCircle = {
            center: {
                lat: circle.center.latitude,
                lon: circle.center.longitude
            },
            radius: circle.radius/1000
        }

        this._refreshListData(null, null, this._onSetupMessageTimeout.bind(this), null, null, null, 1, false, sCircle);

        this.props.actions.onSearchFieldChange("circle", sCircle);

        this.setState({
            region: region,
            circle: circle});
  }
    
  _renderDrawButton() {
    let drawIconColor = this.props.search.map.polygons && this.props.search.map.polygons.length == 0 && this.props.search.drawMode ? gui.mainColor : 'black';
    return (
        <TouchableOpacity onPress={this._onDrawPressed.bind(this)} >
          <View style={[styles.bubble, styles.button, {flexDirection: 'column'}]}>
            {this.props.search.map.polygons && this.props.search.map.polygons.length > 0 ? (
                <RelandIcon name="close" color='black' mainProps={{flexDirection: 'row'}}
                            size={15} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>) :
                (
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                      {/*<Icon name="hand-o-up" style={styles.mapIcon} color={this.props.search.drawMode ? gui.mainColor : 'black'}
                            size={20}></Icon>*/}
                      <RelandIcon name="hand-o-up" color={this.props.search.drawMode ? gui.mainColor : 'black'}
                                  mainProps={{flexDirection: 'row'}}
                                  size={20} textProps={{paddingLeft: 0}}
                                  noAction={true}></RelandIcon>
                      <Text style={[styles.drawIconText, {color: drawIconColor}]}>Vẽ tay</Text>
                    </View>
                )}
          </View>
        </TouchableOpacity>
    );
  }

  _doPreviousPage() {
    console.log("Call SearchResultMap._doPreviousPage");
    let {pageNo} = this.props.search.form.fields;
    if (pageNo > 1) {
      pageNo = pageNo - 1;
      this._onUpdateChangePageStatus(pageNo);
      this._refreshListData(null, null, this._onSetupMessageTimeout.bind(this), null, null, null, pageNo, true);
      this._onShowMessage();
    }
  }

  _doNextPage() {
    console.log("Call SearchResultMap._doNextPage");
    let {pageNo} = this.props.search.form.fields;
    let limit = this.props.maxAdsInMapView;
    let totalPages = this.props.totalCount/ limit;

    if (pageNo < totalPages) {
        pageNo = pageNo + 1;
        this._onUpdateChangePageStatus(pageNo);
        this._refreshListData(null, null, this._onSetupMessageTimeout.bind(this), null, null, null, pageNo, true);
        this._onShowMessage();
    }
  }

  _onUpdateChangePageStatus(pageNo) {
      this.props.actions.onSearchFieldChange("pageNo", pageNo);
      this.setState({mounting: false});
  }

    _isNotFoundAds() {
        let {loading, listAds, errorMsg} = this.props;
        let {mounting, openDraw, drawPressed} = this.state;
        let numberOfAds = listAds.length;
        return !loading && !mounting && !openDraw &&
            !errorMsg && !drawPressed && numberOfAds == 0;
    }

    _renderLoadingOrNotFoundView(){
        console.log("Call SearchResultMap._renderLoadingOrNotFoundView");
        let {loading, listAds, errorMsg} = this.props;
        let {mounting, openDraw, drawPressed} = this.state;
        let numberOfAds = listAds.length;

        if(loading || mounting || openDraw){
            return (<View style={styles.resultContainer}>
                {/*<Animatable.View animation={this.props.search.showMessage ? "fadeIn" : "fadeOut"}
                 duration={this.props.search.showMessage ? 500 : 3000}>
                 <View style={[styles.resultText]}>
                 <Text style={styles.resultIcon}>  Đang tải dữ liệu ... </Text>
                 </View>
                 </Animatable.View>*/}
                <View style={styles.loadingContent}>
                    {loading ? <GiftedSpinner color="white" /> : null}
                </View>
            </View>)
        }

        let {noAdsCount} = this.state;
        if (errorMsg || drawPressed || numberOfAds > 0) {
            if (noAdsCount) {
                this.setState({noAdsCount: 0});
            }
            return null;
        }

        let textValue = gui.INF_KhongCoKetQua;
        let textNotFound2 = gui.INF_KhongCoKetQua2;
        let fontWeight = '600';
        let backgroundColor = 'white';
        let textColor = 'black';

        if (noAdsCount === 1) {
            textNotFound2 = gui.INF_KhongCoKetQua3;
        }

        return (<View style={styles.resultContainer}>
            <Animatable.View animation={"fadeIn"}
                             duration={500}>
                <View style={[styles.resultText, {marginTop: 0, backgroundColor: backgroundColor}]}>
                    <Text style={[styles.resultIcon, {fontWeight: fontWeight, color: textColor}]}>  {textValue} </Text>
                    <Text style={[styles.resultIcon, {color: textColor}]}>  {textNotFound2} </Text>
                    {this._renderAllRegionButton()}
                </View>
            </Animatable.View>
        </View>)
    }

  _renderTotalResultView(){
    console.log("Call SearchResultMap._renderTotalResultView");
    let {loading, totalCount, listAds, search, errorMsg} = this.props;
    let {showMessage, mounting, openDraw} = this.state;
    let {pageNo} = search.form.fields;
    let limit = this.props.maxAdsInMapView;
    let numberOfAds = listAds.length;

    if(loading || mounting || openDraw){
      return null;
    }

    let beginAdsIndex = (pageNo-1)*limit+1;
    let endAdsIndex = (pageNo-1)*limit+numberOfAds;
    let rangeAds = totalCount > this.props.maxAdsInMapView ? (endAdsIndex > 0 ? beginAdsIndex + "-" + endAdsIndex : "0") + " / " + totalCount : numberOfAds;
    let textValue = "Đang hiển thị từ " + rangeAds + " kết quả";
    let fontWeight = 'normal';
    let backgroundColor = 'transparent';
    let textColor = 'white';
    if (errorMsg) {
        textValue = errorMsg;
    }
    else if (numberOfAds == 0) {
        return null;
    }
    else if (totalCount == 0 || (totalCount == numberOfAds && totalCount <= this.props.maxAdsInMapView)) {
      textValue = "Đang hiển thị " + rangeAds + " kết quả";
    }

    return (<View style={styles.resultContainer}>
      <Animatable.View animation={showMessage || errorMsg ? "fadeIn" : "fadeOut"}
                       duration={showMessage || errorMsg ? 500 : 3000}
                       onAnimationEnd={() => this.setState({endMsgAnimation: !showMessage && !errorMsg})}
                       onAnimationBegin={() => this.setState({endMsgAnimation: false})} >
        <View style={[styles.resultText, {marginTop: 0, opacity: 1, backgroundColor: backgroundColor}]}>
            <Text style={[styles.resultIcon, {fontWeight: fontWeight, color: textColor}]}>  {textValue} </Text>
        </View>
      </Animatable.View>
    </View>)
  }

  _renderAllRegionButton() {
      let buttonText = '';
      let buttonEvent = null;
      let {noAdsCount} = this.state;
      if (noAdsCount === 1) {
          buttonText = 'Thay đổi điều kiện lọc';
          buttonEvent = () => {Actions.Search2({needBack:true, onShowMessage: this._onShowMessage.bind(this),
              refreshRegion: this.refreshRegion.bind(this), owner: 'map'})};
      } else {
          buttonText = 'Xem tất cả';
          buttonEvent = this._onAllRegion.bind(this);
      }

      return (
          <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={buttonEvent} >
              <View style={styles.allRegion}>
                  <Text style={styles.allRegionButton}>{buttonText}</Text>
              </View>
          </TouchableOpacity>
      );
  }

  _onAllRegion() {
      let diaChinh = {fullName : gui.KHUNG_NHIN_HIEN_TAI};
      this.props.actions.onSearchFieldChange("diaChinh", diaChinh);
      this.props.actions.onPolygonsChange([]);
      this.props.actions.onSearchFieldChange("polygon", []);
      this.props.actions.onSearchFieldChange("pageNo", 1);
      this.props.actions.onSearchFieldChange("center", null);
      this._refreshListData(null, [], () => {this._refreshAfterAllRegionPressed();this._onSetupMessageTimeout()}, {}, false, diaChinh, 1);
      setTimeout(this._refreshAfterAllRegionPressed.bind(this), 2000);
  }

  _refreshAfterAllRegionPressed() {
      let {listAds} = this.props;
      let {noAdsCount} = this.state;
      let numberOfAds = listAds.length;
      if (numberOfAds === 0 && !noAdsCount) {
          this.setState({noAdsCount: 1});
      }
  }

  _getViewableAds(){
      let allMarkerList = this.props.allUniquePosAds.markerList;
      // let markerList = [];
      // let {pageNo} = this.state;
      // console.log('markerData length', allMarkerList.length);
      // for (var i=0; i<allMarkerList.length; i++) {
      //   if (i < (pageNo-1)*this.props.maxAdsInMapView || i >= pageNo*this.props.maxAdsInMapView) {
      //     continue;
      //   }
      //   let marker = allMarkerList[i];
      //   markerList.push(marker);
      // }
      // return markerList;
      return allMarkerList;
    }

  _onRegionChangeComplete(region) {
    console.log("Call SearhResultMap._onRegionChangeComplete");

    // this.state.region = region;
    this.setState({
      region :region
    });

    if (this.props.listAds.length > 0 && !this.hasRegionChange(region)) {
      return;
    }

    this.setState({openDetailAdsModal: false,
        openLocalInfo: false, showMessage: false});

    if (this.props.global.setting.autoLoadAds){
      let viewport = apiUtils.getViewport(region);
      this.props.actions.onSearchFieldChange("viewport", viewport);
      this.props.actions.onSearchFieldChange("pageNo", 1);
      this._refreshListData(viewport, null, this._onSetupMessageTimeout.bind(this));
    }
  }

  hasRegionChange(region) {
    let oldRegion = this.state.region;
    return !(oldRegion && Math.abs(oldRegion.latitude - region.latitude) <= PADDING
        && Math.abs(oldRegion.longitude - region.longitude) <= PADDING
        // && Math.abs(oldRegion.latitudeDelta - region.latitudeDelta) <= PADDING
        && Math.abs(oldRegion.longitudeDelta - region.longitudeDelta) <= PADDING);
  }

  _doRefreshListData() {
    this.props.actions.onSearchFieldChange("pageNo", 1);
    let viewport = {};
    if (this.props.global.setting.autoLoadAds){
        viewport = this.props.search.form.fields.viewport;
    } else {
        viewport = apiUtils.getViewport(this.state.region);
    }
    this.props.actions.onSearchFieldChange("viewport", viewport);
    this.setState({markedList: []});
    this._refreshListData(viewport, null, this._onSetupMessageTimeout.bind(this));
  }

  _refreshListData(newViewport, newPolygon, refreshCallback, newCenter, excludeCount, newDiaChinh, newPageNo, isAppend, newCircle) {
    console.log("Call SearhResultMap._refreshListData");
    var {loaiTin, ban, thue, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, viewport, diaChinh, center, huongNha, ngayDaDang,
        polygon, pageNo, circle} = this.props.search.form.fields;
    let limit = this.props.maxAdsInMapView;
    var isHavingCount = excludeCount ? false : true;

    let mcircle = null;

    console.log("================= print new circle");
    console.log(newCircle);
    console.log("================= print new circle end");

    var fields = {
      loaiTin: loaiTin,
      ban: ban,
      thue: thue,
      soPhongNguSelectedIdx: soPhongNguSelectedIdx,
      soNhaTamSelectedIdx : soNhaTamSelectedIdx,
      dienTich: dienTich,
      orderBy: orderBy,
      viewport: newViewport || viewport,
      diaChinh: newDiaChinh || diaChinh,
      center: newCenter || center,
      radiusInKmSelectedIdx: radiusInKmSelectedIdx,
      huongNha: huongNha,
      ngayDaDang: ngayDaDang,
      polygon: newPolygon || polygon,
      circle: newCircle || circle,
      pageNo: !isAppend ? 1 : newPageNo || pageNo,
      limit: limit,
      isIncludeCountInResponse: isHavingCount};
    console.log('fields', fields);
    var ms = moment().toDate().getTime();
    var previousSearchTime = this.state.searchTime;
    this.setState({searchTime: ms});
    if (ms -  previousSearchTime > delayDuration) {
        fields.updateLastSearch = false;

        this.props.actions.search(
            fields
            , refreshCallback
            , (error) => {});
        if (!isAppend) {
            this.setState({mounting: false, drawPressed: false});
            this._onShowMessage();
        }
    }
  }

  _onShowMessage() {
      console.log("Call SearchResultMap._onShowMessage");
    this.setState({openDetailAdsModal: false,
        openLocalInfo: false, showMessage: true, mounting: false});
    this._onSetupMessageTimeout();
  }

  _onSetupMessageTimeout() {
      console.log("Call SearchResultMap._onSetupMessageTimeout");
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({showMessage: false}), 5000);
  }

  _renderLocalInfoModal(){
    return (
     <Modal style={[styles.modal]} isOpen={this.state.openLocalInfo} position={"center"} ref={"localInfoModal"} isDisabled={false}
            backdrop={false} onClosingState={this._onCloseLocalInfo.bind(this)}>
      <View style={styles.modalHeader}>
        <View style={{flexDirection: "row", alignItems: "flex-start",position:'absolute', left:15, top: 13}}>
          <RelandIcon mainProps={{paddingRight: 30, paddingBottom: 20}}
                      name="close" color={gui.mainColor} size={15} onPress={this._onCloseLocalInfo.bind(this)}/>
        </View>
        <Text style={styles.modalHeaderText}>Tiện ích</Text>
      </View>
      <View style={styles.modalTitle}>
         <Text style={styles.modalTitleText}>Loại bản đồ</Text>
      </View>
      <View style={{marginTop: 10}}>
        <SegmentedControlIOS
            values={DanhMuc.getDanhMucValues(DanhMuc.MapText)}
            selectedIndex={DanhMuc.MapType.indexOf(this.state.mapType)}
            onChange={this._onMapTypeChange.bind(this)}
            tintColor={gui.mainColor} height={30} width={width-70}
        >
        </SegmentedControlIOS>
      </View>
    </Modal>
    )
  }

  _onCurrentLocationPress(){
    console.log("Call SearchResultMap._onCurrentLocationPress");

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
            latitudeDelta: gui.LATITUDE_DELTA,
            longitudeDelta: gui.LONGITUDE_DELTA
          };

          this.setState({
            region :region
          });

          let viewport = apiUtils.getViewport(region);

          this.props.actions.onSearchFieldChange("viewport", viewport);
          this.props.actions.onPolygonsChange([]);
          this.props.actions.onSearchFieldChange("polygon", []);
          this.props.actions.onSearchFieldChange("diaChinh", {fullName: gui.VI_TRI_HIEN_TAI});
          this.props.actions.onSearchFieldChange("pageNo", 1);

          let center = {lat: region.latitude, lon: region.longitude};

          this.props.actions.onSearchFieldChange("center", center);
          this._refreshListData(viewport, [], this._onSetupMessageTimeout.bind(this), center);
        },
        (error) => {
          alert(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _onDrawPressed(){
    console.log("SearchResultMap._onDrawPressed");

    var {polygons} = this.props.search.map;
    var openDraw = !polygons || polygons.length === 0;
    var drawPressed = !polygons || polygons.length <= 2;
    if (!this.props.search.drawMode && openDraw) {
      this.props.actions.abortSearch();
      clearTimeout(this.timer);
      this.setState({
        openDetailAdsModal: false,
        openLocalInfo: false,
        editing: null,
        showMessage: false,
        openDraw: openDraw});
      this.props.actions.onResetAdsList();
      this.props.actions.onDrawModeChange(openDraw);
    } else {
      this.setState({
        openDetailAdsModal: false,
        openLocalInfo: false,
        editing: null,
        openDraw: false,
        drawPressed: drawPressed
      });
      this.props.actions.onDrawModeChange(false);
    }
    this.props.actions.onPolygonsChange([]);
    this.props.actions.onSearchFieldChange("polygon", []);
  }

  _onDetailAdsPress(markerId){
    console.log("Call SearchResultMap._onDetailAdsPress");
    Actions.SearchResultDetail({adsID: markerId});
  }

  _onMapTypeChange(event){
    this.setState({
      mapType: DanhMuc.MapType[event.nativeEvent.selectedSegmentIndex]
    });
    setTimeout(() => this.setState({
        openDetailAdsModal: false,
        openLocalInfo: false
    }), 100);
  }

  _onCloseLocalInfo(){
    this.setState({
      openDetailAdsModal: false,
      openLocalInfo: false
    });
  }

  _onCloseDraw(){
    console.log("SearchResultMap._onCloseDraw");

    this.setState({
      openDetailAdsModal: false,
      openLocalInfo: false,
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
    let {loading} = this.props;
    let {openDraw, openLocalInfo} = this.state;

    if (openLocalInfo || loading || openDraw) {
        return;
    }

    markedList.push(marker.id);
    currentAdsIndex = index;

    this.setState({
      openDetailAdsModal: true,
      openLocalInfo: false,
      mmarker: marker,
      markedList: markedList
    });
  }

  _onMarkerDeselect(){
    console.log("Call SearchResultMap._onMarkerDeselect");
    this.setState({openDetailAdsModal: false,
        openLocalInfo: false});
  }

  _onLocalInfoPressed() {
    console.log("On Local Info pressed!");
    this.setState({
      openDetailAdsModal: false,
      openLocalInfo: true
    });
  }

  _onSaveSearchPressed() {

     if (!this.props.loggedIn) {
         Actions.Login();
     } else {
         var name = this.props.diaChinhFullName;
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

    let token = this.props.global.currentUser.token;

    this.props.actions.saveSearch(this.props.global.currentUser.userID, saveSearch, token);
  }

  _onListPressed() {
    console.log("On List pressed!");
    Actions.SearchResultList({type: "replace", firstTimeFromMap: true});
    console.log("On List pressed completed!");
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
    let hasPolygon = polygons.length > 0 && polygons[0].coordinates.length > 2;
    if (hasPolygon) {
        var geoBox = apiUtils.getPolygonBox(polygons[0]);
        var region = apiUtils.getRegion(geoBox);
        var viewport = apiUtils.getViewport(region);
        var polygon = apiUtils.convertPolygon(polygons[0]);
        // this.props.actions.onSearchFieldChange("viewport", viewport);
        this.props.actions.onSearchFieldChange("polygon", polygon);
        this.props.actions.onPolygonsChange(polygons);
        // this.props.actions.onSearchFieldChange("diaChinh", {});
        this.props.actions.onSearchFieldChange("pageNo", 1);
        this._refreshListData(viewport, polygon, () => {this._closeDrawIfNoResult(viewport, region)}, {}, false, {});
    }
    this._updateMapView(polygons, hasPolygon);
  }

  _closeDrawIfNoResult(viewport, region) {
      clearTimeout(this.drawSearchTimer);
      if (this.props.listAds.length == 0) {
          setTimeout(() => this._onCloseDraw(), 50);
      } else {
          this.setState({region: region});
          this.props.actions.onSearchFieldChange("viewport", viewport);
          // this.props.actions.onSearchFieldChange("diaChinh", {});
          this._onDrawMapDone();
      }
  }

  _updateMapView(waitForSearchDone) {
      console.log("Call SearchResultMap._updateMapView");
      this._onSetupMessageTimeout();
      if (waitForSearchDone) {
          this.drawSearchTimer = setTimeout(() => {this._onDrawMapDone()}, 2000);
      } else {
          this._onDrawMapDone();
      }
  }

  _onDrawMapDone() {
      this.setState({
          openDetailAdsModal: false,
          openLocalInfo: false,
          editing: null,
          openDraw: false
      });
      this.props.actions.onDrawModeChange(false);
  }

  _refreshPolygons(gestureState) {
      console.log("Call SearchResultMap._refreshPolygons");
    var region = this.state.region;
    if (isNaN(region.latitude) || isNaN(region.longitude)) {
      return;
    }
    var x0 = this._previousLeft + gestureState.dx;
    var y0 = this._previousTop + gestureState.dy;
    var lat = region.latitude + (region.longitudeDelta/ASPECT_RATIO)*(0.5-(y0-22)/(height-44));
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
    searchListView:{
        marginTop: 0,
        margin: 0,
        backgroundColor: 'white'
    },
  loadingContent: {
    position: 'absolute',
    top: -33,
    left: 56,
    alignItems: 'center',
    justifyContent: 'center'
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
  wrapper: {
    backgroundColor: 'transparent'
  },
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
      textAlign: 'center',
      width: width/3
  },

  map: {
    flex: 1,
    marginTop: 0,
    marginBottom: 44
  },
  mapView: {
      flex: 1,
      position: 'absolute',
      height: height-44
  },
  title: {
      top:0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      backgroundColor: 'white'
  },
    linearGradient: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor : "transparent"
    },
  search: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      // backgroundColor: gui.mainColor,
      // opacity: 0.55,
      height: 70,
      // top:0,
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
    justifyContent: 'center',
    marginBottom:8
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
  mapIcon: {
  },
  resultIcon: {
    color: '#F53113',
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
    top: height-224,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  refreshButton: {
    position: 'absolute',
    top: height-114,
    left: width/2-21,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 43,
    height: 38,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  previousButton: {
    position: 'absolute',
    top: height-114,
    left: width/2-79,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 43,
    height: 38,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  nextButton: {
    position: 'absolute',
    top: height-114,
    left: width/2+37,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C2BA',
    width: 43,
    height: 38,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  pagingView: {
    paddingTop: 0,
    width: 35,
    height: 32,
    backgroundColor: 'transparent'
  },

  resultContainer: {
    position: 'absolute',
    top: 64,
    width: width,
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
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    opacity: 0.85
  },

  tabbar: {
    position: 'absolute',
    top: height-44,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor : 'lightgray'
  },
  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      alignItems: 'flex-end'
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
    fontSize: 16,
    fontWeight: '600',
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
    height: imageHeight,
    width: width,
    marginVertical: 0,
  },
  detailAdsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: imageHeight,
    width: width
  },
  detailAdsModalThumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: imageHeight,
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
    top: 83,
    width: width
  },
    allRegion: {
        margin: 9,
        padding: 4,
        paddingLeft: 58,
        paddingRight: 58,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gui.mainColor,
        borderRadius: 5,
        borderColor: 'transparent'
    },
    allRegionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: 'white',
        fontFamily: gui.fontFamily,
        fontWeight: 'normal',
        fontSize: 15
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);