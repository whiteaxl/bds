'use strict';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';


import React, {Text, View, Component, StyleSheet, ListView, Image} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import log from "../lib/logUtil";
import gui from "../lib/gui";


/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions
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

import dbService from "../lib/localDB";


var {manager} = require('react-native-couchbase-lite');
var localDbName = 'default';
var database = new manager('http://admin:321@localhost:5984/', localDbName);

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            myAds:[],

            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }
    componentDidMount() {
        log.enter("componentDidMount");

        database.getAllDocuments()
            .then((all) => {
                log.info(all);
                this.setState({
                    myAds: all.rows
                })
            })
            .catch((e) => {
                log.error(e);
            });
    }

    onStopAutoSync() {
        clearInterval(this.interval);
    }

    onAutoSync() {
        var that = this;
        this.interval = setInterval(function () {
            that.onTestSync();
        }, 100);
    }

    onTestSync() {
        dbService.getAllAds()
            .then((res) => {
                console.log(res);

                var listAds = res.map((one) => {
                    return one.value;
                });

                this.setState({
                    myAds: listAds,
                    dataSource: this.state.dataSource.cloneWithRows(listAds)
                })
            });
    }

    _renderAds(ads) {
        //var ads = ads.doc;
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: ads.image.cover}}
                    style={styles.thumbnail}/>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{ads.adsID} - {ads.dangBoi.name}</Text>
                    <Text style={styles.year}>{ads.place.diaChi}</Text>

                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>........Profile screen........</Text>

                <Button style={styles.btn} onPress={this.onTestSync.bind(this)}>TestSync</Button>
                <Button style={styles.btn} onPress={this.onAutoSync.bind(this)}>Auto Sync each 100ms</Button>
                <Button style={styles.btn} onPress={this.onStopAutoSync.bind(this)}>Stop Sync each 100ms</Button>


                <Text style={styles.text}>Number of my ads: {this.state.myAds ? this.state.myAds.length : 0}</Text>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderAds}
                    style={styles.listView}/>
            </View>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);


var styles = StyleSheet.create({
    container: {
        top: 60,
        flex: 1,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    text : {
        fontFamily: gui.fontFamily,
        fontSize: gui.fontSize
    },
    btn: {
        margin: 10
    },

    thumbnail: {
        width: 120,
        height: 60
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center'
    },
    year: {
        textAlign: 'center'
    },
    listView: {
        paddingTop: 0,
        backgroundColor: 'white',
        flex : 1,
        marginBottom: 140
    }
});