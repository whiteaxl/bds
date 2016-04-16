'use strict';

import React, {
    Component,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import gui from "../lib/gui";
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class SearchInputExt extends Component {
    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={Actions.SearchSuggestion}
                >
                    <View style={styles.searchContainer}>
                            <Icon name="search" backgroundColor="transparent"
                                         underlayColor="transparent" color="white"
                            >
                            </Icon>
                            <Text style={styles.titleText}> {this.props.placeName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        top: 0,
        position: 'absolute',
        left:0,
        right:0,
        height: 50,
    },
    searchContainer: {
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: gui.searchHeaderBg,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        height: 25
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
        fontSize: 15,
        fontFamily: 'Open Sans',
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'transparent'
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