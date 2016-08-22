import React, {Component} from 'react';

import gui from '../lib/gui';

import {Pie} from 'react-native-pathjs-charts';

var {
    StyleSheet,
    View,
    Text
} = require('react-native');

class MChartView extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        var {mainProps, data, options, pallete, chartTitle, chartTitleBold} = this.props;
        var titleWidth = options.width - 2*(options.R - options.r) - 20;
        return (
            <View style={mainProps||styles.chartContent}>
                <Pie
                    data={data}
                    options={options}
                    pallete={pallete}
                    accessorKey="value" />
                <View style={styles.labelContent}>
                    {this._renderSummaryLabel(chartTitle, chartTitleBold, titleWidth)}
                </View>
            </View>
        );
    }

    _renderSummaryLabel(chartTitle, chartTitleBold, titleWidth) {
        return (
            <View style={{flexDirection:'column', width: titleWidth}}>
                <Text style={styles.titleBold}>
                    {chartTitleBold}
                </Text>
                <Text style={styles.title}>
                    {chartTitle}
                </Text>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    chartContent: {
    },
    labelContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 12,
        fontFamily: gui.fontFamily,
        color: '#9C9C9C',
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
    titleBold: {
        fontSize: 14,
        fontFamily: gui.fontFamily,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        textAlign: 'center'
    }
});

module.exports = MChartView;
