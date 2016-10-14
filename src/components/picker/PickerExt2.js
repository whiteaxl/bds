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
        let {pickerRange, val2Display, inputPlaceholder, inputValue, onTextChange, onTextFocus,
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
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChangeText={(text) => onTextChange(text)}
                            onFocus={() => onTextFocus()}
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
        width: Dimensions.get('window').width-40,
        marginTop: 10,
        marginLeft: 40
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
        fontFamily: gui.fontFamily,
        height: 180
    }
});

module.exports = PickerExt2;