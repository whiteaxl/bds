'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

import gui from '../../lib/gui';

export default class RegisterTab extends React.Component {
  componentDidMount() {
    this.props.onDidMount(this.refs.username);
  }

  render() {

    return (
      <View style={styles.wrapper}>
        <TextInput style={styles.input}
                   //autoFocus={true}
                   ref="username" 
                   placeholder="Số điện thoại hoặc Email"
        />
        <TouchableOpacity style={styles.tiepTucBtn}>
          <Text style={styles.tiepTucText}>Tiếp tục</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.text}>Đăng nhập với Facebook</Text>
        </View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
  },

  text: {
    flex: 1, 
    alignSelf:'center',
    fontSize: 14,
    fontFamily: 'Open Sans',
    padding: 10,
    color: 'white',
    fontWeight : 'normal',
    //borderColor: 'red', borderWidth:2
  },

  tiepTucText: {
    flex: 1,
    alignSelf:'center',
    fontSize: 14,
    fontFamily: 'Open Sans',
    padding: 10,
    color: 'white',
    fontWeight : 'normal',
    //borderColor: 'red', borderWidth:2
  },

  tiepTucBtn: {
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