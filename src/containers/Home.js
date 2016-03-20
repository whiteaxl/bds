'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';



import React, { Text, View, Component, ScrollView, Image, Dimensions } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
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



class Home extends Component {
  
  render() {
    var _scrollView: ScrollView;

    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.pageHeader}>
          <Icon.Button onPress={this.handleSearchButton}
            name="search" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search}>
            Tìm kiếm
          </Icon.Button>
        </View>

        <View style={styles.homeDetailInfo}>            
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={styles.scrollView}>

            <View style={{flex: 1}}>
  				    <Image style={{flex:1, justifyContent: 'center', 
                             alignItems: 'center', width: Dimensions.get('window').width, height:120}}
                source={require('../lib/image/home1.jpg')}>
                <Text style={styles.boldLabel}>Thông tin dự án</Text>
                
              </Image>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
  				    <View style={{flex:1}}>
                <Text style={{textAlign: "center", padding: 10, fontSize: 16, fontWeight: "bold", color: "white"}}>
                  Nhà đất bán
                </Text>
              </View>
              
              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán căn hộ chung cư</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán nhà riêng</Text>
                  </Image>
                </View>
              </View>

              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán nhà mặt phố</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán biệt thự, liền </Text>
                  </Image>
                </View>
              </View>

              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán đất</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Bán bất động sản khác</Text>
                  </Image>
                </View>
              </View>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1}}>
                <Text style={{textAlign: "center", padding: 10, fontSize: 16, fontWeight: "bold", color: "white"}}>
                  Nhà đất cho thuê
                </Text>
              </View>

              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Thuê chung cư</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Thuê nhà riêng</Text>
                  </Image>
                </View>
              </View>

              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Thuê nhà mặt phố</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Cho thuê văn phòng</Text>
                  </Image>
                </View>
              </View>
              
              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Thuê cửa hàng, ki-ốt</Text>
                  </Image>
                </View>
                <View style={{flex:1, alignItems: "center"}}>
                  <Image style={{flex:1, 
                         alignItems: 'flex-start', width: Dimensions.get('window').width/2-10, height:80}}
                         source={require('../lib/image/home1.jpg')}>
                    <Text style={styles.boldTitle}>Thuê bds khác</Text>
                  </Image>
                </View>
              </View>
              
            </View>
          </ScrollView>
        </View>
        
      </View>
		)
	}
  handleSearchButton() {
    Actions.Search();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
