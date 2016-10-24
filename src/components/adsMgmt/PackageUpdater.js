'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as adsMgmtActions from '../../reducers/adsMgmt/adsMgmtActions';

import React, {Component} from 'react';

import {Text, View, StyleSheet, TextInput, StatusBar, Dimensions,
  TouchableHighlight, Image, Picker, Alert, ScrollView} from 'react-native'

import TruliaIcon from '../TruliaIcon';

import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
import log from "../../lib/logUtil";
import gui from "../../lib/gui";
import placeUtil from "../../lib/PlaceUtil";

import danhMuc from "../../assets/DanhMuc";

import util from "../../lib/utils";

import SegmentedControl from '../SegmentedControlSelector';

import MChartView from '../MChartView';

const actions = [
  globalActions,
  adsMgmtActions
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

class PackageUpdater extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
  }
  _onGoiPressed() {

  }

  _getTitle() {
    return "Gói vị trí";
  }

  _renderMoneyLine(label, value, dotColor) {
    return (
      <View style={{flexDirection:'row'}}>
        <View style={[myStyles.dot, {borderColor: dotColor}]}>
        </View>
        <View style={{flexDirection:'column', marginTop: 5, marginBottom: 5}}>
          <Text style={{fontSize: 14, fontFamily: gui.fontFamily, fontWeight: 'bold'}}>
            {value}
          </Text>
          <Text style={{fontSize: 12, fontFamily: gui.fontFamily}}>
            {label}
          </Text>
        </View>
      </View>
    )
  }

  _renderTitleLine(value) {
    return (
      <Text style = {{color:'#919191', padding: 10, paddingTop:20, paddingLeft: 19}}>
        {value}
      </Text>
    );
  }

  _getCurrentLevelName() {
    let current = this.props.adsMgmt.package.packageSelected;
    let levelName = this.props.adsMgmt.package[current].levelName;

    return levelName;
  }

  _getCurrentLength() {
    let current = this.props.adsMgmt.package.packageSelected;
    let length = this.props.adsMgmt.package[current].lengthName;

    return length;
  }

  _getCurrentLengthIndex() {
    let lengthName = this._getCurrentLength();
    let lengthVal = danhMuc.package.getLength(lengthName);
    let lengths = danhMuc.goiTin;
    let index = -1;
    for (var i = 0; i < lengths.length; i++) {
      if (lengthVal == Number(lengths[i])) {
        index = i;
        break;
      }
    }
    return index;
  }

  _renderPackageLine(title, value, onPress) {
    return (
        <TouchableHighlight
          onPress={onPress}>
          <View style={[myStyles.selectLine, myStyles.headerSeparator]}>
            <Text style={myStyles.label}>
              {title}
            </Text>
            <View style={myStyles.arrowIcon}>
              <Text style={myStyles.label}> {value} </Text>
              <TruliaIcon name={"arrow-right"} color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  _onLevelSelect(val) {
    this.props.actions.onSelectedPackageFieldChange("levelName", val);
  }

  _renderPackageSession(levelName, levelComment) {
    let isSelectedLevel = this._getCurrentLevelName() == levelName;
    let checkColor = isSelectedLevel ? gui.mainColor : 'gray';
    return (
        <View style={{flexDirection: 'column'}} key={levelName}>
          {this._renderSegment(levelName, danhMuc.goiTin, isSelectedLevel ? this._getCurrentLengthIndex() : -1,
              this._onSegmentChanged.bind(this, levelName), checkColor)}
          <Text style={[myStyles.label, {marginLeft: 17, marginBottom: 10}]}> {levelComment} </Text>
        </View>
    );
  }

  _onSegmentChanged(levelName, event) {
    this._onLevelSelect(levelName);
    let lengthIndex = event.nativeEvent.selectedSegmentIndex;
    let lengthName = '0 ngày';
    if (lengthIndex > -1) {
      let lengthVal = Number(danhMuc.goiTin[lengthIndex]);
      lengthName = danhMuc.package.length[lengthVal];
    }
    this.props.actions.onSelectedPackageFieldChange("lengthName", lengthName);
  }

  _renderSegment(label, values, selectedIndexAttribute, onChange, checkColor) {
    return (
        <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                          onChange={onChange} checkColor={checkColor}/>
    );
  }

  onApply() {
    Alert.alert(
      'Alert Title',
      'Bạn đồng ý mua gói dịch vụ ?',
      [
        {text: 'Hủy', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Đồng ý', onPress: () => {
          this.props.actions.buyCurrentPackage(this.props.adsMgmt.package, this.props.global.currentUser.userID);
          Actions.pop();
        }}
      ]
    )
  }

  render() {
    let packageNames = ['Đặc biệt', 'Cao cấp', 'Tiêu chuẩn'];
    let packageComments = ['Sử dụng các gói TRANG CHỦ để tin của bạn luôn nằm trên các tin khác trong các BỘ SƯU TẬP ở màn hình chính.',
      'Sử dụng các gói TRANG CHỦ để tin của bạn luôn nằm trên các tin khác trong các BỘ SƯU TẬP ở màn hình chính.',
      'Sử dụng các gói LOGO để tin của bạn thu hút được nhiều sự chú ý của người xem hơn.'];
    let packageSessions = [];
    for (var i = 0; i < packageNames.length; i++) {
      packageSessions.push(this._renderPackageSession(packageNames[i], packageComments[i]));
    }

    let data = [{
      "name": "",
      "fillColor" : "#1396E0",
      "value": 400
    }, {
      "name": "",
      "fillColor" : "#DE6207",
      "value": 100
    }];

    let pallete = [
      util.hexToRgb("#1396E0"), util.hexToRgb("#DE6207")
    ];

    let options = {
      margin: {
        top: 2,
        left: 2,
        bottom: 2,
        right: 2
      },
      width: 120,
      height: 120,
      r: 46,
      R: 58,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: gui.fontFamily,
        fontSize: gui.buttonFontSize,
        fontWeight: 'normal'
      }
    };

    let chartTitle = 'Tổng tài khoản';
    let chartTitleBold = '500k';
    return (
      <View style={myStyles.container}>
        <View style={myStyles.customPageHeader}>
          <View style={myStyles.customPageTitle}>
            <Text style={myStyles.customPageTitleText}>
              {this._getTitle()}
            </Text>
          </View>
          <TruliaIcon onPress={this._onBack.bind(this)}
                      name="arrow-left" color={'white'} size={25}
                      mainProps={myStyles.backButton} text={this.props.backTitle}
                      textProps={myStyles.backButtonText}>
          </TruliaIcon>

          <TouchableHighlight
            style={{right: 10
            , position:'absolute', top : 32}}

            onPress={this.onApply.bind(this)}>
            <Text style={{color: 'white', fontSize: 16
            , fontFamily: gui.fontFamily, fontWeight:'600'}}>
                Thực hiện
            </Text>
          </TouchableHighlight>

        </View>

        <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={[myStyles.scrollView]}
            //onScroll={this.handleScroll.bind(this)}
            //scrollEventThrottle={1}
        >
          {this._renderTitleLine("TÀI KHOẢN VÀ PHÍ DỊCH VỤ")}

          <View style={{flexDirection: "row", justifyContent: 'flex-start', backgroundColor:'white', paddingTop:8, paddingBottom: 8}}>
            <View style={{paddingLeft: 13, paddingTop:5, width: Dimensions.get('window').width/2, alignItems: 'center', justifyContent: 'center'}}>
              <MChartView
                  data={data}
                  options={options}
                  pallete={pallete}
                  chartTitle={chartTitle}
                  chartTitleBold={chartTitleBold}
              />
              {/*<Image
                  style={{width: 45, height: 45}}
                  resizeMode={Image.resizeMode.contain}
                  source={require('../../assets/image/goi/money.png')}
              />*/}
            </View>

            <View style={{paddingLeft: 13, paddingTop:5}}>
              {this._renderMoneyLine("Tài khoản chính", "400k", '#1396E0')}
              {this._renderMoneyLine("Tài khoản khuyến mại", "100k", '#DE6207')}
              {this._renderMoneyLine("Phí dịch vụ", "150k", '#FB0007')}
            </View>
          </View>

          {this._renderTitleLine("CÁC GÓI DỊCH VỤ")}

          {packageSessions}

        </ScrollView>
      </View>
    )
  }

  _onBack() {
    Actions.pop();
  }

}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#f6f6f6'
  },
  headerSeparator: {
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  customPageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: gui.mainColor,
    top: 0,
    height: 60
  },
  customPageTitle: {
    left: 36,
    right: 36,
    marginTop: 31,
    marginBottom: 10,
    position: 'absolute'
  },
  customPageTitleText: {
    color: 'white',
    fontSize: gui.normalFontSize,
    fontWeight: 'bold',
    fontFamily: gui.fontFamily,
    textAlign: 'center'
  },
  backButton: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 18,
    paddingRight: 18
  },
  backButtonText: {
    color: 'white',
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily,
    textAlign: 'left',
    marginLeft: 7
  },

  label: {
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A'
  },

  introText: {
    fontSize: 14,
    fontFamily: gui.fontFamily,
    color: '#8A8A8A',
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 10,

  },

  picker : {
    backgroundColor: 'white',
  },

  pickerItem: {
    fontSize: 11,
    fontFamily: gui.fontFamily,
  },
  selectLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 17,
    paddingRight: 10,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8
  },

  arrowIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 4
  },

  dot : {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 5
  },
  scrollView: {
    backgroundColor: 'white'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PackageUpdater);

