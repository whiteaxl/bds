'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import  React, {Component} from 'react';

import { Text, StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'

import {Actions} from 'react-native-router-flux';

import TruliaIcon from '../components/TruliaIcon';

import RelandIcon from '../components/RelandIcon';

import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

import gui from '../lib/gui';
import log from '../lib/logUtil';

import HomeCollection from '../components/home/HomeCollection';

var { width, height } = Dimensions.get('window');
var imageHeight = 143;

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


class Home extends Component {
  componentDidMount() {
    log.info("call home.componentDidMount");

    this.props.actions.loadHomeData();
  }

  renderCollections(collections) {
    return collections.map(e => {
      return <HomeCollection key={e.title1} collectionData = {e} searchFromHome={this.props.actions.searchFromHome}/>
    });
  }

  renderContent(collections) {
    if (this.props.search.homeDataErrorMsg) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style={styles.welcome}>{this.props.search.homeDataErrorMsg}</Text>
        </View>
      )
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        vertical={true}
        style={styles.scrollView}>

        {this.renderCollections(collections)}

        <View style={{height:40}}></View>
      </ScrollView>
    );
  }

  render() {
    log.info("call home.render", this.props.search.collections, this.props.search.homeDataErrorMsg);

    return (
      <View style={styles.fullWidthContainer}>
        <View style={styles.pageHeader}>
          <View style={styles.home}>
            <RelandIcon
                        name="home" color="white" size={20}
                        mainProps={{marginTop: 16, paddingLeft: 18, paddingRight: 16}}
            >
            </RelandIcon>
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>Trang chủ</Text>
          </View>
          <View style={styles.searchButton}>
            <RelandIcon onPress={this.handleSearchButton}
                        name="search-b" color="white" size={20}
                        mainProps={{marginTop: 13, paddingLeft: 16, paddingRight: 16}}
            >
            </RelandIcon>
          </View>
        </View>

        <View style={styles.homeDetailInfo}>
          {this.renderContent(this.props.search.collections)}
        </View>
      </View>
		)
	}

  handleSearchButton() {
    Actions.Search();
  }
}


var styles = StyleSheet.create({
  home: {
    paddingTop: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  title: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left:52,
    right:52
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 32,
    textAlign: 'center',
    color: 'white'
  },
  searchButton: {
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  homeDetailInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: 45
  },
  pageHeader: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 62.5
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 61
  },
  imgItem: {
    flex:1,
    alignItems: 'flex-start',
    height:imageHeight
  },
  imgItem_55: {
    flex:1,
    justifyContent: 'flex-start',
    height:imageHeight,
    width: (width*0.55)-1,
  },
  imgItem_45: {
    flex:1,
    alignItems: 'flex-start',
    width: (width*0.45)-1,
    height:imageHeight
  },
  imgItem_100: {
    flex:1,
    alignItems: 'flex-start',
    width: width,
    height:imageHeight
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  categoryLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  arrowLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 14,
    backgroundColor: 'transparent',
    color: gui.arrowColor
  },
  rowItem: {
    flexDirection: "row",
  },
  moreDetailButton: {
    margin: 12,
    marginLeft:20,
    marginRight:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: gui.mainColor,
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: gui.normalFontSize
  },
  linearGradient: {
    backgroundColor : "transparent"
  },
  itemContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imageHeight - 60
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  heartContent: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start'
  },
  heartButton: {
    marginTop: 5,
  },
  heartButton_45: {
    marginTop: 5,
    marginLeft: width*0.45-30
  },
  heartButton_55: {
    marginTop: 5,
    marginLeft: width*0.55-30
  },
  heartButton_100: {
    marginTop: 5,
    marginLeft: width-30
  },
  titleContainer : {
    height: 75,
    alignItems:'center',
    justifyContent: 'center',
    /*
    borderColor: 'red',
    borderWidth : 1,
     */
  },
  welcome: {
    marginTop: -50,
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
});



export default connect(mapStateToProps, mapDispatchToProps)(Home);
