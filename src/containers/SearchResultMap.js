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
    AlertIOS,
    StatusBar } from 'react-native';

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

import Swiper from 'react-native-swiper';

import GiftedSpinner from "../components/GiftedSpinner";

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);

const PADDING = 0.000000000005;
const LATITUDE = 20.95389909999999;
const LONGITUDE = 105.75490945;
const LATITUDE_DELTA = 0.08616620000177733;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var id = 0;
var currentAdsIndex = 0;

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
    errorMsg: state.search.result.errorMsg,
    totalCount: state.search.result.totalCount,
    diaChinhFullName: state.search.form.fields.diaChinh.fullName,
    loggedIn: state.global.loggedIn,
    adsLikes: currentUser && currentUser.adsLikes,
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
    this._onShowMessage();
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
      openDetailAdsModal: false,
      markedList:[],
      editing: null,
      region: region,
      coordinate : null,
      pageNo: 1,
      showMessage: false
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
          return 'Tìm theo Vẽ tay';
      }

      let placeName;
      let r = this.state.region;
      //2. Search by Polygon: name is just center
      if (diaChinh.tinhKhongDau) {
        placeName = diaChinh.fullName;
      } else { //others: banKinh or currentLocation
          placeName = 'Tìm tất cả theo khung nhìn'
      }

      return placeName;
  }
  refreshRegion() {
    var region = this.getInitialRegion();
    this.setState({region: region});
  }
  render() {
    console.log("Call SearchResultMap.render, this.state.region=", this.state.region);

    let listAds = this.props.listAds;

    console.log("SearchResultMap: number of data " + listAds.length);

    let viewableList = this._getViewableAds(listAds);

    //placeName = this.props.diaChinhFullName
    let placeName = this._getHeaderTitle();

    let allMarkers = [];
    if (!this.props.loading && (!this.props.search.drawMode || (this.props.search.map.polygons && this.props.search.map.polygons.length > 0))) {
      for (let i=0; i < viewableList.length; i++) {
        let marker = viewableList[i];
        allMarkers.push(
            <MapView.Marker key={i} coordinate={marker.coordinate}
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
          <SearchHeader placeName={placeName} containerForm="SearchResultMap"
                        refreshRegion={() => this.refreshRegion()} onShowMessage={() => this._onShowMessage()}/>
        </View>

        <View style={styles.map}>
          <MapView
              ref="map"
              region={this.state.region}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
              style={styles.mapView}
              mapType={this.state.mapType.toLowerCase()}
          >
            {allMarkers}
            {this.props.search.map.polygons.map(polygon => (
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
              <LocationMarker iconName={'cur-pos'} size={30} animation={true}/>
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
    let allItems = [];
    let i = 0;
    viewableList.map((mmarker) => {
      let isLiked = this.isLiked(mmarker.id);
      let color = isLiked ? '#A2A7AD' : 'white';
      let bgColor = isLiked ? '#E50064' : '#4A443F';
      let bgStyle = isLiked ? {} : {opacity: 0.55};
      allItems.push(
          <View style={styles.detailAdsModal} key={i++}>
            <TouchableOpacity onPress={this._onDetailAdsPress.bind(this)}>
              <Image style={styles.detailAdsModalThumb} source={{uri: `${mmarker.cover}`}} >
                <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                style={styles.detailAdsModalLinearGradient}>
                  <View style={styles.detailAdsModalDetail}>
                    <View>
                      <Text style={styles.detailAdsModalPrice}>{mmarker.price}</Text>
                      <Text style={styles.detailAdsModalText}>{this._getDiaChi(mmarker.diaChi)}</Text>
                    </View>
                    <View style={[styles.detailAdsModalTextHeartButton, {paddingRight: 18, paddingTop: 9}]}>
                      <MHeartIcon onPress={() => this.onLike()} color={color} bgColor={bgColor} bgStyle={bgStyle} size={19} />
                    </View>
                  </View>
                </LinearGradient>
              </Image>
            </TouchableOpacity>
          </View>
      );
    });
    return (
        <Modal animationDuration={100} style={styles.adsModal} isOpen={this.state.openDetailAdsModal} position={"bottom"}
               ref={"detailAdsModal"} isDisabled={false} onPress={this._onDetailAdsPress.bind(this)}>
          <Swiper style={styles.wrapper} height={181} index={currentAdsIndex}
                  onMomentumScrollEnd={(e, state) => {this.onrefreshCurrentAds(state.index)}}
                  showsButtons={false} autoplay={false} loop={false} bounces={true}
                  dot={<View style={[styles.dot, {backgroundColor: 'transparent'}]} />}
                  activeDot={<View style={[styles.dot, {backgroundColor: 'transparent'}]}/>}
          >
            {allItems}
          </Swiper>
        </Modal>
    );
  }

  isLiked(adsID) {
    const {adsLikes} = this.props;
    return adsLikes && adsLikes.indexOf(adsID) > -1;
  }

  onLike() {
    if (!this.props.loggedIn) {
      //this.props.actions.onAuthFieldChange('activeRegisterLoginTab',0);
      Actions.LoginRegister({page:1});
    } else {
      let adsIndex = (this.state.pageNo-1)*gui.MAX_VIEWABLE_ADS + currentAdsIndex;
      let ads = this.props.listAds[adsIndex];
      if (!this.isLiked(ads.adsID)) {
        this.props.actions.likeAds(this.props.userID, ads);
      }
    }
  }

  onrefreshCurrentAds(index) {
    let viewableList = this._getViewableAds(this.props.listAds);
    currentAdsIndex = index;
    let marker = viewableList[currentAdsIndex];
    this._onMarkerPress(marker, currentAdsIndex);
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
    let {pageNo} = this.state;
    let totalPages = this.props.totalCount/ gui.MAX_VIEWABLE_ADS;
    let hasNextPage = pageNo < totalPages;
    return (
        <View style={styles.nextButton}>
          {!hasNextPage ?
              <View>
                <RelandIcon name="next" color={'#C5C2BA'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={16} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 6, color: '#C5C2BA'}]}>Sau</Text>
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
    let {pageNo} = this.state;
    let hasPreviousPage = pageNo > 1;
    return (
        <View style={styles.previousButton}>
          {!hasPreviousPage ?
              <View>
                <RelandIcon name="previous" color={'#C5C2BA'} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                            size={16} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
                <Text style={[styles.drawIconText, {fontSize: 6, color: '#C5C2BA'}]}>Trước</Text>
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
        this.props.search.map.autoLoadAds ? null :
            <View style={styles.refreshButton}>
              <TouchableOpacity onPress={this._doRefreshListData.bind(this)} >
                <View>
                  <RelandIcon name="refresh" color={gui.mainColor} mainProps={{flexDirection: 'row', justifyContent: 'center'}}
                              size={16} textProps={{paddingLeft: 0}}
                              noAction={true}></RelandIcon>
                  <Text style={[styles.drawIconText, {fontSize: 6, color: gui.mainColor}]}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
    );
  }

  _renderCurrentPosButton() {
    return (
        this.props.search.map.polygons && this.props.search.map.polygons.length > 0 ?
            <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
              <RelandIcon name="direction" color='black' mainProps={{flexDirection: 'row'}}
                          size={20} textProps={{paddingLeft: 0}}
                          noAction={true}></RelandIcon>
            </View> :
            <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
              <View style={[styles.bubble, styles.button, {marginTop: 10}]}>
                <RelandIcon name="direction" color='black' mainProps={{flexDirection: 'row'}}
                            size={20} textProps={{paddingLeft: 0}}
                            noAction={true}></RelandIcon>
              </View>
            </TouchableOpacity>
    );
  }
  _renderDrawButton() {
    let drawIconColor = this.props.search.map.polygons && this.props.search.map.polygons.length == 0 && this.props.search.drawMode ? gui.mainColor : 'black';
    return (
        <TouchableOpacity onPress={this._onDrawPressed.bind(this)} >
          <View style={[styles.bubble, styles.button, {flexDirection: 'column'}]}>
            {this.props.search.map.polygons && this.props.search.map.polygons.length > 0 ? (
                <RelandIcon name="close" color='black' mainProps={{flexDirection: 'row'}}
                            size={13} textProps={{paddingLeft: 0}}
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
    let {pageNo} = this.state;
    if (pageNo > 1) {
      pageNo = pageNo - 1;
      this.setState({pageNo: pageNo});
    }
    this._onShowMessage();
  }

  _doNextPage() {
    let {pageNo} = this.state;

    let totalPages = this.props.totalCount/ gui.MAX_VIEWABLE_ADS;

    if (pageNo < totalPages) {
      pageNo = pageNo + 1;
      this.setState({pageNo: pageNo});
    }
    this._onShowMessage();
  }

  _renderTotalResultView(){
    let {loading, listAds, totalCount} = this.props;
    let {pageNo, showMessage} = this.state;
    let beginAdsIndex = (pageNo-1)*gui.MAX_VIEWABLE_ADS+1;
    let numberOfAds = listAds.length;
    if (numberOfAds > (pageNo-1)*gui.MAX_VIEWABLE_ADS) {
      numberOfAds = listAds.length > pageNo*gui.MAX_VIEWABLE_ADS ? gui.MAX_VIEWABLE_ADS : listAds.length - (pageNo-1)*gui.MAX_VIEWABLE_ADS;
    } else {
      numberOfAds = 0;
    }
    let endAdsIndex = (pageNo-1)*gui.MAX_VIEWABLE_ADS+numberOfAds;
    let rangeAds = totalCount > 0 && totalCount != numberOfAds ? (endAdsIndex > 0 ? beginAdsIndex + "-" + endAdsIndex : "0") + " / " + totalCount : numberOfAds;
    let textValue = "Đang hiển thị từ " + rangeAds + " tin nằm trong khung hình";

    if(loading){
      console.log("SearchResultMap_renderTotalResultView");
      return (<View style={styles.resultContainer}>
        {/*<Animatable.View animation={this.props.search.showMessage ? "fadeIn" : "fadeOut"}
                         duration={this.props.search.showMessage ? 500 : 3000}>
          <View style={[styles.resultText]}>
            <Text style={styles.resultIcon}>  Đang tải dữ liệu ... </Text>
          </View>
        </Animatable.View>*/}
        <View style={styles.loadingContent}>
          <GiftedSpinner size="large" />
        </View>
      </View>)
    }

    return (<View style={styles.resultContainer}>
      <Animatable.View animation={showMessage ? "fadeIn" : "fadeOut"}
                       duration={showMessage ? 500 : 3000}>
        <View style={[styles.resultText]}>
            <Text style={styles.resultIcon}>  {textValue} </Text>
        </View>
      </Animatable.View>
    </View>)
  }

  _getViewableAds(listAds){
      var markerList = [];
      let {pageNo} = this.state;

      if (listAds) {
        for (var i=0; i<listAds.length; i++) {
          if (i < (pageNo-1)*gui.MAX_VIEWABLE_ADS || i >= pageNo*gui.MAX_VIEWABLE_ADS) {
            continue;
          }
          var item = listAds[i];
          if (item.place && item.place.geo.lat && item.place.geo.lon) {
            let marker = {
              coordinate: {latitude: item.place.geo.lat, longitude: item.place.geo.lon},
              price: item.giaFmt,
              id: item.adsID,
              cover: item.image.cover,
              diaChi: item.place.diaChi,
              dienTich: item.dienTich
            };
            markerList.push(marker);
          }
        }
      }
      return markerList;
    }

  _onRegionChangeComplete(region) {
    console.log("Call SearhResultMap._onRegionChangeComplete");

    if (!this.hasRegionChange(region)) {
      return;
    }

    // this.state.region = region;
    this.setState({
      region :region
    });

    let viewport = apiUtils.getViewport(region);
    this.props.actions.onSearchFieldChange("viewport", viewport);

    if (this.props.search.map.autoLoadAds){
      this._refreshListData(viewport, null, this._onSetupMessageTimeout.bind(this));
    }
  }

  hasRegionChange(region) {
    let oldRegion = this.state.region;
    return !(oldRegion && Math.abs(oldRegion.latitude - region.latitude) <= PADDING
        && Math.abs(oldRegion.longitude - region.longitude) <= PADDING
        && Math.abs(oldRegion.latitudeDelta - region.latitudeDelta) <= PADDING
        && Math.abs(oldRegion.longitudeDelta - region.longitudeDelta) <= PADDING);
  }

  _doRefreshListData() {
    this._refreshListData(null, null, this._onSetupMessageTimeout.bind(this));
  }

  _refreshListData(newViewport, newPolygon, refreshCallback, newCenter, excludeCount, newDiaChinh) {
    console.log("Call SearhResultMap._refreshListData");
    var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, viewport, diaChinh, center, huongNha, ngayDaDang,
        polygon, pageNo, limit} = this.props.search.form.fields;
    var isHavingCount = excludeCount ? false : true;
    var fields = {
      loaiTin: loaiTin,
      loaiNhaDat: loaiNhaDat,
      soPhongNguSelectedIdx: soPhongNguSelectedIdx,
      soNhaTamSelectedIdx : soNhaTamSelectedIdx,
      dienTich: dienTich,
      gia: gia,
      orderBy: orderBy,
      viewport: newViewport || viewport,
      diaChinh: newDiaChinh || diaChinh,
      center: newCenter || center,
      radiusInKmSelectedIdx: radiusInKmSelectedIdx,
      huongNha: huongNha,
      ngayDaDang: ngayDaDang,
      polygon: newPolygon || polygon,
      pageNo: pageNo,
      limit: limit,
      isIncludeCountInResponse: isHavingCount};
    console.log('fields', fields);

    this.props.actions.search(
        fields
        , refreshCallback);
    this.setState({pageNo: 1});
    this._onShowMessage();
  }

  _onShowMessage() {
    this.setState({openDetailAdsModal: false, showMessage: true});
    this._onSetupMessageTimeout();
  }
  _onSetupMessageTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({showMessage: false}), 10000);
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
    if (this.props.search.map.polygons && this.props.search.map.polygons.length > 0) {
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

          let viewport = apiUtils.getViewport(region);

          this.props.actions.onSearchFieldChange("viewport", viewport);

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
    if (openDraw) {
      this.props.actions.abortSearch();
      clearTimeout(this.timer);
      this.setState({
        openDetailAdsModal: false,
        editing: null,
        showMessage: false,
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
        var region = apiUtils.getRegion(geoBox);
        var viewport = apiUtils.getViewport(region);
        var polygon = apiUtils.convertPolygon(polygons[0]);
        this.props.actions.onSearchFieldChange("viewport", viewport);
        this.props.actions.onSearchFieldChange("polygon", polygon);
        this.props.actions.onSearchFieldChange("diaChinh", {});
        this._refreshListData(viewport, polygon, () => {}, {}, false, {});
        this._updateMapView(polygons, region);
    } else {
        this._updateMapView(polygons);
    }
  }

  _updateMapView(polygons, region) {
      setTimeout(() => {
        this.setState({
          openDetailAdsModal: false,
          editing: null,
          openDraw: false,
          region: region || this.state.region
        });
        this.props.actions.onDrawModeChange(false);
        this.props.actions.onPolygonsChange(polygons)
      }, 100);
      this._onSetupMessageTimeout();
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
  loadingContent: {
    width: width,
    height: height-128,
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