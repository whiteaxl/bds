import React, {Component} from 'react';

import {StyleSheet,Text,View,Image,TouchableHighlight,Animated,Dimensions,TouchableOpacity} from 'react-native'; //Step 1

import gui from '../lib/gui';

import TruliaIcon from './TruliaIcon';

class CollapsiblePanel extends Component{
    constructor(props){
        super(props);

        this.icons = {     //Step 2
            'up'    : 'arrow-up',
            'down'  : 'arrow-down'
        };

        this.state = {       //Step 3
            title       : props.title,
            subtitle    : props.subtitle,
            expanded    : props.expanded,
            animation   : new Animated.Value()
        };
    }

    toggle(){
      //Step 1
      let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
          finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

      this.setState({
          expanded : !this.state.expanded  //Step 2
      });

      this.state.animation.setValue(initialValue);  //Step 3
      Animated.spring(     //Step 4
          this.state.animation,
          {
              toValue: finalValue
          }
      ).start();  //Step 5
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }


    render(){
        let {mainProps, bodyProps} = this.props;

        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];   //Step 4

            //Step 5
            return (
                <Animated.View style={[styles.container, mainProps,{height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                    <View  onLayout={this._setMinHeight.bind(this)}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <TruliaIcon onPress={this.toggle.bind(this)}
                                name={icon} color={'gray'}
                                mainProps={styles.button} size={20} />
                        </View>
                        {this.state.subtitle ? <Text style={styles.subtitle}>{this.state.subtitle}</Text> : null}
                    </View>

                    <View style={[styles.body, bodyProps]} onLayout={this._setMaxHeight.bind(this)}>
                        {this.props.children}
                    </View>
                  </TouchableOpacity>

                </Animated.View>
            );
        } else {
            //Step 5
            return (
                <Animated.View style={[styles.container, mainProps, {height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                      <View  onLayout={this._setMinHeight.bind(this)}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <TruliaIcon onPress={this.toggle.bind(this)}
                                name={icon} color={'gray'}
                                mainProps={styles.button} size={20} />
                        </View>
                        {this.state.subtitle ? <Text style={styles.subtitle}>{this.state.subtitle}</Text> : null}
                    </View>
                  </TouchableOpacity>

                </Animated.View>
            );
        }

    }
}

var styles = StyleSheet.create({
    container   : {
        backgroundColor: 'transparent',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 6,
        marginBottom: 10,
        overflow:'hidden',
        width: Dimensions.get('window').width-30
    },
    titleContainer : {
        flexDirection: 'row',
		alignItems: 'flex-start',
        justifyContent: 'space-between',
        margin: 0
    },
    title       : {
        flex    : 1,
        color   :'black',
        fontSize: 16,
        fontFamily: gui.fontFamily,
        fontWeight: '600',
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 0,
        width: Dimensions.get('window').width-60
    },
    subtitle    : {
        fontSize: 13,
        fontFamily: gui.fontFamily,
        color: '#9C9C9C',
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 0
    },
    button      : {
        marginTop: 0,
        marginBottom: 0,
        justifyContent: 'flex-end',
        height: 20,
        width: 30,
    },
    body        : {
        margin: 0,
        marginTop: 13,
    }
});

export default CollapsiblePanel;
