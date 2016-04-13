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
 * Font awesome icon
 */
import Icon from 'react-native-vector-icons/FontAwesome';

import Home from '../containers/Home';
import Profile from '../containers/Profile';
import PostAd from '../containers/Screen1';
import Inbox from '../containers/Screen2';
import Activity from '../test/ViewAsMarker';
import TestListView from '../test/TestListView';



import gui from '../lib/gui';

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

  _renderOneTab(Component, name, title, iconName) {
    return(
      <TabNavigator.Item selected={this.state.selectedTab === name}
                           title={title}
                           renderIcon={() => <Icon name={iconName} size={30} color="#A7BBF2" />}
                           renderSelectedIcon={() => <Icon name={iconName} size={30} color="#007aff" />}
                           onPress={() => this.setState({ selectedTab: name })}>
          <View style={styles.container}>
            <Component  />
          </View>
        </TabNavigator.Item>
    );
  },

  /**
   * ### render
   * Either display the 'Home' or the 'Profile'
   *
   */
  render() {
    return (
      <TabNavigator>
        {this._renderOneTab(Home, 'home', 'Home' ,'home')}
        {this._renderOneTab(Inbox, 'inbox', 'Inbox','inbox')}
        {this._renderOneTab(PostAd, 'postAd', 'Post Ad', 'plus-square-o')}
        {this._renderOneTab(TestListView, 'activity', 'TestListView','bell-o')}
        {this._renderOneTab(Profile, 'profile', 'Profile' , 'gear')}
      </TabNavigator>

    )
  }
});

export default Tabbar;