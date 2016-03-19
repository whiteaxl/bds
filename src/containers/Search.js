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



import React, { Text, View, Component, Navigator, TouchableOpacity, SegmentedControlIOS, ScrollView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

import LikeTabButton from '../components/LikeTabButton';
import Picker from 'react-native-picker'

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
  }

  _onLoaiTinChange(value) {
    this.props.actions.onSearchFieldChange("loaiTin", value);
  }

  _onPressGiaHandle(){
    this.pickerGia.toggle();
  }

  _onPressDienTichHandle(){
    this.pickerDienTich.toggle();
  }
  _onGiaChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("gia", value);
  }
  _onDienTichChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("dienTich", value);
  }

  _getGiaValue() {
    //if (this.props.search.form.fields.gia)
    return this.props.search.form.fields.gia.join(",");
  }

   _getDienTichValue() {
    //if (this.props.search.form.fields.gia)
    return this.props.search.form.fields.dienTich.join(",");
  }

  render() {
    var _scrollView: ScrollView;
    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.customPageHeader}>
          <Icon.Button onPress={this.onCancel}
            name="chevron-left" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <View style={styles.customPageTitle}>
            <Text style={styles.customPageTitleText}>
            Tìm kiếm
            </Text>
          </View>
        </View>

        <View style={styles.searchFilter}>
          <View style={styles.searchFilterButton}>

            <View onPress={this.onForSale} style = {{flex:1, flexDirection: 'row'}}>
              <LikeTabButton name={'ban'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={this.props.search.form.fields.loaiTin === 'ban'}>BÁN</LikeTabButton>
              <LikeTabButton name={'thue'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={this.props.search.form.fields.loaiTin === 'thue'}>CHO THUÊ</LikeTabButton>
            </View>

          </View>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={styles.scrollView}>

            <View style={styles.searchFilterDetail}>

              <View style={styles.searchSectionTitle}>
                <Text style={styles.searchAttributeLabel}>
                  CÁC ĐIỀU KIỆN
                </Text>
              </View>


              <TouchableOpacity style={styles.searchFilterAttribute}
                onPress={this._onPressGiaHandle.bind(this)}>
                <Text style={styles.searchAttributeLabel}>
                  Giá
                </Text>

                <View style={{flexDirection: "row"}}>
                  <Text style={styles.searchAttributeValue}> {this._getGiaValue()} </Text>
                  <Text style={styles.searchAttributeValue}> V </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this._onPropertyTypesChoosed}>
                <View style={styles.searchFilterAttribute}>
                  <Text style={styles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <Icon name="angle-right" size={20} />
                </View>
              </TouchableOpacity>

              <View style={styles.searchFilterAttribute, {flexDirection: "column"}}>
                <View style={styles.searchFilterAttribute}>
                  <Text style={styles.searchAttributeLabel}>
                    Số phòng ngủ
                  </Text>
                </View>
                <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                  <SegmentedControlIOS
                    values={["0+","1+","2+","3+","4+","5+"]}
                    selectedIndex={this.props.search.form.fields.soPhongNgu}
                    onChange={this._onSoPhongNguChanged.bind(this)}
                  >
                  </SegmentedControlIOS>
                </View>
              </View>

              <View style={styles.searchFilterAttribute, {flexDirection: "column"}}>
                <View style={styles.searchFilterAttribute}>
                  <Text style={styles.searchAttributeLabel}>
                    Số tầng
                  </Text>
                </View>
                <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                  <SegmentedControlIOS
                    values={["0+","1+","2+","3+","4+","5+"]}
                    selectedIndex={this.props.search.form.fields.soTang}
                    onChange={this._onSoTangChanged.bind(this)}
                  >
                  </SegmentedControlIOS>
                </View>
              </View>

              <TouchableOpacity style={styles.searchFilterAttribute}
                  onPress={this._onPressDienTichHandle.bind(this)}>
                <Text style={styles.searchAttributeLabel}>
                  Diện tích
                </Text>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                    <Text style={styles.searchAttributeValue}> V </Text>
                </View>
              </TouchableOpacity>
              </View>
              <View style={styles.searchMoreFilterButton}>
                <View style={styles.searchMoreFilterAttribute}>
                  <Button onPress={this.onMoreOption}>Thêm</Button>
                </View>
                <View style={styles.searchMoreFilterAttribute}>
                  <Button onPress={this.onResetFilters.bind(this)}>Thiết lập lại</Button>
                </View>
              </View>

            </ScrollView>
        </View>
        <View style={styles.searchButton}>
          <View style={styles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={styles.searchButtonText}>Thoát</Button>
            <Button onPress={this.onApply.bind(this)}
            style={styles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

        <View>
          <Picker ref={pickerGia => this.pickerGia = pickerGia}
                    style={{height: 320}} showDuration={300}
                    pickerData={this.props.search.form.fields.pickerGia}
                    selectedValue={this.props.search.form.fields.gia}
                    onPickerDone={(pickedValue) => {this._onGiaChanged(pickedValue)}}
              />
          <Picker ref={pickerDienTich => this.pickerDienTich = pickerDienTich}
                    style={{height: 320}} showDuration={300}
                    pickerData={this.props.search.form.fields.pickerDienTich}
                    selectedValue={this.props.search.form.fields.dienTich}
                    onPickerDone={(pickedValue) => {this._onDienTichChanged(pickedValue)}}
              />
        </View>
      </View>
    );
  }
  onCancel() {
    Actions.pop();
  }
  onApply() {
    console.log("Search cridential:");
    console.log(this.props.search.form.fields);
    Actions.SearchResultList();
  }
  onForSale() {
    console.log("On For Sale pressed!");
  }
  onForRent() {
    console.log("On For Rent pressed!");
  }
  onMoreOption() {
    console.log("On More Option pressed!");
  }
  onResetFilters() {
    this.props.actions.onSearchFieldChange("loaiNhaDat", '');
    this.props.actions.onSearchFieldChange("soPhongNgu", 0);
    this.props.actions.onSearchFieldChange("soTang", 0);
    this.props.actions.onSearchFieldChange("dienTich", [0,100]);
    this.props.actions.onSearchFieldChange("gia", [0,2000]);
    this.props.actions.onSearchFieldChange("orderBy", '');
  }

  _onPropertyTypesChoosed() {
    Actions.PropertyTypes();
  }

  _onSoPhongNguChanged(event) {
    this.props.actions.onSearchFieldChange("soPhongNgu", event.nativeEvent.selectedSegmentIndex)
  }

  _onSoTangChanged(event) {
    this.props.actions.onSearchFieldChange("soTang", event.nativeEvent.selectedSegmentIndex)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
