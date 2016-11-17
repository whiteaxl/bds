import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    TouchOpacity,
    StyleSheet
} from 'react-native';
import gui from '../lib/gui';
import HomeHeader from '../components/home/HomeHeader';

class MicroVoice extends React.Component {
    _renderComingSoon() {
        return (
            <View style={styles.contentComing}>
                <Text style={styles.textComingTitle}>Sắp xuất hiện!</Text>
                <Text style={styles.textComing}>Bạn chỉ cần nói ra đặc điểm của bất động sản cần tìm, "Trợ lý Landber" sẽ tự động tìm kiếm giúp bạn.</Text>
            </View>

        );
    }

    render() {
        return (
            <View style={styles.container}>
                <HomeHeader />
                {this._renderComingSoon()}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container:{
        paddingTop: 0,
        backgroundColor: "white",
        flex:1
    },
    contentComing: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textComingTitle: {
        fontFamily: gui.fontFamily,
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: 'transparent',
        color:'#6a6a6c'
    },
    textComing: {
        marginTop:8,
        fontFamily: gui.fontFamily,
        fontSize: 13,
        fontWeight: '400',
        justifyContent:'center',
        backgroundColor: 'transparent',
        color:'#6a6a6c',
        marginLeft: 25,
        marginRight:25
    }

});

export default MicroVoice;