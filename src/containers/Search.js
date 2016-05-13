'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

import gui from '../lib/gui';


import React, { Text, View, Component, Navigator, TouchableOpacity, Dimensions
  , SegmentedControlIOS, ScrollView, StyleSheet, StatusBar, PickerIOS } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import TruliaIcon from '../components/TruliaIcon'

import LikeTabButton from '../components/LikeTabButton';
import RangeUtils from "../lib/RangeUtils"
import RangePicker from "../components/RangePicker"

import DanhMuc from "../assets/DanhMuc"

import SearchInput from '../components/SearchInputExt';

import PlaceUtil from '../lib/PlaceUtil';

import apiUtils from '../lib/ApiUtils';

import SegmentedControl from '../components/SegmentedControl';

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
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

class Search extends Component {
  constructor() {
    super();
    StatusBar.setBarStyle('default');

    this.state = {
      showMore: false,
      showNgayDaDang: false
    };
  }

  _onLoaiTinChange(value) {
    this.props.actions.setSearchLoaiTin(value);
  }

  _onPressGiaHandle(){
    this.pickerGia.toggle();
  }

  _onPressDienTichHandle(){
    this.pickerDienTich.toggle();
  }

  _onPressNgayDaDangHandle() {
    var {showNgayDaDang} = this.state;
    this.setState({showNgayDaDang: !showNgayDaDang});
  }

