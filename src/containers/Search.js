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



import React, { Text, View, Component, Navigator, TouchableOpacity } from 'react-native'

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
    return (
      <View style={styles.container}>
        <View style={styles.searchFilter}>
          <View style={styles.searchFilterButton}>



            <View onPress={this.onForSale} style = {{flex:1, flexDirection: 'row'}}>
              <LikeTabButton name={'ban'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={this.props.search.form.fields.loaiTin === 'ban'}>Bán</LikeTabButton>
              <LikeTabButton name={'thue'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={this.props.search.form.fields.loaiTin === 'thue'}>Cho thuê</LikeTabButton>
            </View>

          </View>
          <View style={styles.searchFilterDetail}>

            <View style={styles.searchSectionTitle}>
              <Text style={styles.searchAttributeLabel}>
                Các điều kiện
              </Text>
            </View>


            <View style={styles.searchFilterAttribute}>
              <Text style={styles.searchAttributeLabel}>
                Giá
              </Text>

              <TouchableOpacity style={{flexDirection: "row"}}
                onPress={this._onPressGiaHandle.bind(this)}>
                  <Text style={styles.searchAttributeValue}> {this._getGiaValue()} </Text>
                  <Text style={styles.searchAttributeValue}> V </Text>
               </TouchableOpacity>
            </View>

            <View style={styles.searchFilterAttribute}>
              <Text onPress={this.onChosePropertyTypes}>
              Loại nhà đất
              </Text>
            </View>

            <View style={styles.searchFilterAttribute}>
              <Text style={styles.searchAttributeLabel}>
                Diện tích
              </Text>

              <TouchableOpacity style={{flexDirection: "row"}}
                onPress={this._onPressDienTichHandle.bind(this)}>
                  <Text style={styles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                  <Text style={styles.searchAttributeValue}> V </Text>
               </TouchableOpacity>
            </View>



          </View>
          <View style={styles.searchMoreFilterButton}>
            <View style={styles.searchMoreFilterAttribute}>
              <Button onPress={this.onMoreOption}>Thêm</Button>
            </View>
            <View style={styles.searchMoreFilterAttribute}>
              <Button onPress={this.onResetFilters}>Thiết lập lại</Button>
            </View>
          </View>
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
    console.log("On Reset Filters pressed!");
  }

  onChosePropertyTypes() {
    Actions.PropertyTypes();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
