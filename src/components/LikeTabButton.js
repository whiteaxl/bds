import React, {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import Button from 'react-native-button';

export default class LikeTabButton extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Button style={[styles.ButtonText, {color: this.props.selected?'green': 'black'}]} 
          onPress={() => this.props.onPress(this.props.name)}>
          {this.props.children}
        </Button>

        <View style = {[styles.lineunder, {borderBottomWidth:this.props.selected ? 3:0 }]}  /> 

      </View>
    );
  }

}


var styles = StyleSheet.create({
  lineunder: {
    flex: 1, 
    borderBottomColor: "green", 
    //borderBottomWidth: 3, 
    borderStyle: "solid", 
    //width: 60, 
    height: 3, 
    marginLeft: 5,
    marginRight: 5,

  }, 

  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', 
    
  },

  tabWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', 
    
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    //
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    top: -250, 
    alignSelf:'center', 
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    marginTop: 5
  }, 
  dot : {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    bottom: 160
  }, 

  ButtonText: {
    flex: 1, 
    alignSelf:'center',
    fontSize: 15, 
    padding: 10,
  },
});