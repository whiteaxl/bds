'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Map
 */

import {Map} from 'immutable';

import React, { Text,
    View,
    Component,
    StyleSheet,
    Navigator,
    TouchableOpacity,
    Dimensions,
    Image,
    SegmentedControlIOS,
    PanResponder } from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelandIcon from '../components/RelandIcon';
import MapView from 'react-native-maps';

import SearchHeader from '../components/SearchHeader';
import PriceMarker from '../components/PriceMarker';

import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';

import gui from '../lib/gui';
import DanhMuc from '../assets/DanhMuc';

import apiUtils from '../lib/ApiUtils';

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / (height-110);

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var id = 0;

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

  return {
    ... state,
    listAds: state.search.result.listAds,
    viewport: state.search.result.viewport,
    errorMsg: state.search.result.errorMsg,
    placeFullName: state.search.form.fields.place.fullName,
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
  }

  constructor(props) {
    console.log("Call SearchResultMap.constructor");
    super(props);

    var region = this.props.search.map.region;
    region.longitudeDelta = region.latitudeDelta * ASPECT_RATIO;

    this.props.actions.onMapChange("region", region);

    this.state = {
      firstLoad : true,
      modal: false,
      mapType: "standard",
      mmarker:{},
      openLocalInfo: false,
      openDraw: false,
      openDetailAdsModal: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polygons: [],
      editing: null,
      drawMode: false
    }
  }

  render() {
    console.log("Call SearchResultMap.render");

    let listAds = this.props.listAds;

    console.log("SearchResultMap: number of data " + listAds.length);

    let viewableList = this._getViewableAds(listAds);

    return (
      <View style={styles.fullWidthContainer}>

        <View style={styles.search}>
          <SearchHeader placeName={this.props.placeFullName} containerForm="SearchResultMap"/>
        </View>

        <View style={styles.map}>
          <MapView
              ref="map"
              region={this.props.search.map.region}
              onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
              style={styles.mapView}
              mapType={this.state.mapType}
          >
            {(!this.state.drawMode || (this.state.polygons && this.state.polygons.length > 0)) && viewableList.map( marker =>(
                <MapView.Marker key={marker.id} coordinate={marker.coordinate} onPress={()=>this._onMarkerPress(marker)}>
                  <PriceMarker color={gui.mainColor} amount={marker.price}/>
                </MapView.Marker>
            ))}
            {this.state.polygons.map(polygon => (
                <MapView.Polygon
                    key={polygon.id}
                    coordinates={polygon.coordinates}
                    strokeColor="#F00"
                    fillColor="rgba(255,0,0,0.5)"
                    strokeWidth={1}
                />
            ))}
            {this.state.editing && (
                <MapView.Polyline
                    coordinates={this.state.editing.coordinates}
                    strokeColor="#000"
                    fillColor="rgba(255,0,0,0.5)"
                    strokeWidth={1}
                />
            )}
          </MapView>
          <View style={styles.mapButtonContainer}>
              <View style={[styles.bubble, styles.button]}>
                {this.state.polygons && this.state.polygons.length > 0 ? (
                    <RelandIcon name="close" color='black' mainProps={{flexDirection: 'row'}}
                                size={20} textProps={{paddingLeft: 0}}
                                onPress={this._onDrawPressed.bind(this)}></RelandIcon>) :
                    (<TouchableOpacity onPress={this._onDrawPressed.bind(this)} >
                      <Icon name="hand-o-up" style={styles.mapIcon} color={this.state.drawMode ? gui.mainColor : 'black'}
                            size={20}></Icon>
                    </TouchableOpacity>)}
              </View>
            <TouchableOpacity onPress={this._onCurrentLocationPress.bind(this)} >
              <View style={[styles.bubble, styles.button]}>
                <Icon name="location-arrow" style={styles.mapIcon} size={20}></Icon>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {this._renderTotalResultView(listAds.length, this.props.loading)}

        <View style={styles.tabbar}>
          <View style={styles.searchListButton}>
            <Icon.Button onPress={this._onLocalInfoPressed.bind(this)}
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
            </Icon.Button>
          </View>
        </View>

        <Modal style={styles.adsModal} isOpen={this.state.openDetailAdsModal} position={"bottom"}
               ref={"detailAdsModal"} isDisabled={false} onPress={this._onDetailAdsPress.bind(this)}>
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
                  <Icon.Button name="heart-o" backgroundColor="transparent"
                               underlayColor="transparent" style={styles.detailAdsModalTextHeartButton}/>
                </View>
              </LinearGradient>
            </Image>
          </TouchableOpacity>
          </View>
        </Modal>


        {this._renderLocalInfoModal()}

        {this._renderDrawModal()}
        
      </View>
    )
  }

  _renderTotalResultView(numberOfAds, loading){
    if(loading){
      return (<View style={styles.resultContainer}>
        <View style={[styles.resultText]}>
          <Text style={styles.mapIcon}>  Đang tải dữ liệu ... </Text>
        </View>
      </View>)
    }

    return (<View style={styles.resultContainer}>
      <View style={[styles.resultText]}>
        <Text style={styles.mapIcon}>  Đang hiển thị {numberOfAds < MAX_VIEWABLE_ADS ? numberOfAds : MAX_VIEWABLE_ADS} trong tổng số {numberOfAds} tin. Zoom để xem thêm </Text>
      </View>
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

    if (this.state.firstLoad){
      this.setState({
        firstLoad : false
      });
      return;
    }

    this.props.actions.onMapChange("region", region);

    var geoBox = apiUtils.getBbox(this.props.search.map.region);
    this.props.actions.onSearchFieldChange("geoBox", geoBox);

    this._refreshListData();

  }

  _refreshListData() {
    console.log("Call SearhResultMap._refreshListData");
    this.props.actions.search(
        this.props.search.form.fields
        , () => {});
  }

  _renderLocalInfoModal(){
    return (
     <Modal style={[styles.modal]} isOpen={this.state.openLocalInfo} position={"center"} ref={"localInfoModal"} isDisabled={false}>
      <View style={styles.modalTitle}>
        <Text style={styles.modalTitleText}>Local info</Text>
        <TouchableOpacity style={{flexDirection: "row", alignItems: "flex-end"}}
                          onPress={this._onCloseLocalInfo.bind(this)}>
          <Icon name="times" color={gui.arrowColor} size={18} />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 10}}>
        <SegmentedControlIOS
            values={DanhMuc.MapType}
            selectedIndex={DanhMuc.MapType.indexOf(this.state.mapType)}
            onChange={this._onMapTypeChange.bind(this)}
            tintColor={gui.mainColor} height={30} width={width-80}
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
            latitudeDelta: this.props.region.latitudeDelta,
            longitudeDelta: this.props.region.longitudeDelta
          };

          var geoBox = apiUtils.getBbox(region);

          this.props.actions.onSearchFieldChange("geoBox", geoBox);

          this._refreshListData();

          this.props.actions.onMapChange("region", region);
        },
        (error) => {
          alert(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _onDrawPressed(){
    var {polygons} = this.state;
    this.setState({
      openDetailAdsModal: false,
      polygons: [],
      editing: null,
      openDraw: !polygons || polygons.length === 0,
      drawMode: !polygons || polygons.length === 0
    });
  }

  _onDetailAdsPress(){
    console.log("Call SearchResultMap._onDetailAdsPress");
    console.log(this.state.mmarker.id);
    Actions.SearchResultDetail({adsID: this.state.mmarker.id});
  }

  _onMapTypeChange(event){
    this.setState({
      preMapType: event.nativeEvent.selectedSegmentIndex
    });
  }

  _onCloseLocalInfo(){
    this.setState({
      mapType: DanhMuc.MapType[this.state.preMapType],
      openLocalInfo: false
    });
  }

  _onCloseDraw(){
    this.setState({
      openDetailAdsModal: false,
      polygons: [],
      editing: null,
      openDraw: false,
      drawMode: false
    });
  }

  _onMarkerSelect() {
    this.setState({modal: true});
  }

  _onMarkerPress(marker) {
    console.log("Call SearchResultMap._onMarkerPress");
    this.setState({
      openDetailAdsModal: true,
      mmarker: marker
    });
  }

  _onMarkerDeselect(){
    this.setState({openDetailAdsModal: false});
  }

  _onLocalInfoPressed() {
    console.log("On Local Info pressed!");
    this.setState({
      openLocalInfo: true
    });
  }

  _onSaveSearchPressed() {
    console.log("On Save Search pressed!");
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

  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  _handlePanResponderGrant(e: Object, gestureState: Object) {
    this._previousLeft = gestureState.x0;
    this._previousTop = gestureState.y0;
  }

  _handlePanResponderMove(e: Object, gestureState: Object) {
    this._refreshPolygons(gestureState);
  }

  _handlePanResponderEnd(e: Object, gestureState: Object) {
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;

    var { editing } = this.state;
    var polygons = editing ? [editing] : [];
    this.setState({
        openDetailAdsModal: false,
        polygons: polygons,
        editing: null,
        openDraw: false,
        drawMode: false
    });
    if (polygons.length > 0) {
        var geoBox = apiUtils.getPolygonBox(polygons[0]);
        this.props.actions.onSearchFieldChange("geoBox", geoBox);

        this._refreshListData();
    }
  }

  _refreshPolygons(gestureState) {
    var region = this.props.search.map.region;
    var x0 = this._previousLeft + gestureState.dx;
    var y0 = this._previousTop + gestureState.dy;
    var lat = region.latitude + region.latitudeDelta*(0.5-(y0-5)/height)*1.17;
    var lon = region.longitude + region.longitudeDelta*(x0/width-0.5)*1.07;
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
      marginLeft: 15,
      marginRight: 15,
      marginTop: 0,
      marginBottom: 0,
      flexDirection: 'column',
  },

  map: {
    flex: 1,
    marginTop: 0,
    marginBottom: 50
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
    borderRadius: 10,
  },
  button: {
    width: 50,
    paddingVertical: 5,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'white',
    opacity: 0.75,
    marginLeft: 15
  },
  mapIcon: {
  },
  text: {
    color: 'white',
  },
  mapButtonContainer: {
    position: 'absolute',
    top: height-200,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },

  resultContainer: {
    position: 'absolute',
    top: 60,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  resultText: {
    width: width,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    opacity: 0.75,
  },

  tabbar: {
    position: 'absolute',
    top: height-50,
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
    height: 100,
    width: width-40,
    marginVertical: 0,
    borderRadius: 5
  },
  modalTitle: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 5,
    borderTopWidth: 1,
    marginVertical: 0,
    width: width-40,
    borderTopColor: '#f8f8f8',
    backgroundColor: '#f8f8f8',
    borderRadius: 5
  },
  modalTitleText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    color: '#606060',
    justifyContent :'space-between',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  adsModal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height/3,
    width: width,
    marginVertical: 0,
  },
  detailAdsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: height/3,
    width: width
  },
  detailAdsModalThumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: height/3,
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
    top: height/3-60,
    width: width
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);