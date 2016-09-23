import React, {Component} from 'react';
import RangeUtils from '../../lib/RangeUtils';
import gui from '../../lib/gui';

var {
    StyleSheet,
    View,
    TextInput,
    PickerIOS,
    Dimensions
}  = require('react-native');

class PickerExt extends React.Component {
    render() {
        let {pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder, fromValue, toValue, onTextChange,
            pickerSelectedValue, onPickerValueChange} = this.props;
        let pickerItems = [];
        console.log('pickerRange', pickerRange);
        pickerRange.map((pickedValue) => {
            let key = pickedValue[0] + '_' + pickedValue[1];
            let label = RangeUtils.getFromToDisplay(
                rangeStepValues.rangeVal2Display(pickedValue)
            );
            pickerItems.push(<PickerIOS.Item key={key}
                                             value={key}
                                             label={label} />);
        });
        return (
            <View style={styles.container}>
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
                    </View>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputView: {
        flexDirection: 'row'
    },
    textInputView1: {
        width: Dimensions.get('window').width/2-30,
        marginTop: 10
    },
    input: {
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily,
        paddingLeft: 10,
        marginLeft: 5,
        height: 28,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: 80,
        textAlign: 'left',
        alignSelf: 'center'
    },
    pickerItem: {
        width: Dimensions.get('window').width,
        fontSize: gui.normalFontSize,
        fontFamily: gui.fontFamily
    }
});

module.exports = PickerExt;