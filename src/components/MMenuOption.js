'use strict';

import React from 'react-native';
var {
    Text,
    View,
    StyleSheet,
    Component
} = React;

import TruliaIcon from './TruliaIcon';

import gui from '../lib/gui';

import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

class MMenuOption extends Component {
    _renderIndicator(option) {
        var {isSelected} = this.props;
        if (isSelected) {
            if(typeof this.props.renderIndicator === 'function') {
                return this.props.renderIndicator(option);
            }

            return (
                <TruliaIcon
                    name="check" color={gui.mainColor} size={16}
                    mainProps={Styles.optionIndicatorIcon}
                    noAction={true}
                />
            );
        }
    }

    _renderSeparator() {
        if(typeof this.props.renderSeparator === 'function') {
            return this.props.renderSeparator(option);
        }

        return (<View style={Styles.separator}></View>);
    }

    _renderText(option) {
        if(typeof this.props.renderText === 'function') {
            return this.props.renderText(option);
        }

        return (<Text style={{fontFamily: gui.fontFamily, fontSize: gui.normalFontSize}}>{option}</Text>);
    }

    _renderRow(option, onPress, optionProps) {

        if(typeof this.props.renderRow === 'function') {
            return this.props.renderRow(option);
        }

        return (

            <MenuOption value={option} onPress={onPress} style={[Styles.container, optionProps]}>
                <View>
                    <View
                        style={Styles.row}
                    >
                        <View style={Styles.optionLabel}>{this._renderText(option)}</View>
                        <View style={Styles.optionIndicator}>{this._renderIndicator(option)}</View>
                    </View>
                </View>
                {this._renderSeparator()}
            </MenuOption>
        );
    }

    render() {
        var {text, onPress, optionProps} = this.props;
        return this._renderRow(text, onPress, optionProps);
    }
}

module.exports = MMenuOption;

var Styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    optionLabel: {
        flex: 1
    },

    optionIndicator: {
        width: 40,
        height: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 0
    },

    optionIndicatorIcon: {
        width: 20,
        height: 20
    },

    separator: {
        height: 1,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: gui.separatorLine
    }
});