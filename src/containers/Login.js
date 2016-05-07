'use strict';

import React, { View, Text, StyleSheet, Component, TextInput} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';

import {Alert} from "react-native";

/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions,
    authActions
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


export default class Login extends React.Component {

    login() {
        let userDto = {
            phone: this.props.auth.phone,
            password: this.props.auth.password
        };

        this.props.actions.login(userDto.phone, userDto.password)
            .then((res) => {
                if (res.status ===0) {
                    Actions.Home();
                } else {
                    Alert.alert("Invalid username or password!");
                }
            })
    }

  render(){
    return (
      <View style={styles.container}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput style={styles.input} value={this.props.auth.phone}
                     onChangeText={(text) => this.props.actions.onAuthFieldChange('phone',text)}
          />
          <Text style={styles.label}>Mat Khau</Text>
          <TextInput style={styles.input} value={this.props.auth.password}
                     onChangeText={(text) => {
                        //console.log(this.props.actions.onAuthFormFieldChange);
                        //console.log(text);
                        this.props.actions.onAuthFieldChange('password',text)
                     }}
          />
          <Button onPress={this.login.bind(this)}>Login</Button>
      </View>
    )
  };

}


export default connect(mapStateToProps, mapDispatchToProps)(Login);

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: "center"

    },

    label: {
        fontSize: 15,
        fontWeight: "bold"
    },

    input: {
        fontSize: 15,
        width: 200,
        height: 30,
        borderWidth: 1,
        alignSelf: 'center',
        padding: 5

    }
});