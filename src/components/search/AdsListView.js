'use strict';

import AdsRow from './AdsRow';
import React from 'react';
import { StyleSheet, ListView, View, Text, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import gui from '../../lib/gui';
var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import log from '../../lib/logUtil';
import GiftedSpinner from 'react-native-gifted-spinner';

class AdsListView extends React.Component {
  constructor(props) {
    super(props);
  }
  _scrollToTop() {
    this._scrollTo(0);
  }
  _scrollTo(pos) {
    if (this._listView) {
      this._listView.scrollTo({y: pos});
    }
  }
  render() {
    log.info("Call SearchResultList._getListContent");

    let myProps = this.props;
    if (myProps.loading && myProps.listAds.length === 0) {
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
        <View style={{flex:1, alignItems:'center', justifyContent:'flex-start', marginTop: (5*Dimensions.get('window').height)/23}}>
          <Text style = {[gui.styles.defaultText,{textAlign:'center',
          fontSize:16, fontWeight: '600', color: '#6E6F71', paddingLeft: 15, paddingRight: 15}]}> {gui.INF_KhongCoKetQua} </Text>
          <Text style = {[gui.styles.defaultText,{textAlign:'center',
          fontSize:16, color: '#6B6F6E', paddingLeft: 15, paddingRight: 15}]}> {gui.INF_KhongCoKetQua2} </Text>
          <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this._onAllRegion.bind(this)} >
            <View style={styles.allRegion}>
              <Text style={styles.allRegionButton}>Xem tất cả các khu vực</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    let ds = myDs.cloneWithRows(myProps.listAds);

    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh.bind(this)}
          />
        }

        ref={(listView) => { this._listView = listView; }}
        dataSource={ds}
        renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID, (rowID == 0), (rowID == (ds._dataBlob.s1.length-1)))}
        stickyHeaderIndices={[]}
        initialListSize={1}
        // onEndReachedThreshold={200}
        // onEndReached={this._onEndReached.bind(this)}
        // scrollRenderAheadDistance={3}
        // pageSize={5}
        // onScroll={this.handleScroll.bind(this)}
        // scrollEventThrottle={1000}
        //renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        style={styles.searchListView}
      />
    )
  }

  _onAllRegion() {

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

    let totalPages = myProps.totalCount/ myProps.limit;

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
        polygon, pageNo, isIncludeCountInResponse} = this.props.fields;
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
      limit: this.props.limit,
      isIncludeCountInResponse: isIncludeCountInResponse};

    this.props.actions.search(
        fields
        , () => {this.props.scrollToTop()});
  }

  // _appendAdsList() {
  //   console.log('_appendAdsList pageNo', this.props.fields.pageNo);
  //   let allAdsItems = this.props.allAdsItems;
  //   allAdsItems = allAdsItems.concat(this.props.listAds);
  //   console.log('allAdsItems length', allAdsItems.length);
  //   this.props.actions.onChangeAdsList(allAdsItems);
  // }

  handleScroll(event: Object) {
    // if (event.nativeEvent.contentOffset.y < -100) {
    //   let myProps = this.props;
    //
    //   if (myProps.loading) {
    //     return;
    //   }
    //
    //   let pageNo = this.state.pageNo;
    //
    //   if (pageNo > 1) {
    //     this.state.pageNo = pageNo-1;
    //     myProps.actions.onSearchFieldChange("pageNo", this.state.pageNo);
    //     // myProps.actions.onShowMsgChange(true);
    //     this._handleSearchAction(this.state.pageNo);
    //   }
    // }
    let pos = event.nativeEvent.contentOffset.y;
    this.props.actions.onChangeListScrollPos(pos < 0 ? 0 : pos);
  }

  renderRow(rowData = {}, sectionID, rowID, isFirstRow, isLastRow) {
    let myProps = this.props;
    let pageNo = myProps.fields.pageNo;
    let totalPages = myProps.totalCount/ myProps.limit;

    let showFirstControl = pageNo > 1;
    let showLastControl = !myProps.loading && totalPages && pageNo < totalPages;

    return (
      <AdsRow ads={rowData} noCoverUrl={this.props.noCoverUrl}
              userID = {this.props.userID}
              likeAds = {this.props.actions.likeAds}
              unlikeAds = {this.props.actions.unlikeAds}
              loggedIn = {this.props.loggedIn}
              adsLikes={this.props.adsLikes}
              isFirstRow={isFirstRow}
              showFirstControl={showFirstControl}
              isLastRow={isLastRow}
              showLastControl={showLastControl}
              loadPreviousPage={() => this.loadPreviousPage()}
              loadNextPage={() => this.loadNextPage()}
              getPagingTitle={this.getPagingTitle.bind(this)}/>
    );
  }

  _onRefresh() {
    this.props.actions.onSearchFieldChange("pageNo", 1);
    this._handleSearchAction(1);
  }

  loadPreviousPage() {
    let myProps = this.props;
    console.log('loadPreviousPage', myProps);
    if (myProps.loading) {
      return;
    }

    let pageNo = myProps.fields.pageNo;

    if (pageNo > 1) {
      pageNo = pageNo-1;
      myProps.actions.onSearchFieldChange("pageNo", pageNo);
      // myProps.actions.onShowMsgChange(true);
      this._handleSearchAction(pageNo);
    }
  }

  loadNextPage() {
    let myProps = this.props;
    console.log('loadNextPage', myProps);
    if (myProps.loading) {
      return;
    }

    let pageNo = myProps.fields.pageNo;
    let totalPages = myProps.totalCount/ myProps.limit;

    if (totalPages && pageNo < totalPages) {
      pageNo = pageNo+1;
      myProps.actions.onSearchFieldChange("pageNo", pageNo);
      // myProps.actions.onShowMsgChange(true);
      this._handleSearchAction(pageNo);
    }
  }

  getPagingTitle() {
    let myProps = this.props;
    let numberOfAds = myProps.listAds.length;
    let totalCount = myProps.totalCount;
    let {pageNo} = myProps.fields;
    let limit = myProps.limit;
    let beginAdsIndex = (pageNo-1)*limit+1;
    let endAdsIndex = (pageNo-1)*limit+numberOfAds;
    if (totalCount < endAdsIndex) {
      totalCount = endAdsIndex;
    }
    let title = 'Đang hiển thị từ ' + beginAdsIndex + "-" + endAdsIndex + ' / ' + totalCount + ' kết quả';
    return title;
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
  allRegion: {
    margin: 9,
    padding: 4,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    borderRadius: 5,
    borderColor: 'transparent'
  },
  allRegionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: 15
  }
});

module.exports = AdsListView;
