'use strict';

import React, {PropTypes,Component} from 'react';

import {
    Text,
    TouchableOpacity,
    View,
    ListView,
    StyleSheet,
    TextInput,
    Dimensions
} from 'react-native';

import BaseComponent from './BaseComponent';

import TruliaIcon from './TruliaIcon';

import gui from '../lib/gui';

const propTypes = {
    options: React.PropTypes.array.isRequired,
    selectedOptions: React.PropTypes.array,
    maxSelectedOptions: React.PropTypes.number,
    onSelection: React.PropTypes.func,
    renderIndicator: React.PropTypes.func,
    renderSeparator: React.PropTypes.func,
    renderRow: React.PropTypes.func,
    renderText: React.PropTypes.func,
    style: View.propTypes.style,
    optionStyle: View.propTypes.style,
    disabled: PropTypes.bool
};
const defaultProps = {
    options: [],
    selectedOptions: [],
    onSelection(option){},
    style:{},
    optionStyle:{},
    disabled: false
};

class MultipleChoice2 extends BaseComponent {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        this.ds = ds;

        this.state = {
            dataSource: ds.cloneWithRows(this.props.options),
            selectedOptions: this.props.selectedOptions || [],
            disabled: this.props.disabled
        };

        this._bind(
            '_renderRow',
            '_selectOption',
            '_isSelected',
            '_updateSelectedOptions'
        );
    }

    componentWillReceiveProps(nextProps) {
        this._updateSelectedOptions(nextProps.selectedOptions);
        this.setState({
            disabled: nextProps.disabled
        });
    }
    _updateSelectedOptions(selectedOptions) {
        this.setState({
            selectedOptions,
            dataSource: this.ds.cloneWithRows(this.props.options)
        });
    }

    _validateMaxSelectedOptions() {
        const maxSelectedOptions = this.props.maxSelectedOptions;
        const selectedOptions = this.state.selectedOptions;

        if (maxSelectedOptions && selectedOptions.length > 0 && selectedOptions.length >= maxSelectedOptions) {
            selectedOptions.splice(0, 1);
        }

        this._updateSelectedOptions(selectedOptions);
    }

    _selectOption(selectedOption) {

        let selectedOptions = this.state.selectedOptions;
        const index = selectedOptions.indexOf(selectedOption);

        if (index === -1) {
            this._validateMaxSelectedOptions();
            selectedOptions.push(selectedOption);
        } else {
            selectedOptions.splice(index, 1);
        }

        this._updateSelectedOptions(selectedOptions);

        //run callback
        this.props.onSelection(selectedOption);
    }

    _isSelected(option) {
        return this.state.selectedOptions.indexOf(option) !== -1;
    }

    _renderIndicator(option) {
        if (this._isSelected(option)) {
            if(typeof this.props.renderIndicator === 'function') {
                return this.props.renderIndicator(option);
            }

            return (
                <TruliaIcon
                    name="check" color={gui.mainColor} size={20}
                    mainProps={Styles.optionIndicatorIcon}
                />
            );
        }
    }

    _renderSeparator(option) {

        if(typeof this.props.renderSeparator === 'function') {
            return this.props.renderSeparator(option);
        }

        return (<View style={Styles.separator}></View>);
    }

    _renderText(option) {

        if(typeof this.props.renderText === 'function') {
            return this.props.renderText(option);
        }

        if (option != "Khác") {
            return (<Text style={{fontFamily: gui.fontFamily, fontSize: gui.normalFontSize}}>{option}</Text>);
        } else {
            return (<View style={{flexDirection: "column"}}>
                <Text style={{fontFamily: gui.fontFamily, fontSize: gui.normalFontSize}}>{option}</Text>
                <TextInput
                    secureTextEntry={false}
                    placeholder = {"Lý do thông báo..."}
                    style={Styles.input}
                    onFocus={this.props.onTextFocus} />
            </View>);
        }
    }

    _renderRow(option) {

        if(typeof this.props.renderRow === 'function') {
            return this.props.renderRow(option);
        }

        const disabled = this.state.disabled;
        return (

            <View style={this.props.optionStyle}>
                <TouchableOpacity
                    activeOpacity={disabled ? 1 : 0.7}
                    onPress={!disabled ? ()=>{this._selectOption(option)} : null}
                >
                    <View>
                        <View
                            style={Styles.row}
                        >
                            <View style={Styles.optionLabel}>{this._renderText(option)}</View>
                            <View style={Styles.optionIndicator}>{this._renderIndicator(option)}</View>
                        </View>
                    </View>
                </TouchableOpacity>
                {this._renderSeparator(option)}
            </View>
        );
    }

    render() {
        return (
            <ListView
                scrollEnabled={this.props.scrollEnabled}
                style={[Styles.list, this.props.style]}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
            />
        );
    }
};

MultipleChoice2.propTypes = propTypes;
MultipleChoice2.defaultProps = defaultProps;

module.exports = MultipleChoice2;

var Styles = StyleSheet.create({
    list: {},

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    optionLabel: {
        flex: 1
    },

    optionIndicator: {
        width: 40,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },

    optionIndicatorIcon: {
        width: 20,
        height: 20
    },

    separator: {
        height: 1,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: gui.separatorLine
    },

    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        padding: 4,
        paddingRight: 10,
        paddingLeft: 10,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        marginLeft: 0,
        width: Dimensions.get('window').width - 100,
        textAlign: 'left',
        alignSelf: 'center'
    }
});