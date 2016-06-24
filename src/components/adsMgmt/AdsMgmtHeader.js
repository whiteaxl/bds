// Import some code we need
import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import TruliaIcon from '../TruliaIcon';

import RelandIcon from '../RelandIcon';

import {Actions} from 'react-native-router-flux';

import gui from '../../lib/gui';

// Create our component
export default class AdsMgmtHeader extends React.Component {
  render() {
    return (
      <View style={mStyles.container}>
        <View style={mStyles.home}>
          <RelandIcon onPress={this._onHome}
                      name="home" color="white" size={20}
                      mainProps={{marginTop: 16, paddingLeft: 16, paddingRight: 16}}
          >
          </RelandIcon>
        </View>

        <Text style={mStyles.title}>Quản lý tin</Text>

        <View style={mStyles.search}>
          <TruliaIcon onPress={this._onSearch}
                      name="search" color="white" size={18}
                      mainProps={{paddingLeft: 16, paddingRight: 16}}
          >
          </TruliaIcon>
        </View>
      </View>
    )
  }

  _onHome() {
    Actions.Home({type: "reset"});
  }

  _onSearch() {
    Actions.Search({needBack: true});
  }
};

var mStyles = StyleSheet.create({
  container: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 60,
    paddingTop: 24
  },
  search: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  home: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor
  },
  text: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 52,
    right: 52
  },
  title: {
    color: 'white',
    fontWeight: "600",
    fontFamily: 'Open Sans',
    fontSize: 17,
  }
});
