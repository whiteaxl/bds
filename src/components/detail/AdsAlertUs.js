'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../../reducers/global/globalActions';
import * as searchActions from '../../reducers/search/searchActions';
import * as postAdsActions from '../../reducers/postAds/postAdsActions';

import {Map} from 'immutable';

import React, {Component} from 'react';

import {View, SegmentedControlIOS, Text, StyleSheet, Dimensions, AlertIOS} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../../components/CommonHeader';
import DanhMuc from '../../assets/DanhMuc';

import MultipleChoice from '../MultipleChoice2';

import gui from '../../lib/gui';

import Button from 'react-native-button';

import ReportApi from '../../lib/ReportRelandApi';

/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions,
    searchActions,
    postAdsActions
];

function mapStateToProps(state) {
    return {
        ...state,
    };
}

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

class AdsAlertUs extends Component {
    constructor(props) {
        super(props);
        var alertUsVal = this.getAdsAlertUsVal();
        this.state = {
            alertUs: alertUsVal,
            otherReport: ''
        };
    }

    setAlertUs(option) {
        this.props.actions.onAlertUsChange(option);
        this.setState({alertUs: option});
    }

    getAdsAlertUsVal() {
        var alertUsVal = this.props.search.alertUs;
        var adsAlertUsValues = DanhMuc.getAdsAlertUsValues();
        if (!alertUsVal) {
            alertUsVal = adsAlertUsValues[0];
        }
        return alertUsVal;
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Thông báo cho chúng tôi"} />
                <View style={myStyles.headerSeparator} />

                <MultipleChoice
                    scrollEnabled={false}
                    options={DanhMuc.getAdsAlertUsValues()}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.alertUs]}
                    maxSelectedOptions={1}
                    onSelection={(option)=>this._onApply(option)}
                    onTextFocus={() => this.setAlertUs("Khác")}
                    onTextChange={(text) => this.setState({otherReport: text})}
                />
                <View style={myStyles.buttonView}>
                    <Button style={myStyles.buttonText} onPress={this._onSend.bind(this)}>Gửi</Button>
                </View>
            </View>
        );
    }

    _onBack() {
        Actions.pop();
    }

    _onApply(option) {
        this.setAlertUs(option);
    }

    _onSend() {
        let params = {};
        params.adsID = this.props.adsID;
        params.ReportContent = this._getReportContent();
        params.type = "ClientReport";
        ReportApi.reportReland(params)
            .then(data => {
                AlertIOS.alert('Thông báo',
                    'Thông báo thành công!',
                    [{
                        text: 'Đóng',
                        onPress: () => {}
                    }]);
                Actions.pop();
            });
    }

    _getReportContent() {
        let alertUsVal = this.props.search.alertUs;
        let reportType = this._getReportKeyByValue(alertUsVal);
        if (reportType == 6) {
            alertUsVal = this.state.otherReport;
        }
        return alertUsVal;
    }

    _getReportKeyByValue(value) {
        var values = DanhMuc.getAdsAlertUsValues();
        var key = '';
        for (var i = 0; i < values.length; i++) {
            var oneValue = values[i];
            if (value == oneValue) {
                key = DanhMuc.AdsAlertUsKey[i];
                break;
            }
        }
        // console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(AdsAlertUs);



// Later on in your styles..
var myStyles = StyleSheet.create({
    fullWidthContainer: {
        flex: 0,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    choiceList: {
        paddingTop: 10,
        paddingLeft: 26,
        paddingRight: 0
    },
    searchButton: {
        alignItems: 'stretch',
        justifyContent: 'flex-end'
    },
    searchButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: gui.mainColor,
        height: 44
    },
    searchButtonText: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal'
    },
    headerSeparator: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: gui.separatorLine
    },
    buttonView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 10,
        height: 30,
        backgroundColor: '#F53113',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width-40
    },
    buttonText: {
        fontSize: gui.buttonFontSize,
        fontFamily: gui.fontFamily,
        fontWeight : 'normal',
        color: 'white',
        textAlign: 'center',
        width: Dimensions.get('window').width-50,
        height: 20
    }
});

