'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import gui from "../../lib/gui";
import {Actions} from 'react-native-router-flux';
import TruliaIcon from './../TruliaIcon';


export default class SearchMapInputExt extends Component {
    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => Actions.SearchSuggestion({needReload: true, refreshRegion: this.props.refreshRegion,
                        onShowMessage: this.props.onShowMessage, loadHomeData: this.props.loadHomeData,
                        owner: this.props.owner})}
                >
                    <View style={styles.searchContainer}>
                            {this.props.isHeaderLoading && this.props.isHeaderLoading() ?
                                <View style={{width: 26}} /> :
                                <TruliaIcon name="search" size={14} color="#fff" iconProps={styles.typeIcon}
                                        mainProps={styles.searchIcon}
                            >
                            </TruliaIcon>}
                        <Text style={styles.titleText}> {this.props.placeName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        top: 0,
        position: 'absolute',
        left:0,
        right:0,
        height: 50
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 2,
        marginTop:3
    },
    searchContainer: {
        marginTop: 26,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: 2,
        marginLeft: 0,
        marginRight: 10,
        height: 30,
        opacity: 0.9
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
        top: 15

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
        flex:4
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'Open Sans',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent',
        fontWeight: '500'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'left'
    }
});
