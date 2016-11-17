import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet

} from 'react-native';

class FullLine extends Component {

    render(){
        let mstyle = this.props.style || {};
        return(
            <View style={[styles.headerSeparate, mstyle]}></View>
        );
    }
}

const styles = StyleSheet.create({
    headerSeparate: {
        borderTopWidth: 0.5,
        height:1,
        borderColor: "lightgray",
    },

});

export default FullLine;