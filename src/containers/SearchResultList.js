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
    Api.getItems()
      .then((data) => {
        if (data.list) {
          data.list.map(function(aRow) {
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
        />
			</View>
		)
	}
  renderRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.row}>
        <Image style={styles.thumb} source={{uri: `${rowData.cover}`}}>
          <Text style={styles.text}>{rowData.price_value} {rowData.price_unit}</Text>
          <Text style={styles.text}>{rowData.diaChi}</Text>
        </Image>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
