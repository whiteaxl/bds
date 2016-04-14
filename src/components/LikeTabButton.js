import React, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import Button from 'react-native-button';
import gui from '../lib/gui';

export default class LikeTabButton extends React.Component {
  render() {
    var selected = this.props.selected;
    var myStyle = selected? 'buttonTextSelected' : 'buttonText'

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity 
          onPress={() => this.props.onPress(this.props.name)}>
          <Text style={styles[myStyle]} >
            {this.props.children}
          </Text>
        </TouchableOpacity>

        <View style = {[styles.lineunder, {borderBottomWidth:selected ? 5:0 }]}  /> 

      </View>
    );
  }
}


var styles = StyleSheet.create({
  lineunder: {
    flex: 1, 
    borderBottomColor: gui.mainColor, 
   
    borderStyle: "solid", 
    //width: 60, 
    height: 3, 
    marginLeft: 5,
    marginRight: 5

  }, 

  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
    
  },

  buttonText: {
    flex: 1, 
    alignSelf:'center',
    fontSize: 12,
    fontFamily: 'Open Sans',
    padding: 10,
    color: 'black',
    fontWeight : 'normal'
  },

  buttonTextSelected: {
    flex: 1, 
    alignSelf:'center',
    fontSize: 12,
    fontFamily: 'Open Sans',
    padding: 10,
    color: gui.mainColor,
    fontWeight : 'bold'
  }
});