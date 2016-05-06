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


import React, {Text, View, Component} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import styles from './styles';


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

//import dbService from "../lib/localDB";


var {manager} = require('react-native-couchbase-lite');
var localDbName = 'default';
var database = new manager('http://admin:321@localhost:5984/', localDbName);

class Profile extends Component {
    constructor() {
        super();
        console.log("call mee1111")
        this.state = {
            myAds:[]
        };
    }
    componentDidMount() {
        console.log("Call componentDidMount");

        database.getAllDocuments()
            .then((all) => {
                console.log(all);
                this.setState({
                    myAds: all.rows
                })
            })
            .catch((e) => {
                console.log(e);
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
        /*
        var dbName = 'default';
        var remoteDbUrl = 'http://0982969669:123@localhost:4984/' + dbName;
        database.replicate(dbName, remoteDbUrl, true);
        database.replicate(remoteDbUrl, dbName, true);
        */
        database.queryView('ads', 'all_ads')
            .then((res) => {
                console.log("by view:" , res);

                this.setState({
                    myAds: res.rows
                })
            });

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>........Profile screen........</Text>
                <Text style={{fontFamily: 'Open Sans'}}>
                    Very long text to test new font that we will use for all app
                    Spacious, Move In Condition, 2 bedroom corner apartment that has 2 exposures. There are
                    plenty of closets. Walk to train, bus, shopping, dining, beach, marina and NewRoc Center.
                    Exercise room and laundry in building
                </Text>
                <Text style={styles.stuff}>Welcome: {this.props.global.currentUser.userID}</Text>

                <Button onPress={this.onTestSync.bind(this)}>TestSync</Button>
                <Button onPress={this.onAutoSync.bind(this)}>Auto Sync each 100ms</Button>
                <Button onPress={this.onStopAutoSync.bind(this)}>Stop Sync each 100ms</Button>


                <Text style={{fontFamily: 'Open Sans'}}>Number of my ads: {this.state.myAds.length}</Text>
            </View>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);

