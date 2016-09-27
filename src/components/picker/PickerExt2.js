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

class PickerExt2 extends React.Component {
    render() {
        let {pickerRange, val2Display, fromPlaceholder, toPlaceholder, fromValue, toValue, onTextChange,
            pickerSelectedValue, onPickerValueChange, onPress, inputLabel} = this.props;
        let pickerItems = [];
        pickerRange.map((pickedValue) => {
            let key = pickedValue;
            let label = val2Display(pickedValue);
            pickerItems.push(<PickerIOS.Item key={key}
                                             value={key}
                                             label={label} />);
        });
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={onPress} underlayColor="transparent">
                    <View style={styles.textInputView}>
                        <TextInput
                            secureTextEntry={false}
                            keyboardType={'numeric'}
                            style={styles.input}
                            placeholder={toPlaceholder}
                            value={toValue}
                            onChangeText={(text) => onTextChange(text)}
                        />
                        <Text style={styles.label}>{inputLabel}</Text>
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
        width: Dimensions.get('window').width,
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
        backgroundColor: '#f8f8f8'
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

module.exports = PickerExt2;