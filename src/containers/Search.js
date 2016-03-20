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



import React, { Text, View, Component, Navigator, TouchableOpacity
  , SegmentedControlIOS, ScrollView, StyleSheet } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import CommonHeader from './CommonHeader';

import LikeTabButton from '../components/LikeTabButton';
import RangeUtils from "../lib/RangeUtils"
import RangePicker from "../components/RangePicker"




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
    let pickerData = null;

    if (value=='ban') {
      pickerData = RangeUtils.sellPriceRange.getPickerData();
    } else {
      pickerData = RangeUtils.rentPriceRange.getPickerData();
    }
    
    this.props.actions.onSearchFieldChange("gia", RangeUtils.BAT_KY_RANGE);
   
    this.props.actions.onSearchFieldChange("giaPicker", pickerData);
    
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
    //console.log(this.props.search.form.fields.gia)
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.gia);
  }

   _getDienTichValue() {
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.dienTich);
  }

  render() {
    //console.log(RangeUtils.sellPriceRange.getPickerData());

    var _scrollView: ScrollView;
    return (
      <View style={styles.fullWidthContainer}>
        <CommonHeader headerTitle={"Tìm kiếm"} />

        <View style={styles.searchFilter}>
          <View style={styles.searchFilterButton}>

            <View style = {{flex:1, flexDirection: 'row'}}>
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
                <Text style={styles.searchAttributeValue}>
                  CÁC ĐIỀU KIỆN
                </Text>
              </View>


              <TouchableOpacity style={styles.searchFilterAttribute}
                onPress={this._onPressGiaHandle.bind(this)}>
                <Text style={myStyles.searchAttributeLabelBold}>
                  Giá
                </Text>

                <View style={{flexDirection: "row"}}>
                  <Text style={styles.searchAttributeValue}> {this._getGiaValue()} </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this._onPropertyTypesChoosed}>
                <View style={styles.searchFilterAttribute}>
                  <Text style={styles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <Icon name="angle-right" style = { {color:'gray'} } size={20} />
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
                <Text style={myStyles.searchAttributeLabelBold}>
                  Diện tích
                </Text>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.searchAttributeValue}>{this._getDienTichValue()} </Text>
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
      </View>
    );
  }
  onCancel() {
    Actions.pop();
  }
  onApply() {
    this.props.actions.onSearchFieldChange("listData", []);
    console.log("Search cridential:");
    console.log(this.props.search.form.fields);
    Actions.SearchResultList();
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

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  searchAttributeLabelBold : {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  },

  searchButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      color: 'white',
      fontWeight : 'normal'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
