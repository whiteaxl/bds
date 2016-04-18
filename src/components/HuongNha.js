'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';


import React, {View, Component, SegmentedControlIOS, Text, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux';

import CommonHeader from '../components/CommonHeader';
import DanhMuc from '../assets/DanhMuc';

import MultipleChoice from './MultipleChoice';

import Button from 'react-native-button';

import gui from '../lib/gui';

/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions,
    searchActions
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

var HuongNhaKey = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
];

var huongNhaValues = DanhMuc.getHuongNhaValues();

class HuongNha extends Component {
    constructor(props) {
        super();
        var huongNha = this.getValueByKey(huongNhaValues, props.search.form.fields.huongNha);
        this.state = {
            huongNha: huongNha
        };
    }

    render() {
        return (
            <View style={myStyles.fullWidthContainer}>
                <CommonHeader headerTitle={"Hướng nhà"} backTitle={"Tìm kiếm"} />
                <View style={myStyles.headerSeparator} />

                <MultipleChoice
                    options={huongNhaValues}
                    style={myStyles.choiceList}
                    selectedOptions={[this.state.huongNha]}
                    maxSelectedOptions={1}//{this.props.search.form.fields.loaiTin=='ban' ? nhaDatBan.length : nhaDatChoThue.length}
                    onSelection={(option)=>this._onPropertyTypeSelected(option)}
                />

                <View style={myStyles.searchButton}>
                    <View style={myStyles.searchButtonWrapper}>
                        <Button onPress={this._onBack}
                                style={myStyles.searchButtonText}>Thoát</Button>
                        <Button onPress={this._onApply.bind(this)}
                                style={myStyles.searchButtonText}>Thực hiện</Button>
                    </View>
                </View>

            </View>
        );
    }

    _onBack() {
        Actions.pop();
    }

    _onApply() {
        var {huongNha} = this.state;
        this.props.actions.onSearchFieldChange("huongNha", this.getKeyByValue(huongNhaValues, huongNha));
        Actions.pop();
    }

    _onPropertyTypeSelected(option) {
        var {huongNha} = this.state;
        if (huongNha == option) {
            this.setState({huongNha: ''});
        } else {
            this.setState({huongNha: option});
        }
    }

    getValueByKey(values, key) {
        var value = '';
        for (var i = 0; i < HuongNhaKey.length; i++) {
            var loaiKey = HuongNhaKey[i];
            if (key === loaiKey) {
                value = values[i];
                break;
            }
        }
        //console.log(value);
        return value;
    }

    getKeyByValue(values, value) {
        var key = '';
        for (var i = 0; i < values.length; i++) {
            var oneValue = values[i];
            if (value === oneValue) {
                key = HuongNhaKey[i];
                break;
            }
        }
        //console.log(key);
        return key;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(HuongNha);



// Later on in your styles..
var myStyles = StyleSheet.create({
    fullWidthContainer: {
        flex: 1,
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
    }
});

