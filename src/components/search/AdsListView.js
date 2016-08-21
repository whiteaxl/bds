'use strict';

import AdsRow from './AdsRow';
import React from 'react';
import { StyleSheet, ListView, View, Text } from 'react-native';
import SGListView from 'react-native-sglistview';
import gui from '../../lib/gui';
var myDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import log from '../../lib/logUtil';
import GiftedSpinner from 'react-native-gifted-spinner';

class AdsListView extends React.Component {
  render() {
    log.info("Call SearchResultList._getListContent");

    let myProps = this.props;
    if (myProps.loading) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 30}}>
          {/*<Text> Loading ... </Text>*/}
          <GiftedSpinner />
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
      <SGListView
        dataSource={ds}
        renderRow={this.renderRow.bind(this)}
        stickyHeaderIndices={[]}
        initialListSize={1}
        onEndReachedThreshold={1}
        scrollRenderAheadDistance={3}
        pageSize={5}
        //renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        style={styles.searchListView}
      />
    )
  }

  renderRow(rowData) {
    return (
      <AdsRow ads={rowData}
              userID = {this.props.userID}
              likeAds = {this.props.actions.likeAds}
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
    backgroundColor: 'gray'
  },
});

module.exports = AdsListView;
