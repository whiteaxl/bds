'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import { Text, View, ListView
    , TextInput, StyleSheet,RecyclerViewBackedScrollView
    , TouchableHighlight} from 'react-native'

import {Actions} from 'react-native-router-flux';

import api from '../lib/FindApi';

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



class SearchSuggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false
        };
    }

    componentDidMount() {
        this._onChangeText();
    }

    _onSelectOne(place) {
        console.log("You selected: " + place.fullName);
        let value = place;
        this.props.actions.onSearchFieldChange("place", value);

        Actions.pop();
    }
    _renderRow(place) {
        return (
            <View>
                <TouchableHighlight onPress={() => this._onSelectOne(place)}>
                    <Text style={[{fontSize:14, color: 'blue', height: 35}]}>{place.fullName}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    _onEndEditing(e) {
        console.log("_onEndEditing:");
        console.log(e);
    }

    _onChangeText(queryText) {
        api.getPlaces(queryText)
            .then((data) => {
                console.log(data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.list),
                    loaded: true
                });
            })
            .done();
    }

    render() {
        return (
            <View style={[styles.fullWidthContainer,{borderColor: 'red', borderWidth:0}]}>
                <View>
                  <TextInput
                      style = {[styles.textInput,{borderColor: 'yellow', borderWidth:0}]}
                      ref="textInput"
                      onEndEditing= {(e) => this._onEndEditing(e)}
                      onChangeText={this._onChangeText.bind(this)}
                      placeholder="Nhập tên dự án/đường/xã/huyện..."
                      //value={""}
                  />
                </View>
                <ListView
                    style={[{
                        borderWidth:0
                    }]}
                  dataSource={this.state.dataSource}
                  keyboardShouldPersistTaps={true}
                  renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                  renderRow={this._renderRow.bind(this)}
                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    textInput : {
        //marginTop:30,
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
        fontSize: 15,
        fontWeight: 'normal',
        marginBottom: 20,
        marginTop: 30,
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
    },
    fullWidthContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white',
        padding: 30
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestion);

