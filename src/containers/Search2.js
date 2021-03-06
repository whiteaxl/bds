'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import gui from '../lib/gui';

import React, {Component} from 'react';

import { Text, View, Navigator, TouchableOpacity, Dimensions
  , SegmentedControlIOS, ScrollView, StyleSheet, StatusBar, PickerIOS, AlertIOS } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import TruliaIcon from '../components/TruliaIcon'

import LikeTabButton from '../components/LikeTabButton';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"

import SearchInput from '../components/searchList/SearchInputExt';

import SegmentedControl from '../components/SegmentedControl';

import log from '../lib/logUtil';

import PickerExt from '../components/picker/PickerExt';

import PickerExt2 from '../components/picker/PickerExt2';

import FullLine from '../components/line/FullLine';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import dismissKeyboard from 'react-native-dismiss-keyboard';

import utils from '../lib/utils';

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

class Search2 extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('default');

      let {loaiTin, ngayDaDang, huongNha, dienTich, ban, thue,
          soPhongNguSelectedIdx, radiusInKmSelectedIdx} = this.props.search.form.fields;
      let {initDienTich, fromDienTich, toDienTich} = this._initDienTich();
      let {initGia, fromGia, toGia} = this._initGia(loaiTin);
      let showMore = ngayDaDang != '' || huongNha != 0;
      this.state = {
          showMore: showMore,
          showNgayDaDang: false,
          showGia: false,
          showDienTich: false,
          initGia: initGia,
          initDienTich: initDienTich,
          initNgayDaDang: ngayDaDang,
          fromDienTich: fromDienTich,
          toDienTich: toDienTich,
          fromGia: fromGia,
          toGia: toGia,
          inputNgayDaDang: ngayDaDang,
          toggleState: false,
          loaiTin: loaiTin,
          ban: ban,
          thue: thue,
          dienTich: dienTich,
          soPhongNguSelectedIdx: soPhongNguSelectedIdx,
          radiusInKmSelectedIdx: radiusInKmSelectedIdx,
          huongNha: huongNha,
          ngayDaDang: ngayDaDang
      };
  }

  _initDienTich() {
      let {dienTich} = this.props.search.form.fields;
      let initDienTich = [];
      Object.assign(initDienTich, dienTich);
      let dienTichVal = RangeUtils.dienTichRange.toValRange(initDienTich);
      let fromDienTich = dienTichVal[0];
      let toDienTich = dienTichVal[1];
      if (fromDienTich == -1 || fromDienTich == DanhMuc.BIG) {
          fromDienTich = '';
      }
      if (toDienTich == -1 || toDienTich == DanhMuc.BIG) {
          toDienTich = '';
      }
      return {initDienTich: initDienTich, fromDienTich: fromDienTich, toDienTich: toDienTich};
  }

  _initGia(loaiTin) {
      let gia = this.props.search.form.fields[loaiTin].gia;
      let initGia = [];
      Object.assign(initGia, gia);
      let giaStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
      let giaVal = giaStepValues.toValRange(initGia);
      let fromGia = giaVal[0];
      let toGia = giaVal[1];
      if (fromGia == -1 || fromGia == DanhMuc.BIG) {
          fromGia = '';
      } else if ('ban' === loaiTin) {
          fromGia = fromGia / 1000;
      }
      if (toGia == -1 || toGia == DanhMuc.BIG) {
          toGia = '';
      } else if ('ban' === loaiTin) {
          toGia = toGia / 1000;
      }
      return {initGia: initGia, fromGia: fromGia, toGia: toGia};
  }

  _onLoaiTinChange(value) {
      let {initGia, fromGia, toGia} = this._initGia(value);
      this.setState({loaiTin: value, initGia: initGia, fromGia: fromGia, toGia: toGia, showGia: false, showDienTich: false});
  }

  _onPressGiaHandle(){
    // this.pickerGia.toggle();
      var {showGia} = this.state;
      this.setState({showGia: !showGia});
      if (!showGia) {
          this._onScrollGia();
      }
  }

  _onScrollGia() {
      var {showDienTich} = this.state;
      // var scrollTo = Dimensions.get('window').height/2-330;
      var scrollTo = 38;
      if (showDienTich) {
          scrollTo = scrollTo + 225;
      }
      this._scrollView.scrollTo({y: scrollTo});
  }

  _onPressDienTichHandle(){
    // this.pickerDienTich.toggle();
      var {showDienTich} = this.state;
      this.setState({showDienTich: !showDienTich});
      if (!showDienTich) {
          this._onScrollDienTich();
      }
  }

  _onScrollDienTich() {
      this._scrollView.scrollTo({y: 0});
  }

  _onPressNgayDaDangHandle() {
    var {showNgayDaDang} = this.state;
    this.setState({showNgayDaDang: !showNgayDaDang});
    if (!showNgayDaDang) {
        this._onScrollNgayDaDang();
    }
  }

  _onScrollNgayDaDang() {
      var {showGia, showDienTich} = this.state;
      // var scrollTo = Dimensions.get('window').height/2-238;
      var scrollTo = 225;
      if (showGia) {
          scrollTo = scrollTo + 225;
      }
      if (showDienTich) {
          scrollTo = scrollTo + 225;
      }
      this._scrollView.scrollTo({y: scrollTo});
  }

  _doChangeGia(loaiTin, giaVal) {
      var parent = {};
      Object.assign(parent, this.state[loaiTin]);
      parent.gia = giaVal;
      if (loaiTin == 'ban') {
          this.setState({ban: parent});
      } else {
          this.setState({thue: parent});
      }
  }

  _onGiaChanged(pickedValue) {
    let {loaiTin} = this.state;
    let giaStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
    let giaVal = pickedValue.split('_');
    let value = giaStepValues.rangeVal2Display(giaVal);
    this._doChangeGia(loaiTin, value);
    var initGia = [];
    Object.assign(initGia, value);
    let fromGia = giaVal[0];
    let toGia = giaVal[1];
    if (fromGia == -1 || fromGia == DanhMuc.BIG) {
        fromGia = '';
    } else if ('ban' === loaiTin) {
        fromGia = fromGia / 1000;
    }
    if (toGia == -1 || toGia == DanhMuc.BIG) {
        toGia = '';
    } else if ('ban' === loaiTin) {
        toGia = toGia / 1000;
    }
    this.setState({initGia: initGia, fromGia: fromGia, toGia: toGia});
  }
  _onDienTichChanged(pickedValue) {
    let dienTichVal = pickedValue.split('_');
    let value = RangeUtils.dienTichRange.rangeVal2Display(dienTichVal);
    var initDienTich = [];
    Object.assign(initDienTich, value);
    let fromDienTich = dienTichVal[0];
    let toDienTich = dienTichVal[1];
    if (fromDienTich == -1 || fromDienTich == DanhMuc.BIG) {
        fromDienTich = '';
    }
    if (toDienTich == -1 || toDienTich == DanhMuc.BIG) {
        toDienTich = '';
    }
    this.setState({initDienTich: initDienTich, fromDienTich: fromDienTich, toDienTich: toDienTich, dienTich: value});
  }

  _onNgayDaDangChanged(pickedValue) {
    let value = pickedValue;
    this.setState({initNgayDaDang: value, inputNgayDaDang: value, ngayDaDang: value});
  }

  _getGiaValue() {
    let {loaiTin} = this.state;
    let gia = this.state[loaiTin].gia;
    let giaStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
    let giaVal = giaStepValues.toValRange(gia);
    giaVal.sort((a, b) => this._onArraySort(a, b));
    let newGia = giaStepValues.rangeVal2Display(giaVal);
    return RangeUtils.getFromToDisplay(newGia, giaStepValues.getUnitText());
  }

  _getDienTichValue() {
    let {dienTich} = this.state;
    let dienTichVal = RangeUtils.dienTichRange.toValRange(dienTich);
    dienTichVal.sort((a,b) => this._onArraySort(a, b));
    let newDienTich = RangeUtils.dienTichRange.rangeVal2Display(dienTichVal);
    return RangeUtils.getFromToDisplay(newDienTich, RangeUtils.dienTichRange.getUnitText());
  }

  _getLoaiNhatDatValue() {
      let {loaiTin} = this.state;
      return DanhMuc.getLoaiNhaDatForDisplay(loaiTin, this.state[loaiTin].loaiNhaDat);
  }
  
  _getHuongNhaValue() {
    var {huongNha} = this.state;
    if (!huongNha) {
      return RangeUtils.BAT_KY;
    }
    return DanhMuc.HuongNha[huongNha];
  }

  _getNgayDaDangValue() {
    var {ngayDaDang} = this.state;
    if (!ngayDaDang || ngayDaDang == 0) {
      return RangeUtils.BAT_KY;
    }
    return ngayDaDang + " ngày";
  }

  _getHeaderTitle() {
    let diaChinh = this.props.search.form.fields.diaChinh;

    //1. Search by diaChinh, then name = diaChinh's name
    if (this.props.search.map.polygons && this.props.search.map.polygons.length) {
        //placeName = `[${r.latitude}, ${r.longitude}]`
        return 'Trong khu vực vẽ tay';
    }

    if (this.props.search.form.fields.center && Object.keys(this.props.search.form.fields.center).length > 0) {
        return 'Xung quanh vị trí hiện tại';
    }

    let placeName;
    let r = this.state.region;
    //2. Search by Polygon: name is just center
    if (diaChinh && diaChinh.tinhKhongDau) {
        placeName = diaChinh.fullName;
    } else { //others: banKinh or currentLocation
        if (!diaChinh.fullName){
            placeName = '';
        } else {
            placeName = 'Tìm tất cả theo khung nhìn';
        }
    }

    return placeName;
  }

  render() {
    //log.info(RangeUtils.sellPriceRange.getPickerData());
    log.info("CALL Search.render");
    //log.info(this.props);

    let {loaiTin} = this.state;

    let placeName = this._getHeaderTitle();

    return (
      <View style={myStyles.fullWidthContainer}>
        <View style={[myStyles.searchFilter, {top: 25}]}>

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
            ref={(scrollView) => { this._scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={myStyles.scrollView}>

            <View style={myStyles.searchFilterDetail}>

              <View style={myStyles.searchSectionTitle}>
                <Text style={myStyles.cacDieuKienText}>
                  CÁC ĐIỀU KIỆN
                </Text>
              </View>
              <FullLine />
              <TouchableOpacity
                onPress={this._onPropertyTypesPressed.bind(this)}>
                <View style={myStyles.searchFilterAttributeExt3}>
                  <Text style={myStyles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={myStyles.searchAttributeValue}> {this._getLoaiNhatDatValue()} </Text>
                    <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
                  </View>
                </View>
              </TouchableOpacity>
              <FullLine style={{ marginLeft: 17 }} />
              {this._renderDienTich()}
              <FullLine style={{ marginLeft: 17 }} />
              {this._renderGia()}
              <FullLine style={{ marginLeft: 17 }} />
              {this._renderSoPhongNgu()}
              <FullLine />

              {this._renderBanKinhTimKiem()}

              </View>

              <View style={myStyles.searchMoreFilterButton}>
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                <FullLine />
                {this._renderMoreComponent()}
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                <FullLine />
                <View style={myStyles.searchMoreFilterAttribute}>
                  <Button onPress={this.onResetFilters.bind(this)} style={myStyles.searchResetText}>Thiết lập lại</Button>
                </View>
                <FullLine />
                <View style={myStyles.searchMoreFilterAttribute} />
              </View>
            </ScrollView>
        </View>

          {this.state.toggleState ? <Button onPress={() => dismissKeyboard()}
                                            style={[myStyles.searchButtonText2, {textAlign: 'right', color: gui.mainColor,
                                            backgroundColor: gui.separatorLine}]}>Xong</Button> : null}
          <KeyboardSpacer topSpacing={-40} onToggle={(toggleState) => this.onKeyboardToggle.bind(this, toggleState)}/>

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={myStyles.searchButtonText}>Hủy</Button>
            <Button onPress={this.onApply.bind(this)}
            style={myStyles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

       {/*<View style={myStyles.pageHeader}>
        <SearchInput placeName={placeName}/>
       </View>*/}
      </View>
    );
  }

  onKeyboardToggle(toggleState) {
      this.setState({toggleState: toggleState});
  }

  onCancel() {
    Actions.pop();
    StatusBar.setBarStyle('light-content');
  }

  onApply() {
    log.info("Call Search.onApply");
    this.props.actions.changeLoadingSearchResult(true);

    let {loaiTin, dienTich, soPhongNguSelectedIdx, radiusInKmSelectedIdx, huongNha, ngayDaDang} = this.state;

    this.props.actions.setSearchLoaiTin(loaiTin);

    var loaiNhaDatParent = {};
    Object.assign(loaiNhaDatParent, this.state[loaiTin]);
    let ban = null;
    let thue = null;
    if (loaiTin == 'ban') {
        ban = this.state['ban'];
    } else {
        thue = this.state['thue'];
    }

    let gia = this.state[loaiTin].gia;
    let giaStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
    let giaVal = giaStepValues.toValRange(gia);
    giaVal.sort((a, b) => this._onArraySort(a, b));
    let newGia = giaStepValues.rangeVal2Display(giaVal);
    loaiNhaDatParent.gia = newGia;
    this.props.actions.onSearchFieldChange(loaiTin, loaiNhaDatParent);

    let dienTichVal = RangeUtils.dienTichRange.toValRange(dienTich);
    dienTichVal.sort((a,b) => this._onArraySort(a, b));
    let newDienTich = RangeUtils.dienTichRange.rangeVal2Display(dienTichVal);

    this._doChangeGia(loaiTin, newGia);
    this.props.actions.onSearchFieldChange("dienTich", newDienTich);
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", soPhongNguSelectedIdx);
    this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", radiusInKmSelectedIdx);
    this.props.actions.onSearchFieldChange("huongNha", huongNha);
    this.props.actions.onSearchFieldChange("ngayDaDang", ngayDaDang);
    this.props.actions.onSearchFieldChange("orderBy", '');
    this.props.actions.onSearchFieldChange("pageNo", 1);
    this.props.actions.onResetAdsList();

    let maxItem = this.props.global.setting.maxAdsInMapView;
    this._handleSearchAction(loaiTin, ban, thue, '', 1, maxItem, newGia, newDienTich, soPhongNguSelectedIdx,
        radiusInKmSelectedIdx, huongNha, ngayDaDang);
    if (this.props.needBack) {
        Actions.pop();
    } else {
        log.info("Call open SearchResultList in reset mode");

        Actions.SearchResultList({type: "reset"});
    }
    this.props.refreshRegion && this.props.refreshRegion();
    this.props.onShowMessage && this.props.onShowMessage();
 }

 _onArraySort(a, b) {
     if (a === '') {
         return 1;
     }
     if (b === '') {
         return -1;
     }
     return a - b;
 }

 _handleSearchAction(newLoaiTin, newBan, newThue, newOrderBy, newPageNo, newLimit, newGia, newDienTich, newSoPhongNguSelectedIdx,
                    newRadiusInKmSelectedIdx, newHuongNha, newNgayDaDang){
     var {loaiTin, ban, thue, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
         radiusInKmSelectedIdx, dienTich, orderBy, viewport, diaChinh, center, huongNha, ngayDaDang,
         polygon, pageNo} = this.props.search.form.fields;
     if (newGia) {
         if (loaiTin == 'ban') {
             ban.gia = newGia;
         } else {
             thue.gia = newGia;
         }
     }
     var fields = {
         loaiTin: newLoaiTin || loaiTin,
         ban: newBan || ban,
         thue: newThue || thue,
         soPhongNguSelectedIdx: newSoPhongNguSelectedIdx || soPhongNguSelectedIdx,
         soNhaTamSelectedIdx : soNhaTamSelectedIdx,
         dienTich: newDienTich || dienTich,
         orderBy: newOrderBy || orderBy,
         viewport: viewport,
         diaChinh: diaChinh,
         center: center,
         radiusInKmSelectedIdx: newRadiusInKmSelectedIdx || radiusInKmSelectedIdx,
         huongNha: newHuongNha || huongNha,
         ngayDaDang: newNgayDaDang || ngayDaDang,
         polygon: polygon,
         pageNo: newPageNo || pageNo,
         limit: newLimit,
         isIncludeCountInResponse: true};

     //TODO: need to verify logic of updating last search
     if (this.props.global.currentUser && this.props.global.currentUser.userID){
         fields.userID = this.props.global.currentUser.userID;
     }
     fields.updateLastSearch = true;

     this.props.actions.search(
         fields
         , () => {/*setTimeout(() => this.props.actions.loadHomeData(), 100)*/}
         , (error) => {});
 }

  onMoreOption() {
    this.setState({showMore: true});
  }

  onResetFilters() {
    let defaultBan = {loaiNhaDat: '', gia: RangeUtils.BAT_KY_RANGE};
    let defaultThue = {loaiNhaDat: '', gia: RangeUtils.BAT_KY_RANGE};
    this.props.actions.onSearchFieldChange("ban", defaultBan);
    this.props.actions.onSearchFieldChange("thue", defaultThue);
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("dienTich", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("huongNha", 0);
    this.props.actions.onSearchFieldChange("ngayDaDang", '');

    this.setState({initGia: RangeUtils.BAT_KY_RANGE, initDienTich: RangeUtils.BAT_KY_RANGE, initNgayDaDang: 0,
        fromDienTich: '', toDienTich: '', fromGia: '', toGia: '', inputNgayDaDang: '',
        showMore: false, showGia: false, showDienTich: false, showNgayDaDang: false,
        ban: defaultBan, thue: defaultThue, dienTich: RangeUtils.BAT_KY_RANGE,
        soPhongNguSelectedIdx: 0, radiusInKmSelectedIdx: 0, huongNha: 0, ngayDaDang: ''});
  }

  _onPropertyTypesPressed() {
      let {loaiTin} = this.state;
      Actions.PropertyTypes({func: 'search', loaiTin: loaiTin, loaiNhaDat: this.state[loaiTin].loaiNhaDat,
          onLoaiNhaDatChange: (loaiNhaDat) => this._onLoaiNhaDatChange(loaiNhaDat)});
  }

    _onLoaiNhaDatChange(loaiNhaDat) {
        let {loaiTin} = this.state;
        var loaiNhaDatParent = {};
        Object.assign(loaiNhaDatParent, this.state[loaiTin]);
        loaiNhaDatParent.loaiNhaDat = loaiNhaDat;
        if (loaiTin == 'ban') {
            this.setState({ban: loaiNhaDatParent});
        } else {
            this.setState({thue: loaiNhaDatParent});
        }
    }

  _onHuongNhaPressed() {
      Actions.HuongNha({huongNha: this.state.huongNha, onHuongNhaChange: (huongNha) => this._onHuongNhaChange(huongNha)});
  }

    _onHuongNhaChange(huongNha) {
        this.setState({huongNha: huongNha});
    }

  _onSoPhongNguChanged(event) {
      this.setState({soPhongNguSelectedIdx: event.nativeEvent.selectedSegmentIndex});
  }

  _onSoTangChanged(event) {
    this.props.actions.onSearchFieldChange("soTangSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoNhaTamChanged(event) {
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

    _onBanKinhTimKiemChanged(event) {
        this.setState({radiusInKmSelectedIdx: event.nativeEvent.selectedSegmentIndex});
    }

    _renderDienTich() {
        var {showDienTich} = this.state;
        var iconName = showDienTich ? "arrow-up" : "arrow-down";
        return (
            <View>
                <TouchableOpacity
                                  onPress={this._onPressDienTichHandle.bind(this)}>
                    <View style={myStyles.searchFilterAttribute}>
                        <Text style={myStyles.searchAttributeLabel}>
                            Diện tích
                        </Text>

                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                            <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableOpacity>
                {this._renderDienTichPicker()}
            </View>
        );
    }

    _renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder, onTextChange, onTextFocus,
                     pickerSelectedValue, onPickerValueChange, onPress, inputLabel, fromValue, toValue, unitText) {
        return (
            <PickerExt pickerRange={pickerRange} rangeStepValues={rangeStepValues} fromPlaceholder={fromPlaceholder}
                       toPlaceholder={toPlaceholder} onTextChange={onTextChange} onTextFocus={onTextFocus}
                       pickerSelectedValue={pickerSelectedValue} onPickerValueChange={onPickerValueChange}
                       onPress={onPress} inputLabel={inputLabel} fromValue={fromValue} toValue={toValue}
                       unitText={unitText}/>
        );
    }

    _renderDienTichPicker() {
        var {showDienTich, initDienTich, fromDienTich, toDienTich} = this.state;
        if (showDienTich) {
            let rangeStepValues = RangeUtils.dienTichRange;
            let pickerRange = rangeStepValues.getAllRangeVal();
            let fromPlaceholder = 'Từ';
            let toPlaceholder = 'Đến';
            let onTextChange = this._onDienTichInputChange.bind(this);
            let onTextFocus = this._onScrollDienTich.bind(this);
            let dienTichRange = rangeStepValues.toValRange(initDienTich);
            let pickerSelectedValue = dienTichRange[0] + '_' + dienTichRange[1];
            let onPickerValueChange = this._onDienTichChanged.bind(this);
            return this._renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder,
                onTextChange, onTextFocus, pickerSelectedValue, onPickerValueChange,
                this._onPressDienTichHandle.bind(this), "m²", String(fromDienTich), String(toDienTich),
                rangeStepValues.getUnitText());
        }
    }

    _onDienTichInputChange(index, val) {
        let {dienTich} = this.state;
        let newDienTich = [];
        Object.assign(newDienTich, dienTich);
        if (val === '') {
            val = -1;
        }
        newDienTich[index] = val;
        let other = newDienTich[1-index];
        if (DanhMuc.CHUA_XAC_DINH == other) {
            other = 0;
        } else if (DanhMuc.BAT_KY == other) {
            other = -1;
        } else if (other && other.indexOf(" ") != -1) {
            other = Number(other.substring(0, other.indexOf(" ")));
        } else {
            other = -1;
        }
        newDienTich[1-index] = other;
        // newDienTich.sort((a, b) => a - b);

        let value = RangeUtils.dienTichRange.rangeVal2Display(newDienTich);

        let fromDienTich = newDienTich[0];
        let toDienTich = newDienTich[1];
        if (fromDienTich == -1 || fromDienTich == DanhMuc.BIG) {
            fromDienTich = '';
        }
        if (toDienTich == -1 || toDienTich == DanhMuc.BIG) {
            toDienTich = '';
        }
        this.setState({fromDienTich: fromDienTich, toDienTich: toDienTich, dienTich: value});
    }

    _renderGia() {
        var {showGia} = this.state;
        var iconName = showGia ? "arrow-up" : "arrow-down";
        return (
            <View>
                <TouchableOpacity
                    onPress={this._onPressGiaHandle.bind(this)}>
                    <View style={myStyles.searchFilterAttribute}>
                        <Text style={myStyles.searchAttributeLabel}>
                            Mức giá
                        </Text>

                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.searchAttributeValue}> {this._getGiaValue()} </Text>
                            <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableOpacity>
                {this._renderGiaPicker()}
            </View>
        );
    }

    _renderGiaPicker() {
        var {loaiTin, showGia, initGia, fromGia, toGia} = this.state;
        if (showGia) {
            var rangeStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
            let pickerRange = rangeStepValues.getAllRangeVal();
            let fromPlaceholder = 'Từ';
            let toPlaceholder = 'Đến';
            let onTextChange = this._onGiaInputChange.bind(this);
            let onTextFocus = this._onScrollGia.bind(this);
            let giaRange = rangeStepValues.toValRange(initGia);
            let pickerSelectedValue = giaRange[0] + '_' + giaRange[1];
            let onPickerValueChange = this._onGiaChanged.bind(this);
            let inputLabel = 'ban' === loaiTin ? "tỷ" : "triệu";
            return this._renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder,
                onTextChange, onTextFocus, pickerSelectedValue, onPickerValueChange,
                this._onPressGiaHandle.bind(this), inputLabel, String(fromGia), String(toGia),
                rangeStepValues.getUnitText());
        }
    }

    _onGiaInputChange(index, val) {
        let {loaiTin} = this.state;
        let gia = this.state[loaiTin].gia;
        let rangeStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
        let newGia = [];
        Object.assign(newGia, gia);
        if (val === '') {
            val = -1;
        } else {
            val = utils.normalizeNumeric(val);
        }
        if (val === '.') {
            val = '0.';
        }
        let hasLastDot = val[val.length-1] === '.';
        if ('ban' === loaiTin && val != -1) {
            val = 1000 * val;
        }
        newGia[index] = hasLastDot && 'ban' === loaiTin ? val + '.' : val;
        let other = String(newGia[1-index]);
        if (DanhMuc.THOA_THUAN == other) {
            other = 0;
        } else if (DanhMuc.BAT_KY == other) {
            other = -1;
        } else if (other && other.indexOf(" ") != -1) {
            if (other.indexOf("tỷ") != -1) {
                other = 1000 * Number(other.substring(0, other.indexOf(" ")));
            } else {
                other = Number(other.substring(0, other.indexOf(" ")));
            }
        } else {
            other = -1;
        }
        newGia[1-index] = other;

        let value = rangeStepValues.rangeVal2Display(newGia);
        this._doChangeGia(loaiTin, value);
        let fromGia = newGia[0];
        let toGia = newGia[1];
        hasLastDot = fromGia[fromGia.length-1] === '.';
        if (fromGia == -1 || fromGia == DanhMuc.BIG) {
            fromGia = '';
        } else if ('ban' === loaiTin) {
            fromGia = fromGia / 1000;
        }
        fromGia = hasLastDot && 'ban' === loaiTin ? fromGia + '.' : fromGia;
        hasLastDot = toGia[toGia.length-1] === '.';
        if (toGia == -1 || toGia == DanhMuc.BIG) {
            toGia = '';
        } else if ('ban' === loaiTin) {
            toGia = toGia / 1000;
        }
        toGia = hasLastDot && 'ban' === loaiTin ? toGia + '.' : toGia;
        this.setState({fromGia: fromGia, toGia: toGia});
    }

  _renderSoPhongNgu(){
    if (this.showSoPhongNgu()){
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.state["soPhongNguSelectedIdx"], this._onSoPhongNguChanged.bind(this));
    } else if (0 != this.state.soPhongNguSelectedIdx) {
        this.setState({soPhongNguSelectedIdx: 0});
    }
      return null;
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
      return null;
  }

  _renderBanKinhTimKiem() {
        if (this.showBanKinhTimKiem()){
            return this._renderSegment("Bán kính tìm kiếm (Km)", DanhMuc.getRadiusInKmValues(),
                this.state["radiusInKmSelectedIdx"], this._onBanKinhTimKiemChanged.bind(this));
        }
        /*
        else if (0 != this.state.radiusInKmSelectedIdx) {
           this.setState({radiusInKmSelectedIdx: 0});
        }
        */
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
            <FullLine style={{marginLeft:17}}/>
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
          </TouchableOpacity>
          {this._renderNgayDaDangPicker()}
        </View>
    );
  }

  _renderNgayDaDangPicker() {
    var {showNgayDaDang, initNgayDaDang, inputNgayDaDang} = this.state;
    if (showNgayDaDang) {
        let pickerRange = DanhMuc.getNgayDaDangValues();
        let inputPlaceholder = '';
        let onTextChange = this._onNgayDaDangInputChange.bind(this);
        let onTextFocus = this._onScrollNgayDaDang.bind(this);
        let pickerSelectedValue = initNgayDaDang;
        let onPickerValueChange = this._onNgayDaDangChanged.bind(this);
        let val2Display = this._ngayDaDangVal2Display.bind(this);
        let onPress = this._onPressNgayDaDangHandle.bind(this);
        let inputLabel = 'ngày';
        return <PickerExt2 pickerRange={pickerRange} val2Display={val2Display} inputPlaceholder={inputPlaceholder}
                   inputValue={String(inputNgayDaDang)} onTextChange={onTextChange} onTextFocus={onTextFocus}
                   pickerSelectedValue={pickerSelectedValue} onPickerValueChange={onPickerValueChange}
                   onPress={onPress} inputLabel={inputLabel} />
    }
  }
  
  _onNgayDaDangInputChange(value) {
      this.setState({inputNgayDaDang: value, ngayDaDang: value});
  }
    
  _ngayDaDangVal2Display(ngayDaDangKey) {
      return DanhMuc.NgayDaDang[ngayDaDangKey];
  }

  showSoPhongNgu(){
    var {loaiTin} = this.state;
    var loaiNhaDat = this.state[loaiTin].loaiNhaDat;
    var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
      if (loaiNhaDat == loaiNhaDatKeys[0]
      || loaiNhaDat == loaiNhaDatKeys[1]
      || loaiNhaDat == loaiNhaDatKeys[2]
      || loaiNhaDat == loaiNhaDatKeys[3]
      || loaiNhaDat == loaiNhaDatKeys[4]) {
          return true;
      } else {
          return false;
      }
  }

  showSoTang(){
    return false;
  }

  showSoNhaTam(){
      var {loaiTin} = this.state;
      var loaiNhaDat = this.state[loaiTin].loaiNhaDat;
      var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
      if (loaiNhaDat == loaiNhaDatKeys[0]
          || loaiNhaDat == loaiNhaDatKeys[1]
          || loaiNhaDat == loaiNhaDatKeys[2]
          || loaiNhaDat == loaiNhaDatKeys[3]
          || loaiNhaDat == loaiNhaDatKeys[4]) {
          return true;
      } else {
          return false;
      }
  }

  showBanKinhTimKiem(){
      // let {center} = this.props.search.form.fields;
      // return center && !isNaN(center.lat);
      return false;
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
  searchButtonText2: {
      margin: 0,
      padding: 10,
      paddingRight: 17,
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
    flex: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
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
    borderTopWidth: 0,
    borderTopColor: gui.separatorLine
  },
  searchMoreFilterAttribute: {
    padding: 10,
    paddingBottom: 11,
    borderTopWidth: 0,
    borderTopColor: gui.separatorLine
  },
  ngayDaDangItem: {
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search2);
