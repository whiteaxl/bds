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



import React, { Text, StyleSheet, View, Component, ScrollView, Image, Dimensions } from 'react-native'

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
  				    <Image style={homeStyles.slideImgItem}
                source={require('../lib/image/home1.jpg')}>
                <Text style={homeStyles.boldLabel}>Thông tin dự án</Text>
              </Image>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
  				    <View style={{flex:1, alignItems: "center"}}>
                <Text style={homeStyles.headerLabel}>
                  Nhà đất bán
                </Text>
              </View>
              
              <View style={homeStyles.itemRow}>
                <HotDeal title="Bán căn hộ chung cư" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Bán nhà riêng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
              </View>

              <View style={homeStyles.itemRow}>
                <HotDeal title="Bán nhà mặt phố" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Bán biệt thự, liền kề" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
              </View>
              
              <View style={homeStyles.itemRow}>
                <HotDeal title="Bán đất" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Bán bất động sản khác" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
              </View>
            </View>

            <View style={{flex:1, flexDirection: "column"}}>
              <View style={{flex: 1, alignItems: "center"}}>
                <Text style={homeStyles.headerLabel}>
                  Nhà đất cho thuê
                </Text>
              </View>

              <View style={homeStyles.itemRow}>
                <HotDeal title="Thuê chung cư" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Thuê nhà riêng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
              </View>

              <View style={homeStyles.itemRow}>
                <HotDeal title="Thuê nhà mặt phố" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Cho thuê văn phòng" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
              </View>
              
              <View style={homeStyles.itemRow}>
                <HotDeal title="Thuê cửa hàng, ki-ốt" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>
                <HotDeal title="Thuê bds khác" imageUrl={'http://nhadat24h.net/Upload/User/Dangtin/Images/218628/Thumbnai/fceb8f91-9e68-40bc-b375-766f53bdfdcc_bthumb.jpg'}/>                
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

class HotDeal extends React.Component{
  render() {
    return (
        <View style={homeStyles.column}>
          <Image style={homeStyles.imgItem}
            source={{uri: this.props.imageUrl}}>
            <Text style={homeStyles.boldTitle}>{this.props.title}</Text>
          </Image>
        </View>
    );          
  }
}

var homeStyles = StyleSheet.create({
  imgItem: {
    flex:1,
    alignItems: 'flex-start', 
    width: Dimensions.get('window').width/2-10, 
    height:80
  },
  slideImgItem: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: Dimensions.get('window').width, 
    height:120
  },
  column: {
    flex:1, 
    alignItems: "center"
  },
  boldTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    color: 'white',     
  },
  boldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'grey',
    color: 'white',     
  },
  headerLabel: {
    textAlign: "center", 
    paddingTop: 10, 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#FF3366"
  },
  itemRow: {
    flex:1, 
    flexDirection: "row", 
    paddingTop:10
  }
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
