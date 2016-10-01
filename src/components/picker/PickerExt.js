import React, {Component} from 'react';
import RangeUtils from '../../lib/RangeUtils';
import gui from '../../lib/gui';

var {
    StyleSheet,
    View,
    TextInput,
    Text,
    PickerIOS,
    Dimensions,
    TouchableHighlight
}  = require('react-native');

class PickerExt extends React.Component {
    render() {
        let {pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder, fromValue, toValue, onTextChange,
            pickerSelectedValue, onPickerValueChange, onPress, inputLabel, unitText} = this.props;
        let pickerItems = [];
        pickerRange.map((pickedValue) => {
            let key = pickedValue[0] + '_' + pickedValue[1];
            let label = RangeUtils.getFromToDisplay(
                rangeStepValues.rangeVal2Display(pickedValue), unitText
            );
            pickerItems.push(<PickerIOS.Item key={key}
                                             value={key}
                                             label={label} />);
        });
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={onPress} underlayColor="transparent">
                    <View style={styles.textInputView}>
                        <View style={styles.textInputView1}>
                            <TextInput
                                secureTextEntry={false}
                                keyboardType={'numeric'}
                                style={styles.input}
                                placeholder={fromPlaceholder}
                                value={fromValue}
                                onChangeText={(text) => onTextChange(0, text)}
                            />
                        </View>
                        <View style={styles.textInputView1}>
                            <TextInput
                                secureTextEntry={false}
                                keyboardType={'numeric'}
                                style={styles.input}
                                placeholder={toPlaceholder}
                                value={toValue}
                                onChangeText={(text) => onTextChange(1, text)}
                            />
                            <Text style={styles.label}>{inputLabel}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <PickerIOS selectedValue={pickerSelectedValue}
                           onValueChange={(pickedValue) => onPickerValueChange(pickedValue)}
                           itemStyle={styles.pickerItem}>
                    {pickerItems}
                </PickerIOS>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
    },
    textInputView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width
    },
    textInputView1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width/2-30,
        marginTop: 10
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        paddingLeft: 10,
        marginLeft: 5,
        height: 28,
        borderColor: gui.separatorLine,
        borderWidth: 1,
        borderRadius: 5,
        width: 80,
        textAlign: 'left',
        alignSelf: 'center',
        backgroundColor: 'white'
    },
    label: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        marginLeft: 10
    },
    pickerItem: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily
    }
});

module.exports = PickerExt;