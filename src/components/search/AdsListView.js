'use strict';

import AdsRow from './AdsRow';
import React from 'react';
import { StyleSheet, ListView, View, Text, Dimensions } from 'react-native';
import SGListView from 'react-native-sglistview';
import gui from '../../lib/gui';
var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import log from '../../lib/logUtil';
import GiftedSpinner from 'react-native-gifted-spinner';

class AdsListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: props.fields.pageNo
    }
  }
  render() {
    log.info("Call SearchResultList._getListContent");

    let myProps = this.props;
    if (myProps.loading) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          {/*<Text> Loading ... </Text>*/}
          <GiftedSpinner size="large" />
        </View>
      )
    }

    if (myProps.errorMsg) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style={styles.welcome}>{myProps.errorMsg}</Text>
        </View>
      )
    }

    if (myProps.listAds.length === 0 ) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style = {gui.styles.defaultText}> {gui.INF_KhongCoKetQua} </Text>
        </View>
      )
    }

    let ds = myDs.cloneWithRows(myProps.listAds);

    return (
      <ListView
        dataSource={ds}
        renderRow={this.renderRow.bind(this)}
        stickyHeaderIndices={[]}
        initialListSize={1}
        onEndReachedThreshold={1}
        // onEndReached={this._onEndReached.bind(this)}
        scrollRenderAheadDistance={3}
        pageSize={5}
        // onScroll={this.handleScroll.bind(this)}
        // scrollEventThrottle={200}
        //renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        style={styles.searchListView}
      />
    )
  }

  _onEndReached() {
    let myProps = this.props;

    if (myProps.loading || myProps.counting || myProps.showMessage) {
      return;
    }
    
    let pageNo = this.state.pageNo;

    let totalPages = myProps.countResult/ myProps.fields.limit;

    if (totalPages && pageNo < totalPages) {
      this.state.pageNo = pageNo+1;
      myProps.actions.onSearchFieldChange("pageNo", this.state.pageNo);
      // myProps.actions.onShowMsgChange(true);
      this._handleSearchAction(this.state.pageNo);
    }
  }

  _handleSearchAction(newPageNo){
    var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, geoBox, place, huongNha, ngayDaDang, polygon, pageNo, limit} = this.props.fields;
    var fields = {
      loaiTin: loaiTin,
      loaiNhaDat: loaiNhaDat,
      soPhongNguSelectedIdx: soPhongNguSelectedIdx,
      soNhaTamSelectedIdx : soNhaTamSelectedIdx,
      dienTich: dienTich,
      gia: gia,
      orderBy: orderBy,
      geoBox: geoBox,
      place: place,
      radiusInKmSelectedIdx: radiusInKmSelectedIdx,
      huongNha: huongNha,
      ngayDaDang: ngayDaDang,
      polygon: polygon,
      pageNo: newPageNo || pageNo,
      limit: limit};

    this.props.actions.search(
        fields
        , () => {});
  }

  handleScroll(event: Object) {
    if (event.nativeEvent.contentOffset.y < -100) {
      let myProps = this.props;

      if (myProps.loading || myProps.counting || myProps.showMessage) {
        return;
      }

      let pageNo = this.state.pageNo;

      if (pageNo > 1) {
        this.state.pageNo = pageNo-1;
        myProps.actions.onSearchFieldChange("pageNo", this.state.pageNo);
        // myProps.actions.onShowMsgChange(true);
        this._handleSearchAction(this.state.pageNo);
      }
    }
  }

  renderRow(rowData) {
    return (
      <AdsRow ads={rowData} noCoverUrl={this.props.noCoverUrl}
              userID = {this.props.userID}
              likeAds = {this.props.actions.likeAds}
              unlikeAds = {this.props.actions.unlikeAds}
              loggedIn = {this.props.loggedIn}
              adsLikes={this.props.adsLikes}/>
    );
  }
}
const styles = StyleSheet.create({
  welcome: {
    marginTop: -50,
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  searchListView: {
    marginTop: 30,
    margin: 0,
    backgroundColor: 'white',
    height: Dimensions.get('window').height-108
  },
});

module.exports = AdsListView;
