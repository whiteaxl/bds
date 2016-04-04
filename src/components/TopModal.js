import React, { AppRegistry, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, Component} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

import {Actions} from 'react-native-router-flux';

import gui from '../lib/gui';

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
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
            <Text style={{color: '#FFF'}}>{this.props.search.form.fields.marker.diaChi}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);