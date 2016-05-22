'use strict';

var React = require('react');

var {
    View,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform
} = require('react-native');

export default class GiftedSpinner extends React.Component {

    _getSpinner() {
        if (Platform.OS === 'android') {
            return (
                <ProgressBarAndroid
                    style={{
            height: 20,
          }}
                    styleAttr="Inverse"
                    {...this.props}
                />
            );
        } else {
            return (
                <ActivityIndicatorIOS
                    animating={true}
                    size="small"
                    {...this.props}
                />
            );
        }
    }

    render() {
        return (
            <View>
                {this._getSpinner()}
            </View>
        );
    }

};
