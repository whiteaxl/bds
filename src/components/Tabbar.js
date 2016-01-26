/**
 * # Tabbar.js
 *
 * This class provides basic navigation between the home and the
 * profile only if the user is logged in 
 */
'use strict';
/**
*
* ## Imports
*
* React
*/
import React,
{
  StyleSheet,
  View
}
from 'react-native';

/**
 * A tab bar that switches between scenes, written in JS for cross-platform support
 */
import TabNavigator from 'react-native-tab-navigator';
/**
 * Font awesome icon
 */
import Icon from 'react-native-vector-icons/FontAwesome';

import Home from '../containers/Home';
import Profile from '../containers/Profile';
import PostAd from '../containers/PostAd';
import Inbox from '../containers/Inbox';

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  mark: {
    width: 150,
    height: 150
  }
});

let Tabbar = React.createClass({
    /**
     * ## Tabbar class
     *
     * getInitialState set the tab to home
     */
  getInitialState() {
    return {
      selectedTab: 'home'
    };
  },
  /**
   * ### render
   * Either display the 'Home' or the 'Profile'
   *
   */
  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item selected={this.state.selectedTab === 'home'}
                           title="Home"
                           renderIcon={() => <Icon name="home" size={30} color="#FFB3B3" />}
                           renderSelectedIcon={() => <Icon name="home" size={30} color="#FF3366" />}
                           onPress={() => this.setState({ selectedTab: 'home' })}>
          <View style={styles.container}>
            <Home />
          </View>
        </TabNavigator.Item>

        <TabNavigator.Item selected={this.state.selectedTab === 'PostAd'}
                           title="PostAd"
                           renderIcon={() => <Icon name="plus-square-o" size={30} color="#FFB3B3" />}
                           renderSelectedIcon={() => <Icon name="plus-square-o" size={30} color="#FF3366" />}
                           onPress={() => this.setState({ selectedTab: 'PostAd' })}>
          <View style={styles.container}>
            <PostAd/>
          </View>
        </TabNavigator.Item>

        <TabNavigator.Item selected={this.state.selectedTab === 'Inbox'}
                           title="Inbox"
                           renderIcon={() => <Icon name="inbox" size={30} color="#FFB3B3" />}
                           renderSelectedIcon={() => <Icon name="inbox" size={30} color="#FF3366" />}
                           onPress={() => this.setState({ selectedTab: 'Inbox' })}>
          <View style={styles.container}>
            <Inbox/>
          </View>
        </TabNavigator.Item>
       
        <TabNavigator.Item selected={this.state.selectedTab === 'profile'}
                           title="Profile"
                           renderIcon={() => <Icon name="gear" size={30} color="#FFB3B3" />}
                           renderSelectedIcon={() => <Icon name="gear" size={30} color="#FF3366" />}
                           onPress={() => this.setState({ selectedTab: 'profile' })}>
          <View style={styles.container}>
            <Profile/>
          </View>
        </TabNavigator.Item>
      </TabNavigator>

    )
  }
});

export default Tabbar;
