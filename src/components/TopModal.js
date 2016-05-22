import React, {Component} from 'react';

import
{ AppRegistry,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions
}
from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// /**
//  * The actions we need
//  */
// import * as globalActions from '../reducers/global/globalActions';
// import * as searchActions from '../reducers/search/searchActions';
//
// /**
//  * Immutable Mapn
//  */
// import {Map} from 'immutable';
//
// import {Actions} from 'react-native-router-flux';

var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');


// const actions = [
//   globalActions,
//   searchActions
// ];
//
// function mapStateToProps(state) {
//   return {
//     ...state
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   const creators = Map()
//       .merge(...actions)
//       .filter(value => typeof value === 'function')
//       .toObject();
//
//   return {
//     actions: bindActionCreators(creators, dispatch),
//     dispatch
//   };
// }

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

    //Actions.SearchResultDetail({adsID: this.props.adsID});
  }

  render() {
    console.log("Call TopModal.render");

    return (
        <Animated.View style={[styles.modal, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
          <TouchableOpacity onPress={this.closeModal.bind(this)}>
            <Image style={styles.thumb} source={{uri: `${this.props.marker.cover}`}} >
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.5)']} 
                style={styles.linearGradient}>
              <View style={styles.detail}>
                <View>
                  <Text style={styles.price}>{this.props.marker.price}</Text>
                  <Text style={styles.text}>{this.getDiaChi(this.props.marker.diaChi)}</Text>
                </View>
                <Icon.Button name="heart-o" backgroundColor="transparent"
                  underlayColor="transparent" style={styles.heartButton}/>
              </View>
              </LinearGradient>
            </Image>
          </TouchableOpacity>
        </Animated.View>
    )
  }

  getDiaChi(param){
    var diaChi = param;
    var originDiaChi = param;
    if (diaChi) {
        var maxDiaChiLength = 35;
        var index = diaChi.indexOf(',', maxDiaChiLength-5);
        var length = 0;
        if (index !== -1 && index <= maxDiaChiLength) {
          length = index;
        } else {
          index = diaChi.indexOf(' ', maxDiaChiLength-5);
          length = index !== -1 && index <= maxDiaChiLength ? index : maxDiaChiLength;
        }
        diaChi = diaChi.substring(0,length);
        if (diaChi.length < originDiaChi.length) {
                  diaChi = diaChi + '...';
              }
    }
    return diaChi;
   }
};

var styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  thumb: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    marginTop: 2*deviceHeight/3,
    height: deviceHeight/3,
    width: deviceWidth,
    alignSelf: 'auto'
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
    color: 'white'
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginBottom: 15,
    margin: 5,
    color: 'white'
  },
  heartButton: {
    marginBottom: 10
  },
  detail: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: deviceHeight/3-60,
    width: deviceWidth
  }
});

export default TopModal;
//export default connect(mapStateToProps, mapDispatchToProps)(TopModal);