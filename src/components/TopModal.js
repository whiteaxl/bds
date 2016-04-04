import React, { AppRegistry, View, Image, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, Component} from 'react-native';

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

import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

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
  height: deviceHeight,
  width: deviceWidth
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
    var diaChi = this.props.search.form.fields.marker.diaChi;
    var price = this.props.search.form.fields.marker.price;
    var unit = this.props.search.form.fields.marker.unit;
 
    return (
        <Animated.View style={[myStyles.modal, myStyles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
          <TouchableOpacity onPress={this.closeModal.bind(this)}>
            
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']} 
              style={myStyles.linearGradient}>
            <Image style={myStyles.thumb} source={{uri: `${this.props.search.form.fields.marker.cover}`}} >
            </Image>
            <View style={myStyles.detail}>
              <View>
                <Text style={myStyles.price}>{price} {unit}</Text>
                <Text style={myStyles.text}>{diaChi}</Text>
              </View>
              <Icon.Button name="heart-o" backgroundColor="transparent"
                underlayColor="transparent" style={myStyles.heartButton}/>
            </View>
            </LinearGradient>

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
    backgroundColor: 'white',
    position: 'absolute',
    top: 2*deviceHeight/3,
    right: 0,
    bottom: 0,
    left: 0
  },
  thumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: deviceHeight/3,
    width: deviceWidth,
    alignSelf: 'auto',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor : "transparent"
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white',
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginBottom: 15,
    margin: 5,
    color: 'white',
  },
  heartButton: {
    marginBottom: 10,
  },
  detail: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: deviceHeight/3-60,
    width: deviceWidth
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);