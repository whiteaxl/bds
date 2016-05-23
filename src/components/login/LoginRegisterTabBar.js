const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity
} = ReactNative;
const Button = require('./Button');

import gui from "../../lib/gui";
import RelandIcon from '../../components/RelandIcon';

import {Actions} from 'react-native-router-flux';

export default class LoginRegisterTabBar extends React.Component {
 
  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'navy';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const textStyle = this.props.textStyle || {};

    return <Button
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => this.props.goToPage(page)}
    >
      <View style={styles.tab}>
        <Text style={[{color: isTabActive ? activeTextColor : inactiveTextColor, fontWeight: isTabActive ? 'bold' : 'normal', }, textStyle]}>
          {name}
        </Text>
      </View>
    </Button>;
  }

  onClose() {
    //todo: how to back
    Actions.Main();
  }

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: this.props.underlineColor || 'navy',
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

    return (
      <View style={styles.outer}>
        <View style={styles.tabs}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
          <Animated.View style={[tabUnderlineStyle, { left, }, ]} />
        </View>
        <TouchableOpacity
          style={{position:'absolute',top: 33,right: 10,}}
          onPress={this.onClose}>
          <RelandIcon.Icon style={styles.closeBtn} name="close-circle"/>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingBottom: 10,
    top: 11,

  },
  tabs: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ccc',
    backgroundColor: 'white'
  },
  closeBtn : {
    height: 18,
    paddingLeft:3,
    paddingRight:1,
    paddingTop: 2,
    color: gui.mainColor,
    fontSize: 13,
    backgroundColor: 'white'
  },
});
