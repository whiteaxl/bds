import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    ScrollView,
    ListView
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import util from "../../lib/utils";
import MHeartIcon from '../MHeartIcon';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';


import {Map} from 'immutable';

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

class KetQuaDinhGia extends Component {

  constructor(props) {
    super(props);
    console.log("KetQuaDinhGia.constructor");
    console.log(props);
    this.state = {
      loaiTin: props.loaiTin,
      loaiTinKey: props.loaiTin == 'bán' ? 0 : 1,
      giaTrungBinh: props.data.giaTrungBinh || undefined,
      giaTrungBinhKhac: props.data.giaTrungBinhKhac || [],
      bdsNgangGia: props.data.bdsNgangGia,
      diaChi: props.diaChi,
      radius: props.data.radius,
      loaiNhaDat: props.loaiNhaDat,
      duAn: props.duAn,
      dataSource: props.data.giaTrungBinh ? ds.cloneWithRows(props.data.bdsNgangGia) : ds.cloneWithRows([]),
      showListNhaGan: false
    };
  }

  _renderRow (data, sectionID , rowID){
    let isLiked = this.isLiked(data.adsID);
    // let color = isLiked ? '#E7E9EB' : 'white';
    let color = 'white';
    let bgColor = isLiked ? '#EC1B77' : '#4A443F';
    let bgStyle = isLiked ? {} : {opacity: 0.55};

    return(
        <TouchableOpacity style={styles.listMoRong}  onPress={() => Actions.SearchResultDetail({adsID: data.adsID, source: 'server'})} >
          <Image style={{width: width,height:150}} source={data.image.cover ? {uri: data.image.cover} : require('../../assets/image/reland_house_large.jpg')}>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.55)']}
                            style={styles.linearGradient2}>
            </LinearGradient>
            <View style={styles.heartContent}>
              <MHeartIcon onPress={() => this.onLike(data.adsID)}
                          color={color} bgColor={bgColor}
                          bgStyle={bgStyle} mainProps={styles.heartButton} />
            </View>

            <View style={{marginTop: -55, marginLeft: 10}}>
              <Text style={styles.priceText}>{data.giaFmt}</Text>
              <Text style={styles.infoText}>{util.getPriceM2Display(data.giaM2, data.loaiTin)} - Cách {data.distance}m </Text>
              <Text style={styles.infoText}>{data.diaChi && data.diaChi.length>30 ? data.diaChi.substring(0,30) + "..." : data.diaChi}</Text>
            </View>
          </Image>
        </TouchableOpacity>
    );
  }

  isLiked(adsID) {
    const {adsLikes} = this.props.global.currentUser;
    return adsLikes && adsLikes.indexOf(adsID) > -1;
  }

  onLike(adsID) {
    if (!this.props.global.loggedIn) {
      Actions.Login();
    } else {
      if (!this.isLiked(adsID)) {
        this.props.actions.likeAds(this.props.global.currentUser.userID, adsID);
      } else {
        this.props.actions.unlikeAds(this.props.global.currentUser.userID, adsID);
      }
    }
  }


  _renderNhaGan(){
      return(
          <View style={{flex:1, backgroundColor:'white'}}>
            <View style={styles.viewSpace}></View>
            <View style={styles.viewNhaDat}>
              <Text style={styles.textNhaDat}>GIÁ ƯỚC TÍNH CỦA CÁC LOẠI NHÀ ĐẤT KHÁC</Text>
            </View>
          </View>
      )
  }
  _renderDanhSachNha(){
      return(
          <View style={{flex:1, backgroundColor:'white', borderTopWidth:1, borderColor:'#e8e8ea'}}>
            <View style={{ width:width, justifyContent:'center', alignItems:'center',marginTop:12}}>
              <Text style={{fontSize:14, color:'black', marginTop: 1, marginBottom: 1, fontFamily: 'Open Sans'}}>NHÀ GẦN VỊ TRÍ ĐỊNH GIÁ</Text>
              <Text style={{fontSize:12, color:'#7b8b91', marginBottom: 2, fontFamily: 'Open Sans'}}>
                {this.state.duAn && this.state.duAn.length>0 ? this.state.duAn : this.state.diaChi}
              </Text>
            </View>
            <View style={{flex:1, backgroundColor:'white', marginTop:10}}>
              <ListView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap'}} dataSource={this.state.dataSource}  renderRow={this._renderRow.bind(this)}/>
            </View>
          </View>
      )
  }

  _renderGiaKhac(){
    return (
        <View style={styles.viewKhaoSat}>
          {
            this.state.giaTrungBinhKhac.map( (e) => {
              return this._renderGiaKhacItem(e.loaiNhaDatVal, e.giaM2TrungBinh, this.state.loaiTinKey);
            })
          }
        </View>
    )
  }

  _renderGiaKhacItem(loainhaDat, gia, loaiTin){
    return (
        <View style={styles.rowLoaiKhac}>
          <Text style={styles.textLoaiKhac}>{loainhaDat}</Text>
          <View style={styles.centerLineLoaiKhac}></View>
          <Text style={styles.textGiaLoaiKhac}>{util.getPriceM2Display(gia, loaiTin)}</Text>
        </View>
    )
  }

  _renderDinhGia(){
    if (this.state.duAn && this.state.duAn.length>0){
      if (this.state.giaTrungBinh) {
        return (
            <View style={styles.viewHopGia}>
              <Text style={styles.textHopGia1}>{this.state.giaTrungBinh.loaiNhaDatVal.toUpperCase()}</Text>
              <Text style={styles.textHopGia2}>{this.state.duAn}</Text>
              <Text style={styles.textHopGia3}>{util.getPriceM2Display(this.state.giaTrungBinh.giaM2TrungBinh, this.state.loaiTinKey)}</Text>
              <Text style={styles.textHopGia4}>Giá ước tính dựa trên dữ liệu {this.state.giaTrungBinh.count} nhà tương tự
                đã và đang {this.state.loaiTin}</Text>
              <Text style={styles.textHopGia5}>thuộc dự án {this.state.duAn}</Text>
            </View>
        )
      } else {
        return (
            <View style={[styles.viewHopGia,{height: 150}]}>
              <Text style={styles.textHopGia1}>{this.state.loaiNhaDat.toUpperCase()}</Text>
              <Text style={styles.textHopGia2}>{this.state.duAn}</Text>
              <Text style={styles.textHopGia4}>Không có thông tin định giá</Text>
              <Text style={styles.textHopGia5}>thuộc dự án {this.state.duAn}</Text>
            </View>
        )
      }
    } else {
      if (this.state.giaTrungBinh) {
        return (
            <View style={styles.viewHopGia}>
              <Text style={styles.textHopGia1}>{this.state.giaTrungBinh.loaiNhaDatVal.toUpperCase()}</Text>
              <Text style={styles.textHopGia2}>{this.state.diaChi}</Text>
              <Text style={styles.textHopGia3}>{util.getPriceM2Display(this.state.giaTrungBinh.giaM2TrungBinh, this.state.loaiTinKey)}</Text>
              <Text style={styles.textHopGia4}>Giá ước tính dựa trên dữ liệu {this.state.giaTrungBinh.count} nhà tương tự
                đã và đang {this.state.loaiTin}</Text>
              <Text style={styles.textHopGia5}>nằm trong vòng {this.state.radius}m xung quanh vị trí đã chọn</Text>
            </View>
        )
      } else {
        return (
            <View style={[styles.viewHopGia,{height: 150}]}>
              <Text style={styles.textHopGia1}>{this.state.loaiNhaDat.toUpperCase()}</Text>
              <Text style={styles.textHopGia2}>{this.state.diaChi}</Text>
              <Text style={styles.textHopGia4}>Không có thông tin định giá</Text>
              <Text style={styles.textHopGia5}>nằm trong vòng {this.state.radius}m xung quanh vị trí đã chọn</Text>
            </View>
        )
      }
    }

  }

  _renderBody(){
    if(this.state.giaTrungBinh && this.state.giaTrungBinh.giaM2TrungBinh > 0){
      return(
          this._renderDanhSachNha()
      )
    } else {
      if(this.state.giaTrungBinhKhac && this.state.giaTrungBinhKhac.length >0){
        return(
            <View>
              {this._renderNhaGan()}
              {this._renderGiaKhac()}
            </View>
        )
      } else {
        return;
      }

    }
  }

  render(){
    return(

          <View style={styles.container}>
            <View style={[styles.toolbar, Platform.OS === 'ios' ? {marginTop: 0} : null]}>
              <TouchableOpacity onPress={()=>Actions.pop()}style={styles.modalBack} >
                <Icon name="angle-left" size={40} color="white" />
              </TouchableOpacity>
              <View style={styles.viewTitle}>
                <Text style={styles.textTitle}>Giá ước tính</Text>
              </View>
              <View style={styles.viewCan}></View>
            </View>
            <ScrollView>
              <View style={styles.viewBody}>
                {this._renderDinhGia()}
                {this._renderBody()}
              </View>
            </ScrollView>
          </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'transparent',
    flex:1,
    alignItems:'center'
  },
  toolbar :{
    height: 64,
    flexDirection:'row',
    backgroundColor:'#1ea7de',
    borderBottomWidth:1,
    borderColor:'#1ea7de'
  },
  modalBack: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15,
    marginLeft:7
  },

  viewTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 17,
    fontFamily:'OpenSans-Bold'
  },

  viewCan: {
    width: 40
  },
  viewBody: {
    flex:1,
    backgroundColor:'white'
  },
  viewHopGia: {
    backgroundColor:'white',
    width:width,
    height:232,
    alignItems:'center'
  },
  textHopGia1: {
    fontSize:14,
    color:'#1ea7de',
    marginTop: 14,
    fontFamily:'Open Sans'
  },
  textHopGia2: {
    fontSize:13,
    color:'#3a3a3c',
    marginTop: 3,
    fontFamily:'Open Sans'
  },
  textHopGia3: {
    fontSize:45,
    color:'#ef4c23',
    marginTop: 19,
    fontFamily:'Open Sans',
    fontWeight:'400'
  },
  textHopGia4: {
    fontSize:12,
    color:'#58585a',
    marginTop: 24,
    fontFamily:'Open Sans'
  },
  textHopGia5: {
    fontSize:12,
    color:'#58585a',
    marginTop: 2,
    fontFamily:'Open Sans'
  },
  viewSpace: {
    width:width,
    height:26,
    backgroundColor:'#f3f3f5',
    borderColor:'#e8e8ea',
    borderBottomWidth:1,
    borderTopWidth:1
  },
  viewNhaDat: {
    width:width,
    height:39,
    backgroundColor:'white',
    borderColor:'#e8e8ea',
    borderBottomWidth:1,
    justifyContent:'center'
  },
  textNhaDat: {
    fontSize:12.5,
    color:'gray',
    marginLeft:19,
    fontFamily:'Open Sans'
  },
  viewKhaoSat: {
    width:width,
    backgroundColor:'white',
    justifyContent:'center'
  },
  textLoaiKhac: {
    fontSize:14,
    color:'gray',
    marginLeft:19,
    marginTop: 25,
    fontFamily:'Open Sans'
  },
  centerLineLoaiKhac: {
    borderColor:'#e8e8ea',
    borderBottomWidth:1,
    width:width/3 -20,
    height:40,
    marginLeft: 5
  },
  textGiaLoaiKhac:{
    fontSize:14,
    color:'gray',
    marginLeft:5,
    marginRight: 10,
    marginTop: 25,
    fontFamily:'Open Sans'
  },
  rowLoaiKhac: {
    backgroundColor:'white',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  listMoRong:{
    justifyContent:'center',
    width: width,
    height: 150,
  },
  linearGradient2: {
    marginTop: 75,
    height: 75,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    flex: 1
  },
  heartButton: {
    marginTop: 6,
    marginLeft: 30
  },
  heartContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 3,
    right: 10,
    alignSelf: 'auto'
  },

  priceText: {
    fontSize:15,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: 'Open Sans',
    fontWeight:'700'
  },
  infoText: {
    fontSize:12,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: 'Open Sans'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(KetQuaDinhGia);
