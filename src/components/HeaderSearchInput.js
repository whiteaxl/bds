'use strict';

//share for Map result and ListResult ?

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import gui from "../lib/gui";
import {Actions} from 'react-native-router-flux';


export default class HeaderSearchInput extends Component {
  render() {
    return(
        <View style={styles.container}>
          <TouchableOpacity style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}
              onPress={() => Actions.SearchSuggestion({needReload: true})}
          >
            <Text style={styles.titleText}> {this.props.placeName}</Text>
          </TouchableOpacity>
        </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: gui.mainColor,
    top: 0,
    position: 'absolute',
    left:0, 
    right:0,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput : {
    fontSize: 15, 
    height: 30, 
    borderRadius: 5
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 15, 

  },
  inputContainerStyle: {
    borderRadius:5
  },

  itemText: {
    fontSize: 15,
    margin: 2
  },
  info: {
    paddingTop: 60,
    flex:4,
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  openingText: {
    textAlign: 'center'
  }
});
