import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';

import {Actions} from 'react-native-router-flux';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

import Icon from 'react-native-vector-icons/FontAwesome';
import util from "../../lib/utils";

class KetQuaDinhGia extends Component {

   constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loaiTin: props.loaiTin,
      giaTrungBinh: props.data.giaTrungBinh,
      giaTrungBinhKhac: props.data.giaTrungBinhKhac || [],
      bdsNgangGia: props.data.bdsNgangGia,
      diaChi: props.diaChi,
      radius: props.data.radius,
      loaiNhaDat: props.loaiNhaDat
    };
  }

  _renderGiaKhacItem(loainhaDat, gia){
    return (
        <View style={styles.rowLoaiKhac}>
          <Text style={styles.textLoaiKhac}>{loainhaDat}</Text>
          <View style={styles.centerLineLoaiKhac}></View>
          <Text style={styles.textGiaLoaiKhac}>{util.roundToTwo(gia)} triệu/m²</Text>
        </View>
    )
  }

  _renderGiaKhac(){
    return (
        <View style={styles.viewKhaoSat}>
          {
            this.state.giaTrungBinhKhac.map( (e) => {
              return this._renderGiaKhacItem(e.loaiNhaDatVal, e.giaM2TrungBinh);
            })
          }
        </View>
    )
  }

  _renderDinhGia(){
    if (this.state.giaTrungBinh) {
      return (
          <View style={styles.viewHopGia}>
            <Text style={styles.textHopGia1}>{this.state.giaTrungBinh.loaiNhaDatVal}</Text>
            <Text style={styles.textHopGia2}>{this.state.diaChi}</Text>
            <Text style={styles.textHopGia3}>{util.roundToTwo(this.state.giaTrungBinh.giaM2TrungBinh)} triệu/m²</Text>
            <Text style={styles.textHopGia4}>Giá ước tính dựa trên dữ liệu {this.state.giaTrungBinh.count} nhà tương tự
              đã và đang {this.state.loaiTin}</Text>
            <Text style={styles.textHopGia5}>nằm trong vòng {this.state.radius}m xung quanh vị trí đã chọn</Text>
          </View>
      )
    } else {
      return (
      <View style={[styles.viewHopGia,{height: 150}]}>
        <Text style={styles.textHopGia1}>{this.state.loaiNhaDat}</Text>
        <Text style={styles.textHopGia2}>{this.state.diaChi}</Text>
        <Text style={styles.textHopGia4}>Không có thông tin định giá</Text>
        <Text style={styles.textHopGia5}>nằm trong vòng {this.state.radius}m xung quanh vị trí đã chọn</Text>
      </View>
      )
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
        <View style={styles.viewBody}>
          {this._renderDinhGia()}
          <View style={styles.viewSpace}></View>
          <View style={styles.viewNhaDat}>
            <Text style={styles.textNhaDat}>GIÁ ƯỚC TÍNH CỦA CÁC LOẠI NHÀ ĐẤT KHÁC</Text>
          </View>
          {this._renderGiaKhac()}
        </View>
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
    justifyContent:'space-between'}
});

export default KetQuaDinhGia;
