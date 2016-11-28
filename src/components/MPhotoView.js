import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

var _scrollView: ScrollView;

export default class MPhotoView extends Component {


    constructor(props) {
        super(props);
        this.state ={
            scale: 1,
            lastPress: 0
        }
    }

    render() {
        return (
            <ScrollView ref={(scrollView) => { _scrollView = scrollView; }}
                contentContainerStyle={{ alignItems:'center', justifyContent:'center' }}
                centerContent={true}
                maximumZoomScale={this.props.maximumZoomScale}
                minimumZoomScale={this.props.minimumZoomScale}
                zoomScale={this.state.scale}>

                <TouchableWithoutFeedback
                    onPress={this.props.onTap ? this.props.onTap : () => this._onTap()}>

                    <Image {...this.props}/>

                </TouchableWithoutFeedback>

            </ScrollView>
        );
    }

    _onTap() {
        var delta = new Date().getTime() - this.state.lastPress;
        if(delta < 300) {
            // double tap happend
            if (this.state.scale > 1) {
                this.setState({scale: 1});
            } else {
                this.setState({scale: 2});
            }
            _scrollView.scrollTo({x: deviceWidth/2, y: deviceHeight/2});
        }

        this.setState({
            lastPress: new Date().getTime()
        });
    }
}
