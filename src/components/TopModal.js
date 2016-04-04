import React, { AppRegistry, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, Component} from 'react-native';

var {
  height: deviceHeight
} = Dimensions.get('window');

class TopModal extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      offset: new Animated.Value(deviceHeight),
    }
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 500,
      toValue: 0
    }).start();
  }

  closeModal() {
    Animated.timing(this.state.offset, {
      duration: 500,
      toValue: deviceHeight
    }).start(this.props.closeModal);
  }

  render() {
    return (
        <Animated.View style={[myStyles.modal, myStyles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
          <TouchableOpacity onPress={this.closeModal.bind(this)}>
            <Text style={{color: '#FFF'}}>Close Menu</Text>
          </TouchableOpacity>
        </Animated.View>
    )
  }
};

var myStyles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'grey',
    position: 'absolute',
    top: 2*deviceHeight/3,
    right: 0,
    bottom: 0,
    left: 0
  }
});

module.exports = TopModal;