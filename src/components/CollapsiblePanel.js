import React,{Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated,Dimensions,TouchableOpacity} from 'react-native'; //Step 1

import Icon from 'react-native-vector-icons/FontAwesome';

import gui from '../lib/gui';

class CollapsiblePanel extends Component{
    constructor(props){
        super(props);

        this.icons = {     //Step 2
            'up'    : 'angle-up',
            'down'  : 'angle-down'
        };

        this.state = {       //Step 3
            title       : props.title,
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
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];   //Step 4

            //Step 5
            return (
                <Animated.View style={[styles.container,{height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                    <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Icon.Button
                            name={icon} backgroundColor="transparent"
                            underlayColor="#f1f1f1" color={'gray'}
                            style={styles.button} />
                    </View>
                  </TouchableOpacity>

                    <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                        {this.props.children}
                    </View>

                </Animated.View>
            );
        } else {
            //Step 5
            return (
                <Animated.View style={[styles.container,{height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                    <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Icon.Button
                            name={icon} backgroundColor="transparent"
                            underlayColor="#f1f1f1" color={'gray'}
                            style={styles.button} />
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
        margin: 0,
        overflow:'hidden',
        width: Dimensions.get('window').width-20
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
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 0,
        width: Dimensions.get('window').width-50
    },
    button      : {
        justifyContent: 'flex-end'
    },
    body        : {
        margin: 0
    }
});

export default CollapsiblePanel;
