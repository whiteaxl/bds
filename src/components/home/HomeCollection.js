'use strict';

import  React, {Component} from 'react';
import { Text, StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'

import gui from '../../lib/gui';
import log from '../../lib/logUtil';
import LinearGradient from 'react-native-linear-gradient';

import TruliaIcon from '../../components/TruliaIcon';

import {Actions} from 'react-native-router-flux';

var { width, height } = Dimensions.get('window');
var imageHeight = 143;


export default class HomeCollection extends Component {
  _onAdsDetailPressed() {
    console.log("On Ads detail pressed");
  }

  _onSeeMore() {
    let {query} = this.props.collectionData;
    query.limit = gui.MAX_ITEM;

    Actions.SearchResultList({type: "reset"});

    this.props.searchFromHome(query, () => {});
  }

  render() {
    let {title1, title2, data, query} = this.props.collectionData;
    return(
      <View style={{flexDirection: "column"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
          <Text style={styles.categoryLabel}>{title1}</Text>
          <Text style={styles.arrowLabel}>{title2}</Text>
        </View>

        <View style={styles.rowItem}>
          <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)} style={{flex: 0.55}}>
            <ImageItem ads={data[0]}>
            </ImageItem>
          </TouchableOpacity>
          <View style={{width:1}}>
          </View>
          <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)} style={{flex: 0.45}}>
            <ImageItem ads={data[1]} >
            </ImageItem>
          </TouchableOpacity>
        </View>

        <View style={{height:1}}>
        </View>

        <View style={styles.rowItem}>
          <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)} style={{flex: 0.45}}>
            <ImageItem ads={data[2]}>
            </ImageItem>
          </TouchableOpacity>
          <View style={{width:1}}>
          </View>
          <TouchableOpacity onPress={this._onAdsDetailPressed.bind(this)} style={{flex: 0.55}}>
            <ImageItem ads={data[3]}>
            </ImageItem>
          </TouchableOpacity>
        </View>

        <View style={{height:1}}>
        </View>
        <View style={{flex: 1}}>
          <ImageItem ads={data[4]}>
          </ImageItem>
        </View>

        <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this._onSeeMore.bind(this)} >
          <Text style={styles.moreDetailButton}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


class ImageItem extends React.Component{
  render() {
    let {cover, giaFmt, soPhongNguFmt, soPhongTamFmt, khuVuc} = this.props.ads;
    let detail = soPhongNguFmt ? soPhongNguFmt + " ": "" + (soPhongTamFmt || "");

    return (
      <Image style={[styles.imgItem]} resizeMode = {'cover'}
             source={{uri: cover}}>

        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                        style={styles.linearGradient2}>
        </LinearGradient>

        {/*
        <View style={styles.heartContent}>
          <TruliaIcon name="heart-o" mainProps={[styles.heartButton,{marginLeft: 30}]}
                      color={'white'} size={20}/>
        </View>
        */
        }

        <View style={styles.itemContent}>
          <View style={{flex: 1, paddingRight: 7}}>
            <Text style={styles.price}>{giaFmt}</Text>
            <Text style={styles.text} numberOfLines={1}>{khuVuc}</Text>
            <Text style={styles.text}>{detail}</Text>
          </View>
        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    height: 61
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 61
  },
  imgItem: {
    flex:1,
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
    top: imageHeight - 60,
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

  titleContainer : {
    height: 75,
    alignItems:'center',
    justifyContent: 'center',
    /*
     borderColor: 'red',
     borderWidth : 1,
     */
  },
  linearGradient2: {
    marginTop: imageHeight / 2,
    height: imageHeight / 2,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    flex: 1
  },
});
