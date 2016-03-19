'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';



import React, { Text, View, Component, MapView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../components/MapApi';
import styles from './styles';
import SearchResultDetailFooter from './SearchResultDetailFooter';


/**
* ## Redux boilerplate
*/
const actions = [
  globalActions
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



class SearchResultDetail extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.state) {
      return (
        <View style={styles.fullWidthContainer}>
          <CommonHeader headerTitle={"Chi tiết"} />
          <View style={styles.searchContent}>
            <Text style={styles.welcome}>Đang tải dữ liệu!</Text>
          </View>
          <SearchResultDetailFooter />
  			</View>
      )
    }
    var rowData = this.state.rowData;
    if (!rowData) {
  			return (
          <View style={styles.fullWidthContainer}>
            <CommonHeader headerTitle={"Chi tiết"} />
            <View style={styles.searchContent}>
              <Text style={styles.welcome}>"Lỗi kết nối đến máy chủ!"</Text>
            </View>
            <SearchResultDetailFooter />
    			</View>
        )
    }
    return (
			<View style={styles.container}>
        <CommonHeader headerTitle={"Chi tiết"} />
        <View style={styles.searchContent}>
          <Image style={styles.searchDetailImage}
             source={{uri: `${rowData.cover}`}}>
            <View style={styles.searchDetailInfo}>
              <Text style={styles.text}>
                Bán/Cho thuê
              </Text>
              <Text style={styles.text}>
                Loại nhà
              </Text>
              <Text style={styles.text}>
                Địa chỉ
              </Text>
              <Text style={styles.text}>
                Diện tích
              </Text>
              <Text style={styles.text}>
                Giá
              </Text>
              <Text style={styles.text}>
                Số tầng
              </Text>
              <Text style={styles.text}>
                Số phòng
              </Text>
              <Text style={styles.text}>
                Ngày đăng
              </Text>
              <Text style={styles.text}>
                Chi tiết
              </Text>
              <Text style={styles.text}>
                Liên hệ
              </Text>
              <Text style={styles.text}>
                Danh sách comments
              </Text>
            </View>
          </Image>
        </View>
        <SearchResultDetailFooter />
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
