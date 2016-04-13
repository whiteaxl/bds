import React, {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import Launch from './Launch'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux'
import TabView from './TabView'

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? "red" :"black"}}>{this.props.title}</Text>
        );
    }
}

class Right extends React.Component {
    render(){
        return <Text style={{
        width: 80,
        height: 37,
        position: "absolute",
        bottom: 4,
        right: 2,
        padding: 8,
    }}>Right</Text>
    }
}

const styles = StyleSheet.create({
    container: {flex:1, backgroundColor:"transparent",justifyContent: "center",
        alignItems: "center",}

});

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

export default class Example extends React.Component {
    render() {
        return <Router createReducer={reducerCreate}>

            <Scene key="root" hideNavBar={true}>
                <Scene key="launch" component={Launch} title="Launch" initial={true} />

                <Scene key="main" tabs={true} default="tab6" type="replace">
                    <Scene key="tab1"  title="Tab #1" icon={TabIcon} navigationBarStyle={{backgroundColor:"red"}} titleStyle={{color:"white"}}>
                        <Scene key="tab1_1" component={TabView} title="Tab #1_1" onRight={()=>alert("Right button")} rightTitle="Right" />
                        <Scene key="tab1_2" component={TabView} title="Tab #1_2" titleStyle={{color:"black"}}/>
                    </Scene>
                    <Scene key="tab2" initial={true} title="Tab #2" icon={TabIcon}>
                        <Scene key="tab2_1" component={TabView} title="Tab #2_1"/>
                        <Scene key="tab2_2" component={TabView} title="Tab #2_2" onLeft={()=>alert("Left button!")} leftTitle="Left" duration={1} panHandlers={null}/>
                    </Scene>

                    <Scene key="tab4" component={TabView} title="Tab #4" hideNavBar={true} icon={TabIcon}/>
                    <Scene key="tab3" component={TabView} title="Tab #3" hideTabBar={true} icon={TabIcon}/>
                    <Scene key="tab6" component={TabView} title="Tab #6" hideNavBar={true} icon={TabIcon}/>
                    <Scene key="tab7" component={TabView} title="Tab #7" hideNavBar={true} icon={TabIcon}/>
                    <Scene key="tab8" component={TabView} title="Tab #8" hideNavBar={true} icon={TabIcon}/>
                    <Scene key="tab5" component={TabView} title="Tab #5" icon={TabIcon} renderRightButton={()=><Right/>}/>
                </Scene>

            </Scene>


        </Router>;
    }
}
