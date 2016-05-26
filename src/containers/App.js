'use strict';

import  React from 'react';

import {View, Text, Navigator, Platform, StyleSheet} from 'react-native';
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, Switch} from 'react-native-router-flux';

import Launch from './Launch';
import Home from '../containers/Home';
import Inbox from '../containers/Inbox';
import PostAds from '../containers/PostAds';

import LoginRegister from './LoginRegister';

import Search from './Search';

import SearchResultList from './SearchResultList';
import SearchResultMap from './SearchResultMap';
import PropertyTypes from '../components/PropertyTypes';
import OrderPicker from '../components/OrderPicker';
import SearchResultDetail from './SearchResultDetail';
import SearchMapDetail from './SearchMapDetail';
import HuongNha from '../components/HuongNha';

import Profile from './Profile';

import SearchSuggestion from '../containers/PlacesAutoComplete';

import {connect} from 'react-redux';
const RouterWithRedux = connect()(Router);


import Icon from 'react-native-vector-icons/FontAwesome';

class TabIcon extends React.Component {
  render() {
    var color = this.props.selected ? '#FF3366' : '#FFB3B3';
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center'}}>
        <Icon style={{color: color}} name={this.props.iconName} size={30}/>
        <Text style={{color: color}}>{this.props.title}</Text>
      </View>
    );
  }
}

const reducerCreate = params=> {
  //console.log("Calling reducerCreate, params", params);
  const defaultReducer = Reducer(params);
  return (state, action)=> {
    console.log("Calling reducerCreate:", action, state);
    return defaultReducer(state, action);
  }
};

class App extends React.Component {
  render() {

    return (
      <RouterWithRedux >

        <Scene key="root" hideNavBar={true}>
          <Scene key='Launch' component={Launch} initial={true} title="Welcome" />

          <Scene key="Home" tabs={true} default="Main" type="replace">
            <Scene key="Main" title="home" iconName={"home"} icon={TabIcon}
                   component={Home}
                   hideNavBar={true} initial={true}/>


            <Scene key="Inbox" component={Inbox} title="Inbox" iconName={"inbox"} icon={TabIcon} hideNavBar={true}/>
            <Scene key="activity" component={PostAds} title="activity" iconName={"bell-o"} icon={TabIcon}/>
            <Scene key="Profile" component={Profile} title="Profile" iconName={"gear"} icon={TabIcon}/>

          </Scene>


          <Scene key='LoginRegister' component={LoginRegister} title="Register Screen" direction="vertical"/>

          <Scene key='Search' component={Search} title="Tìm kiếm" hideNavBar={true} direction="vertical"/>
          <Scene key='SearchResultList' component={SearchResultList} title="Danh sách" hideNavBar={true}/>
          <Scene key='SearchResultMap' component={SearchResultMap} title="Bản đồ" hideNavBar={true}/>
          <Scene key='PropertyTypes' component={PropertyTypes} title="Loại nhà đất" hideNavBar={true}/>

          <Scene key='HuongNha' component={HuongNha} title="Hướng nhà" hideNavBar={true}/>

          <Scene key='OrderPicker' component={OrderPicker} title="Sắp xếp" hideNavBar={true}/>
          <Scene key='SearchResultDetail' component={SearchResultDetail} title="Chi tiết" hideNavBar={true}/>
          <Scene key='SearchSuggestion' duration={20} direction="vertical" component={SearchSuggestion}
                 title="Serch Text" hideNavBar={true}/>
          <Scene key='SearchMapDetail' component={SearchMapDetail} title="Bản đồ" hideNavBar={true}/>

        </Scene>


      </RouterWithRedux>
    );
  }
}

export default App;
