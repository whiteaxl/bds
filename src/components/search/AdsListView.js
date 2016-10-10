'use strict';

import AdsRow from './AdsRow';
import React from 'react';
import { StyleSheet, ListView, View, Text, Dimensions } from 'react-native';
import gui from '../../lib/gui';
var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import log from '../../lib/logUtil';
import GiftedSpinner from 'react-native-gifted-spinner';

class AdsListView extends React.Component {
  constructor(props) {
    super(props);
  }
  _scrollToTop() {
    this._listView.scrollTo({y: 0});
  }
  render() {
    log.info("Call SearchResultList._getListContent");

    let myProps = this.props;
    if (myProps.loading && myProps.allAdsItems.length === 0) {
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

    if (myProps.allAdsItems.length === 0 ) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          <Text style = {[gui.styles.defaultText,{textAlign:'center', fontSize:20}]}> {gui.INF_KhongCoKetQua} </Text>
        </View>
      )
    }

    let ds = myDs.cloneWithRows(myProps.allAdsItems);

    return (
      <ListView
        ref={(listView) => { this._listView = listView; }}
        dataSource={ds}
        renderRow={this.renderRow.bind(this)}
        stickyHeaderIndices={[]}
        initialListSize={1}
        onEndReachedThreshold={200}
        onEndReached={this._onEndReached.bind(this)}
        // scrollRenderAheadDistance={3}
        // pageSize={5}
        // onScroll={this.handleScroll.bind(this)}
        // scrollEventThrottle={200}
        //renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        style={styles.searchListView}
      />
    )
  }

  _onEndReached() {
    let myProps = this.props;
    console.log('onEndReached', myProps);
    if (myProps.loading) {
      return;
    }
    
    let pageNo = myProps.fields.pageNo;
    let allAdsItems = this.props.allAdsItems;

    if (allAdsItems.length >= gui.QUOTA_ITEM) {
      return;
    }

    let totalPages = myProps.totalCount/ myProps.fields.limit;

    if (totalPages && pageNo < totalPages) {
      pageNo = pageNo+1;
      myProps.actions.onSearchFieldChange("pageNo", pageNo);
      // myProps.actions.onShowMsgChange(true);
      this._handleSearchAction(pageNo);
    }
  }

  _handleSearchAction(newPageNo){
    var {loaiTin, ban, thue, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, viewport, diaChinh, center, huongNha, ngayDaDang,
        polygon, pageNo, limit, isIncludeCountInResponse} = this.props.fields;
    var fields = {
      loaiTin: loaiTin,
      ban: ban,
      thue: thue,
      soPhongNguSelectedIdx: soPhongNguSelectedIdx,
      soNhaTamSelectedIdx : soNhaTamSelectedIdx,
      dienTich: dienTich,
      orderBy: orderBy,
      viewport: viewport,
      diaChinh: diaChinh,
      center: center,
      radiusInKmSelectedIdx: radiusInKmSelectedIdx,
      huongNha: huongNha,
      ngayDaDang: ngayDaDang,
      polygon: polygon,
      pageNo: newPageNo || pageNo,
      limit: limit,
      isIncludeCountInResponse: isIncludeCountInResponse};

    this.props.actions.search(
        fields
        , () => {this._appendAdsList()});
  }

  _appendAdsList() {
    console.log('_appendAdsList pageNo', this.props.fields.pageNo);
    let allAdsItems = this.props.allAdsItems;
    allAdsItems = allAdsItems.concat(this.props.listAds);
    console.log('allAdsItems length', allAdsItems.length);
    this.props.actions.onChangeAdsList(allAdsItems);
  }

  handleScroll(event: Object) {
    if (event.nativeEvent.contentOffset.y < -100) {
      let myProps = this.props;

      if (myProps.loading) {
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
    marginTop: 0,
    margin: 0,
    backgroundColor: 'white'
  },
});

module.exports = AdsListView;
