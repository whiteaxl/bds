'use strict';

import React, { View, Text, Navigator, Platform, StyleSheet, Component } from 'react-native';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux';

import Login from './Login';
import Launch from './Launch';
import Register from './Register';

import Search from './Search';
import SearchResultList from './SearchResultList';
import SearchResultMap from './SearchResultMap';
import PropertyTypes from '../components/PropertyTypes';
import OrderPicker from '../components/OrderPicker';
import SearchResultDetail from './SearchResultDetail';
import SearchMapDetail from './SearchMapDetail';


import Profile from './Profile';


import SearchSuggestion from '../containers/PlacesAutoComplete';

import Home from '../containers/Home';

import PostAd from '../containers/Screen1';
import Inbox from '../containers/Screen2';
import TestListView from '../test/TestListView';



import Icon from 'react-native-vector-icons/FontAwesome';

class TabIcon extends React.Component {
    render(){
        var color = this.props.selected ? '#FF3366' : '#FFB3B3';
        return (
            <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center'}}>
                <Icon style={{color: color}} name={this.props.iconName} size={30} />
                <Text style={{color: color}}>{this.props.title}</Text>
            </View>
        );
    }
}

const hideNavBar = Platform.OS === 'android'
const paddingTop = Platform.OS === 'android' ? 0 : 8

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

class App extends Component {
  render() {

    return (
        <Router createReducer={reducerCreate}>
            <Scene key="root" hideNavBar={true}>

				<Scene key='Launch' component={Launch} initial={true} title="Welcome" type="replace" />

				<Scene key='Register' component={Register} title="Register Screen" />

                <Scene key="SearchContainer" direction="vertical">
                    <Scene key='Search' component={Search} title="Tìm kiếm" hideNavBar={true} direction="vertical" />
                    <Scene key='SearchResultList' component={SearchResultList} title="Danh sách" hideNavBar={true} />
                    <Scene key='SearchResultMap' component={SearchResultMap}  title="Bản đồ" hideNavBar={true} />
                    <Scene key='PropertyTypes' component={PropertyTypes} title="Loại nhà đất" hideNavBar={true} />

                    <Scene key='OrderPicker' component={OrderPicker} title="Sắp xếp" hideNavBar={true} />
                    <Scene key='SearchResultDetail' component={SearchResultDetail} title="Chi tiết" hideNavBar={true} />
                    <Scene key='SearchSuggestion' component={SearchSuggestion} title="Serch Text" hideNavBar={true} />
                    <Scene key='SearchMapDetail' component={SearchMapDetail} title="Bản đồ" hideNavBar={true} />
                </Scene>

                <Scene key='TestListView' component={TestListView} title="Serch Text" hideNavBar={true} />

                <Scene key="Home" tabs={true} default="Main" type="replace">
                    <Scene key="Main" title="home" iconName={"home"} icon={TabIcon}
                           component={Home}
                           hideNavBar={true} initial={true} />

                    <Scene key="Inbox" component={Inbox} title="Inbox" iconName={"inbox"} icon={TabIcon} />
                    <Scene key="activity" component={TestListView} title="activity" iconName={"bell-o"} icon={TabIcon} />
                    <Scene key="Profile" component={Profile} title="Profile" iconName={"gear"} icon={TabIcon} />

                </Scene>


            </Scene>

		</Router>
    );
  }
}


const styles = StyleSheet.create({
  navBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  navTitle: {
    color: 'white',
  },
  routerScene: {
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight, // some navbar padding to avoid content overlap
  },
})

//connect the props
//export default connect(mapStateToProps, mapDispatchToProps) (App);
//hoailt: no need to connect
export default App;
