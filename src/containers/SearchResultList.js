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



import React, { Text, View, Component, Image, ListView, RecyclerViewBackedScrollView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Api from '../components/Api';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';


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



class SearchResultList extends Component {
  constructor(props) {
    super(props);
    var dataBlob = [];
    var loaiTin = this.props.search.form.fields.loaiTin;
    var loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var gia = this.props.search.form.fields.gia;
    var soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var soTang = this.props.search.form.fields.soTang;
    var dienTich = this.props.search.form.fields.dienTich;
    Api.getItems(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich)
      .then((data) => {
        if (data.list) {
          data.list.map(function(aRow) {
              // console.log(aRow.value);
              dataBlob.push(aRow.value);
            }
          );
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          var dataSource = ds.cloneWithRows(dataBlob);
          this.setState({
            dataSource: dataSource
          });
        } else {
          this.setState({
            errormsg: "Lỗi kết nối đến máy chủ!"
          });
        }
      });
  }
  render() {
    if (!this.state) {
      return (
  			<View style={styles.container}>
  			</View>
      )
    }
    if (!this.state.dataSource) {
      return (
  			<View style={styles.container}>
          <Text style={styles.welcome}>{this.state.errormsg}</Text>
  			</View>
      )
    }
    return (
			<View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.searchListView}
        />
        <View style={styles.searchButton}>
          <View style={styles.searchListButton}>
            <Button onPress={this.onSort}
              style={styles.searchListButtonText}>Sắp xếp</Button>
            <Button onPress={this.onSaveSearch}
              style={styles.searchListButtonText}>Lưu tìm kiếm</Button>
            <Button onPress={this.onMap}
              style={styles.searchListButtonText}>Bản đồ</Button>
          </View>
        </View>
			</View>
		)
	}
  renderRow(rowData, sectionID, rowID) {
    var diaChi = rowData.diaChi;
    var index = diaChi.indexOf(',', 20);
    var length = 0;
    if (index !== -1 && index <= 30) {
      length = index;
    } else {
      index = diaChi.indexOf(' ', 20);
      length = index !== -1 && index <= 30 ? index : 30;
    }
    diaChi = diaChi.substring(0,length);
    if (diaChi.length < rowData.diaChi.length) {
      diaChi = diaChi + '...';
    }
    var soPhongNgu = rowData.soPhongNgu;
    if (soPhongNgu) {
      soPhongNgu = " " + soPhongNgu + " phòng ngủ";
    }
    return (
      <View style={styles.row}>
        <Image style={styles.thumb} source={{uri: `${rowData.cover}`}}>
          <View style={styles.searchListViewRowAlign}>
            <View>
              <Text style={styles.price}>{rowData.price_value} {rowData.price_unit}</Text>
              <Text style={styles.text}>{diaChi}{soPhongNgu}</Text>
            </View>
            <Icon.Button name="heart-o" backgroundColor="transparent"
              underlayColor="transparent" style={styles.heartButton}/>
          </View>
        </Image>
      </View>
    );
  }
  onSort() {
    console.log("On Sort pressed!");
  }
  onSaveSearch() {
    console.log("On Save Search pressed!");
  }
  onMap() {
    console.log("On Map pressed!");
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
