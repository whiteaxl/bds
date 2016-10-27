import React, {Component} from 'react';
import {
    CameraRoll,
    Platform,
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator,
} from 'react-native';
import ImageItem from './ImageItem';

class CameraRollPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            selected: this.props.selected,
            lastCursor: null,
            loadingMore: false,
            noMore: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }

    componentWillMount() {
        this.fetch();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected,
        });
    }

    fetch() {
        if (!this.state.loadingMore) {
            this.setState({loadingMore: true}, () => { this._fetch(); });
        }
    }

    _fetch() {
        var {groupTypes, assetType} = this.props;

        var fetchParams = {
            first: 1000,
            groupTypes: groupTypes,
            assetType: assetType,
        };

        if (Platform.OS === "android") {
            // not supported in android
            delete fetchParams.groupTypes;
        }

        if (this.state.lastCursor) {
            fetchParams.after = this.state.lastCursor;
        }

        CameraRoll.getPhotos(fetchParams)
            .then((data) => this._appendImages(data), (e) => console.log(e));
    }

    _appendImages(data) {
        var assets = data.edges;
        var newState = {
            loadingMore: false,
        };

        if (!data.page_info.has_next_page) {
            newState.noMore = true;
        }

        if (assets.length > 0) {
            newState.lastCursor = data.page_info.end_cursor;
            newState.images = this.state.images.concat(assets);
            newState.dataSource = this.state.dataSource.cloneWithRows(
                this._nEveryRow(newState.images, this.props.imagesPerRow)
            );
        }

        this.setState(newState);
    }

    render() {
        var {dataSource} = this.state;
        var {
            scrollRenderAheadDistance,
            initialListSize,
            pageSize,
            removeClippedSubviews,
            imageMargin,
            backgroundColor,
            emptyText,
            emptyTextStyle,
        } = this.props;

        var listViewOrEmptyText = dataSource.getRowCount() > 0 ? (
            <ListView
                style={{flex: 1,}}
                scrollRenderAheadDistance={scrollRenderAheadDistance}
                initialListSize={initialListSize}
                pageSize={pageSize}
                removeClippedSubviews={removeClippedSubviews}
                renderFooter={this._renderFooterSpinner.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                dataSource={dataSource}
                renderRow={rowData => this._renderRow(rowData)} />
        ) : (
            <Text style={[{textAlign: 'center'}, emptyTextStyle]}>{emptyText}</Text>
        );

        return (
            <View
                style={[styles.wrapper, {padding: imageMargin, paddingRight: 0, backgroundColor: backgroundColor},]}>
                {listViewOrEmptyText}
            </View>
        );
    }

    _renderImage(item) {
        var {selected} = this.state;
        var {
            imageMargin,
            selectedMarker,
            imagesPerRow,
            containerWidth
        } = this.props;
        var uri = item.node.image.uri;
        var isSelected = (this._arrayObjectIndexOf(selected, 'uri', uri) >= 0) ? true : false;

        return (
            <ImageItem
                key={uri}
                item={item}
                selected={isSelected}
                imageMargin={imageMargin}
                selectedMarker={selectedMarker}
                imagesPerRow={imagesPerRow}
                containerWidth={containerWidth}
                onClick={this._selectImage.bind(this)}
            />
        );
    }

    _renderRow(rowData) {
        var items = rowData.map((item) => {
            if (item === null) {
                return null;
            }
            return this._renderImage(item);
        });

        return (
            <View style={styles.row}>
                {items}
            </View>
        );
    }

    _renderFooterSpinner() {
        if (!this.state.noMore) {
            return <ActivityIndicator style={styles.spinner} />;
        }
        return null;
    }

    _onEndReached() {
        if (!this.state.noMore) {
            this.fetch();
        }
    }

    _selectImage(image) {
        var {maximum, imagesPerRow, callback} = this.props;

        var selected = this.state.selected,
            index = this._arrayObjectIndexOf(selected, 'uri', image.image.uri);
        
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            if (selected.length < maximum) {
                selected.push(image);
            }
        }

        this.setState({
            selected: selected,
            dataSource: this.state.dataSource.cloneWithRows(
                this._nEveryRow(this.state.images, imagesPerRow)
            ),
        });

        callback(this.state.selected, image);
    }

    _nEveryRow(data, n) {
        var result = [],
            temp = [];

        for (var i = 0; i < data.length; ++i) {
            if (i > 0 && i % n === 0) {
                result.push(temp);
                temp = [];
            }
            temp.push(data[i]);
        }

        if (temp.length > 0) {
            while (temp.length !== n) {
                temp.push(null);
            }
            result.push(temp);
        }

        return result;
    }

    _arrayObjectIndexOf(array, property, value) {
        return array.map((o) => { return o.image[property]; }).indexOf(value);
    }

}

const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
    },
    row:{
        flexDirection: 'row',
        flex: 1,
    },
    marker: {
        position: 'absolute',
        top: 5,
        backgroundColor: 'transparent',
    },
})

CameraRollPicker.propTypes = {
    scrollRenderAheadDistance: React.PropTypes.number,
    initialListSize: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    removeClippedSubviews: React.PropTypes.bool,
    groupTypes: React.PropTypes.oneOf([
        'Album',
        'All',
        'Event',
        'Faces',
        'Library',
        'PhotoStream',
        'SavedPhotos',
    ]),
    maximum: React.PropTypes.number,
    assetType: React.PropTypes.oneOf([
        'Photos',
        'Videos',
        'All',
    ]),
    imagesPerRow: React.PropTypes.number,
    imageMargin: React.PropTypes.number,
    containerWidth: React.PropTypes.number,
    callback: React.PropTypes.func,
    selected: React.PropTypes.array,
    selectedMarker: React.PropTypes.element,
    backgroundColor: React.PropTypes.string,
    emptyText: React.PropTypes.string,
    emptyTextStyle: Text.propTypes.style,
}

CameraRollPicker.defaultProps = {
    scrollRenderAheadDistance: 500,
    initialListSize: 1,
    pageSize: 3,
    removeClippedSubviews: true,
    groupTypes: 'SavedPhotos',
    maximum: 15,
    imagesPerRow: 3,
    imageMargin: 5,
    assetType: 'Photos',
    backgroundColor: 'white',
    selected: [],
    callback: function(selectedImages, currentImage) {
        console.log(currentImage);
        console.log(selectedImages);
    },
    emptyText: 'No photos.',
}

export default CameraRollPicker;