  _onGiaChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("gia", value);
  }
  _onDienTichChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("dienTich", value);
  }

  _onNgayDaDangChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("ngayDaDang", value);
  }

  _getGiaValue() {
    //console.log(this.props.search.form.fields.gia)
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.gia);
  }

  _getDienTichValue() {
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.dienTich);
  }

  _getLoaiNhatDatValue() {
    return DanhMuc.getLoaiNhaDatForDisplay(this.props.search.form.fields.loaiTin ,
                                               this.props.search.form.fields.loaiNhaDat);
  }
  
  _getHuongNhaValue() {
    var huongNha = this.props.search.form.fields.huongNha;
    if (!huongNha) {
      return RangeUtils.BAT_KY;
    }
    return DanhMuc.HuongNha[huongNha];
  }

  _getNgayDaDangValue() {
    var ngayDaDang = this.props.search.form.fields.ngayDaDang;
    if (!ngayDaDang) {
      return RangeUtils.BAT_KY;
    }
    return ngayDaDang + " ngày";
  }

  render() {
    //console.log(RangeUtils.sellPriceRange.getPickerData());
    console.log("CALL Search.render");
    console.log(this.props);
    console.log(Actions);

    let loaiTin = this.props.search.form.fields.loaiTin;

    var _scrollView: ScrollView;
    return (
      <View style={myStyles.fullWidthContainer}>
        <View style={[myStyles.searchFilter, {top: 65}]}>

          <View style={[myStyles.searchFilterButton]}>
            <View style = {{flex:1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
              <LikeTabButton name={'ban'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={loaiTin === 'ban'}>BÁN</LikeTabButton>
              <LikeTabButton name={'thue'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={loaiTin === 'thue'}>CHO THUÊ</LikeTabButton>
            </View>
          </View>

          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={myStyles.scrollView}>

            <View style={myStyles.searchFilterDetail}>

              <View style={myStyles.searchSectionTitle}>
                <Text style={myStyles.cacDieuKienText}>
                  CÁC ĐIỀU KIỆN
                </Text>
              </View>

              <TouchableOpacity style={myStyles.searchFilterAttribute3}
                onPress={this._onPressGiaHandle.bind(this)}>
                <Text style={myStyles.searchAttributeLabel}>
                  Mức giá
                </Text>

                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                  <Text style={myStyles.searchAttributeValue}> {this._getGiaValue()} </Text>
                  <TruliaIcon name="arrow-down" color={gui.arrowColor} size={18} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this._onPropertyTypesPressed}>
                <View style={myStyles.searchFilterAttributeExt}>
                  <Text style={myStyles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={myStyles.searchAttributeValue}> {this._getLoaiNhatDatValue()} </Text>
                    <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
                  </View>
                </View>
              </TouchableOpacity>

              {this._renderSoPhongNgu()}

              {this._renderSoTang()}

              {this._renderSoNhaTam()}

                {this._renderBanKinhTimKiem()}

              <TouchableOpacity style={myStyles.searchFilterAttribute}
                  onPress={this._onPressDienTichHandle.bind(this)}>
                <Text style={myStyles.searchAttributeLabel}>
                  Diện tích
                </Text>

                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                  <Text style={myStyles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                  <TruliaIcon name="arrow-down" color={gui.arrowColor} size={18} />
                </View>
              </TouchableOpacity>
              </View>

              <View style={myStyles.searchMoreFilterButton}>
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                {this._renderMoreComponent()}
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                <View style={myStyles.searchMoreFilterAttribute}>
                  <Button onPress={this.onResetFilters.bind(this)} style={myStyles.searchResetText}>Thiết lập lại</Button>
                </View>
                <View style={myStyles.searchMoreFilterAttribute} />
              </View>

            </ScrollView>
        </View>

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={myStyles.searchButtonText}>Thoát</Button>
            <Button onPress={this.onApply.bind(this)}
            style={myStyles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

        <View>
          <RangePicker ref={pickerGia => this.pickerGia = pickerGia}
                    pickerTitle = "Chọn Giá"
                    pickerData={this.props.search.form.fields.giaPicker}
                    selectedValue={this.props.search.form.fields.gia}
                    onPickerDone={(pickedValue) => {this._onGiaChanged(pickedValue)}}
              />
          <RangePicker ref={pickerDienTich => this.pickerDienTich = pickerDienTich}
                    pickerTitle = "Chọn Diện Tích"
                    pickerData={RangeUtils.dienTichRange.getPickerData()}
                    selectedValue={this.props.search.form.fields.dienTich}
                    onPickerDone={(pickedValue) => {this._onDienTichChanged(pickedValue)}}
              />
        </View>

       <View style={myStyles.pageHeader}>
        <SearchInput placeName={this.props.search.form.fields.place.fullName}/>
       </View>
      </View>
    );
  }

  onCancel() {
    Actions.pop();
  }

  onApply() {
    console.log("Call Search.onApply");

    if (this.props.needBack) {
      Actions.pop();
    } else {
      console.log("Call open SearchResultList in reset mode");

      Actions.SearchResultList({type: "reset"});
    }
    this.props.actions.onSearchFieldChange("geoBox", []);
    this.props.actions.search(
        this.props.search.form.fields
        , () => {});

 }

  onMoreOption() {
    this.setState({showMore: true});
  }

  onResetFilters() {
    this.props.actions.onSearchFieldChange("loaiNhaDat", '');
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("soTangSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("dienTich", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("gia", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("orderBy", '');
    this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("huongNha", '');
    this.props.actions.onSearchFieldChange("ngayDaDang", '');
    this.setState({showMore: false});
  }

  _onPropertyTypesPressed() {
    Actions.PropertyTypes();
  }

  _onHuongNhaPressed() {
    Actions.HuongNha();
  }

  _onSoPhongNguChanged(event) {
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoTangChanged(event) {
    this.props.actions.onSearchFieldChange("soTangSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoNhaTamChanged(event) {
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

    _onBanKinhTimKiemChanged(event) {
        this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", event.nativeEvent.selectedSegmentIndex);
    }

  _renderSoPhongNgu(){
    if (this.showSoPhongNgu()){
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.props.search.form.fields["soPhongNguSelectedIdx"], this._onSoPhongNguChanged.bind(this));
    } else if (0 != this.props.search.form.fields.soPhongNguSelectedIdx) {
      this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", 0);
    }
  }

  _renderSoTang() {
    if (this.showSoTang()){
        return this._renderSegment("Số tầng", DanhMuc.getSoTangValues(),
            this.props.search.form.fields["soTangSelectedIdx"], this._onSoTangChanged.bind(this));
    }else if (0 != this.props.search.form.fields.soTangSelectedIdx) {
      this.props.actions.onSearchFieldChange("soTangSelectedIdx", 0);
    }
  }

  _renderSoNhaTam() {
    if (this.showSoNhaTam()){
        return this._renderSegment("Số nhà tắm", DanhMuc.getSoPhongTamValues(),
            this.props.search.form.fields["soNhaTamSelectedIdx"], this._onSoNhaTamChanged.bind(this));
    }else if (0 != this.props.search.form.fields.soNhaTamSelectedIdx) {
      this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", 0);
    }
  }

  _renderBanKinhTimKiem() {
        let place = this.props.search.form.fields.place;
        if (this.showBanKinhTimKiem(place)){
            return this._renderSegment("Bán kính tìm kiếm (Km)", DanhMuc.getRadiusInKmValues(),
                this.props.search.form.fields["radiusInKmSelectedIdx"], this._onBanKinhTimKiemChanged.bind(this));
        }else if (0 != this.props.search.form.fields.radiusInKmSelectedIdx) {
            this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", 0);
        }
    }

    _renderSegment(label, values, selectedIndexAttribute, onChange) {
        return (
            <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                              onChange={onChange} />
        );
    }

  _renderMoreComponent() {
    var {showMore} = this.state;
    if (!showMore) {
      return (
          <View>
            {this._renderMoreButton()}
          </View>
      );
    } else {
      return (
          <View>
            {this._renderHuongNha()}
            {this._renderNgayDaDang()}
          </View>
      );
    }
  }

  _renderMoreButton() {
    return (
        <View style={myStyles.searchMoreFilterAttribute}>
          <Button onPress={() => this.onMoreOption()} style={myStyles.searchMoreText}>Mở rộng</Button>
        </View>
    );
  }

  _renderHuongNha() {
    return (
        <TouchableOpacity
            onPress={() => this._onHuongNhaPressed()}>
          <View style={myStyles.searchFilterAttributeExt3}>
            <Text style={myStyles.searchAttributeLabel}>
              Hướng nhà
            </Text>
            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
              <Text style={myStyles.searchAttributeValue}> {this._getHuongNhaValue()} </Text>
              <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableOpacity>
    );
  }

  _renderNgayDaDang() {
    var {showNgayDaDang} = this.state;
    var iconName = showNgayDaDang ? "arrow-up" : "arrow-down";
    return (
        <View>
          <TouchableOpacity
                            onPress={() => this._onPressNgayDaDangHandle()}>
            <View style={myStyles.searchFilterAttribute3}>
              <Text style={myStyles.searchAttributeLabel}>
                Ngày đã đăng
              </Text>

              <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                <Text style={myStyles.searchAttributeValue}> {this._getNgayDaDangValue()} </Text>
                <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
              </View>
             </View>
            {this._renderNgayDaDangPicker()}
          </TouchableOpacity>
        </View>
    );
  }

  _renderNgayDaDangPicker() {
    var {showNgayDaDang} = this.state;
    if (showNgayDaDang) {
      return (
          <PickerIOS ref={pickerNgayDaDang => this.pickerNgayDaDang = pickerNgayDaDang}
                 selectedValue={this.props.search.form.fields.ngayDaDang}
                 onValueChange={(pickedValue) => {this._onNgayDaDangChanged(pickedValue)}}
                 itemStyle={myStyles.ngayDaDangItem}
          >
            {DanhMuc.getNgayDaDangValues().map((ngayDaDangKey) => (
                <PickerIOS.Item key={ngayDaDangKey}
                                value={ngayDaDangKey}
                                label={DanhMuc.NgayDaDang[ngayDaDangKey]} />
            ))}
          </PickerIOS>
      );
    }
  }

  showSoPhongNgu(){
    return true;
  }

  showSoTang(){
    return false;
  }

  showSoNhaTam(){
    return true;
  }

  showBanKinhTimKiem(place){
    return PlaceUtil.isDiaDiem(place);
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  pageHeader: {
      top: 0,
      position: 'absolute',
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: Dimensions.get('window').width,
      height: 60
  },
  searchAttributeLabelBold : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'black',
    fontWeight: 'bold'
  },

  searchButton: {
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  searchButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 44
  },
  searchButtonText: {
      marginLeft: 17,
      marginRight: 17,
      marginTop: 10,
      marginBottom: 10,
      color: 'white',
      fontSize: gui.buttonFontSize,
      fontFamily: 'Open Sans',
      fontWeight : 'normal'
  },
  searchMoreFilterButton: {
    flex: 0.5,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  searchMoreSeparator: {
    backgroundColor: '#F6F6F6'
  },
  searchResetText: {
    color: 'red',
    fontSize: gui.buttonFontSize,
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  searchMoreText: {
    fontSize: gui.buttonFontSize,
    fontFamily: 'Open Sans',
    fontWeight: 'normal',
    color: gui.mainColor
  },
  searchAttributeLabel : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'black'
  },
  searchAttributeValue : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: gui.arrowColor,
    marginRight: 3
  },
  searchFilterButton: {
    flexDirection: 'row'
  },
  searchFilter: {
    flex: 1
  },
  searchSectionTitle: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 8,
    paddingLeft: 17,
    paddingTop: 12,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
    backgroundColor: '#f8f8f8'
  },
  searchFilterDetail: {
    flex: 1,
    flexDirection:"column"
    //borderWidth:1,
    //borderColor: "green"
  },
  scrollView: {
    flex: 1,
    marginBottom: 44
  },
  cacDieuKienText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#606060',
    justifyContent :'space-between',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 13,
    paddingBottom: 10,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute2: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 8,
    paddingTop: 5,
    paddingLeft: 17,
    paddingBottom: 7,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute3: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 10,
    paddingLeft: 17,
    paddingRight: 13,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 12,
    paddingLeft: 0,
    paddingRight: 19,
    paddingBottom: 10,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt2: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 10,
    paddingTop: 5,
    paddingLeft: 0,
    paddingBottom: 8,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt3: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 12,
    paddingLeft: 17,
    paddingRight: 19,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchMoreFilterAttribute: {
    padding: 10,
    paddingBottom: 11,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  ngayDaDangItem: {

  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
