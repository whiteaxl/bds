'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Immutable Map
 */
import {Map} from 'immutable';
/**
 * Project actions
 */
import * as deviceActions from '../reducers/device/deviceActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * ## Actions
 * 2 of our actions will be available as ```actions```
 */
const actions = [
  deviceActions,
  globalActions
];

/**
 *  Save that state
 */
function mapStateToProps(state) {
  return {
      ...state
  };
};

/*
 * Bind all the functions from the ```actions``` and bind them with
 * ```dispatch```

 */
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


/**
 * We only have one state to worry about
 */

const {
  LOGIN_STATE_LOGOUT
} = require('../lib/constants').default;




import React, { View, Text, Navigator, Platform, StyleSheet, Component } from 'react-native';
import { Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux';

import Login from './Login';
import Launch from './Launch';
import Register from './Register';

import Home from './Home';

import Screen1 from './Screen1';
import Screen2 from './Screen2';

import Search from './Search';
import SearchResultList from './SearchResultList';
import SearchResultMap from './SearchResultMap';
import PropertyTypes from './PropertyTypes';
import OrderPicker from './OrderPicker';
import SearchResultDetail from './SearchResultDetail';

import Profile from './Profile';
import Tabbar from '../components/Tabbar';



/** Optional Redux section ******************************************/
/*  npm uninstall react-redux --save && npm uninstall redux --save  */

// var RNRF = require('react-native-router-flux');
// var {Route, Schema, Animations, Actions, TabBar} = RNRF;


// import { createStore } from 'redux'
// import { Provider, connect } from 'react-redux'
//
// function reducer(state = {}, action) {
//     switch (action.type) {
//         case Actions.BEFORE_ROUTE:
//             //console.log("BEFORE_ROUTE:", action);
//             return state;
//         case Actions.AFTER_ROUTE:
//             //console.log("AFTER_ROU
//             return state;
//         case Actions.AFTER_POP:
//             //console.log("AFTER_POP:", action);
//             return state;
//         case Actions.BEFORE_POP:
//             //console.log("BEFORE_POP:", action);
//             return state;
//         case Actions.AFTER_DISMISS:
//             //console.log("AFTER_DISMISS:", action);
//             return state;
//         case Actions.BEFORE_DISMISS:
//             //console.log("BEFORE_DISMISS:", action);
//             return state;
//         default:
//             return state;
//     }
//
// }
// let store = createStore(reducer);
// const Router = connect()(RNRF.Router);

/********************************************************************/




const hideNavBar = Platform.OS === 'android'
const paddingTop = Platform.OS === 'android' ? 0 : 8

class App extends Component {

	// Used for to pass the drawer to the all children
	static childContextTypes = {
		drawer: React.PropTypes.object,
	};

	constructor (props) {
		super(props);
		this.state = {
			drawer: null,
			loggedIn: false
		};
	}

  render() {
		const { drawer } = this.state;

    return (
			<Router name='root'>
				<Schema
					name='boot'
					sceneConfig={Navigator.SceneConfigs.FadeAndroid}
					hideNavBar={true}
					type='replace'
				/>
				<Schema
					name='main'
					sceneConfig={Navigator.SceneConfigs.FadeAndroid}
					hideNavBar={hideNavBar}
				/>

				<Route name='Launch' component={Launch} schema='boot' initial hideNavBar title="Welcome" />

				<Route name='Register' component={Register} schema='main' title="Register Screen" />
		        <Route name='Search' component={Search} schema='main' title="Tìm kiếm" hideNavBar={true} />
        		<Route name='SearchResultList' component={SearchResultList} schema='main' title="Danh sách" hideNavBar={true} />
            <Route name='SearchResultMap' component={SearchResultMap} schema='main' title="Bản đồ" hideNavBar={true} />
        		<Route name='PropertyTypes' component={PropertyTypes} schema='main' title="Loại nhà đất" hideNavBar={true} />
        		<Route name='OrderPicker' component={OrderPicker} schema='main' title="Sắp xếp" hideNavBar={true} />
            <Route name='SearchResultDetail' component={SearchResultDetail} schema='main' title="Chi tiết" hideNavBar={true} />

				<Route name='Home' hideNavBar={true} type='replace'>
			        <Tabbar>
						{/*
						<Router
							sceneStyle={styles.routerScene}
							navigationBarStyle={styles.navBar}
							titleStyle={styles.navTitle}
						>
							<Route name='Home' component={Home} schema='main' title='Home' />
							<Route name='Screen1' component={Screen1} schema='main' title='Screen1' />
							<Route name='Screen2' component={Screen2} schema='main' title='Screen2' />
							<Route name='Profile' component={Profile} schema='main' title='Profile' />

						</Router>
						*/}
	     			</Tabbar>
				</Route>

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
export default connect(mapStateToProps, mapDispatchToProps) (App);
