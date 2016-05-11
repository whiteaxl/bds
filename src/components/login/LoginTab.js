import React, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput, Alert
} from 'react-native';

import gui from '../../lib/gui';
import {Actions} from 'react-native-router-flux';

/**
 * ## Redux boilerplate
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';

/**
 * The actions we need
 */
import * as globalActions from '../../reducers/global/globalActions';
import * as authActions from '../../reducers/auth/authActions';

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

class LoginTab extends React.Component {
  componentDidMount() {
    this.props.onDidMount(this.refs.username);
  }

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
      .catch((res) => {
        Alert.alert(res.toString());
      })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <TextInput style={styles.input}
                   selectTextOnFocus={true}
                   ref='username' autoFocus={true}
                   value={this.props.auth.phone}
                   placeholder="Số điện thoại hoặc Email"
                   onChangeText={(text) => {
                        this.props.actions.onAuthFieldChange('phone',text)
                   }}
        />
        <TextInput style={styles.input} placeholder="Mật khẩu"
                   selectTextOnFocus={true}
                   value={this.props.auth.password}
                   onChangeText={(text) => {
                        this.props.actions.onAuthFieldChange('password',text)
                   }}
        />

        <TouchableOpacity style={styles.btn}
                          onPress={this.login.bind(this)}
        >
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginTab);


var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },

  btnText: {
    flex: 1,
    alignSelf:'center',
    fontSize: 14,
    fontFamily: 'Open Sans',
    padding: 10,
    color: 'white',
    fontWeight : 'normal',
    //borderColor: 'red', borderWidth:2
  },

  btn: {
    margin: 18,
    backgroundColor: '#00668f',
    alignItems:'center',
    height: 40,
    borderRadius:2
  },

  input : {
    marginTop: 18,
    marginLeft: 18,
    marginRight: 18,
    fontSize: 14,
    fontFamily: 'Open Sans',
    padding: 10,
    color: 'black',
    fontWeight : 'normal',
    height: 40,
    backgroundColor:"white",
    borderRadius:5
  }
});