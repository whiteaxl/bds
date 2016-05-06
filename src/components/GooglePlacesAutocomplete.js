const React = require('react-native');
const {TextInput, View, ListView, Image, Text, Dimensions, TouchableHighlight, TouchableWithoutFeedback, Platform, ActivityIndicatorIOS, ProgressBarAndroid} = React;
const Qs = require('qs');

import placeUtil from "../lib/PlaceUtil";


var gui = require("../lib/gui");
import Icon from 'react-native-vector-icons/FontAwesome';

import TruliaIcon from './TruliaIcon';

import RelandIcon from './RelandIcon';

const defaultStyles = {
    container: {
        flex: 1,
    },
    textInputContainer: {
        backgroundColor: 'white',
        height: 44,
        borderTopColor: 'white',
        borderBottomColor: 'white',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputView: {
        backgroundColor: '#1396E0',
        height: 28,
        borderRadius: 5,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 15,
        marginRight: 8,
        flex: 1,
        flexDirection: 'row'
    },
    textInput: {
        backgroundColor: '#1396E0',
        color: 'white',
        fontSize: 15,
        flex: 1
    },
    cancel: {
        fontSize: 15,
        color: '#1396E0',
        paddingRight: 15,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        height: 28
    },
    poweredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    powered: {
        marginTop: 15,
    },
    listView: {
        // flex: 1,
    },
    row: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#E9E9E9',
    },
    description: {},
    loader: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
};

const GooglePlacesAutocomplete = React.createClass({

    propTypes: {
        placeholder: React.PropTypes.string,
        onPress: React.PropTypes.func,
        minLength: React.PropTypes.number,
        fetchDetails: React.PropTypes.bool,
        autoFocus: React.PropTypes.bool,
        getDefaultValue: React.PropTypes.func,
        timeout: React.PropTypes.number,
        onTimeout: React.PropTypes.func,
        query: React.PropTypes.object,
        GoogleReverseGeocodingQuery: React.PropTypes.object,
        GooglePlacesSearchQuery: React.PropTypes.object,
        styles: React.PropTypes.object,
        textInputProps: React.PropTypes.object,
        enablePoweredByContainer: React.PropTypes.bool,
        predefinedPlaces: React.PropTypes.array,
        currentLocation: React.PropTypes.bool,
        currentLocationLabel: React.PropTypes.string,
        nearbyPlacesAPI: React.PropTypes.string,
        filterReverseGeocodingByTypes: React.PropTypes.array,
        predefinedPlacesAlwaysVisible: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            placeholder: 'Tìm kiếm',
            onPress: () => {
            },
            minLength: 0,
            fetchDetails: false,
            autoFocus: false,
            getDefaultValue: () => '',
            timeout: 20000,
            onTimeout: () => console.warn('google places autocomplete: request timeout'),
            query: {
                key: 'missing api key',
                language: 'en',
                types: 'geocode',
            },
            GoogleReverseGeocodingQuery: {},
            GooglePlacesSearchQuery: {
                rankby: 'distance',
                types: 'food',
            },
            styles: {},
            textInputProps: {},
            enablePoweredByContainer: true,
            predefinedPlaces: [],
            currentLocation: false,
            currentLocationLabel: 'Current location',
            nearbyPlacesAPI: 'GooglePlacesSearch',
            filterReverseGeocodingByTypes: [],
            predefinedPlacesAlwaysVisible: false,
        };
    },

    getInitialState() {
        const ds = new ListView.DataSource({
            rowHasChanged: function rowHasChanged(r1, r2) {
                if (typeof r1.isLoading !== 'undefined') {
                    return true;
                }
                return r1 !== r2;
            }
        });
        return {
            text: this.props.getDefaultValue(),
            dataSource: ds.cloneWithRows(this.buildRowsFromResults([])),
            listViewDisplayed: false,
        };
    },

    buildRowsFromResults(results) {
        var res = null;

        if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
            res = [...this.props.predefinedPlaces];
            if (this.props.currentLocation === true) {
                res.unshift({
                    description: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        } else {
            res = [];
        }

        res = res.map(function (place) {
            return {
                ...place,
                isPredefinedPlace: true,
            }
        });

        return [...res, ...results];
    },

    componentWillUnmount() {
        this._abortRequests();
    },

    componentDidMount() {
        this.triggerFocus();
    },

    _abortRequests() {
        for (let i = 0; i < this._requests.length; i++) {
            this._requests[i].abort();
        }
        this._requests = [];
    },

    /**
     * This method is exposed to parent components to focus on textInput manually.
     * @public
     */
    triggerFocus() {
        if (this.refs.textInput) this.refs.textInput.focus();
    },

    /**
     * This method is exposed to parent components to blur textInput manually.
     * @public
     */
    triggerBlur() {
        if (this.refs.textInput) this.refs.textInput.blur();
    },

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                //this._requestNearby(position.coords.latitude, position.coords.longitude);
                let data = {
                    name: "Current Location",
                    fullName: "Current Location",
                    currentLocation : {
                        "lat": position.coords.latitude,
                        "lon": position.coords.longitude
                    }
                };
                this.props.onPress(data, null);
            },
            (error) => {
                this._disableRowLoaders();
                alert(error.message);
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    },

    _enableRowLoader(rowData) {

        let rows = this.buildRowsFromResults(this._results);
        for (let i = 0; i < rows.length; i++) {
            if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
                rows[i].isLoading = true;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rows),
                });
                break;
            }
        }
    },
    _disableRowLoaders() {
        if (this.isMounted()) {
            for (let i = 0; i < this._results.length; i++) {
                if (this._results[i].isLoading === true) {
                    this._results[i].isLoading = false;
                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(this._results)),
            });
        }
    },
    _rewayDesc(desc) {
        return desc ? desc.replace(", Vietnam", "") : "";
    },
    _onPress(rowData) {

        rowData.fullName = this._rewayDesc(rowData.description);

        this.setState({
            text:rowData.fullName
        });

        
        if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
            if (rowData.isLoading === true) {
                // already requesting
                return;
            }

            this._abortRequests();

            // display loader
            this._enableRowLoader(rowData);

            console.log("Call FETCH DETAIL");

            // fetch details
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (responseJSON.status === 'OK') {

                        if (this.isMounted()) {
                            const details = responseJSON.result;

                            this._disableRowLoaders();
                            this._onBlur();

                            details.relandTypeName = rowData.relandTypeName;


                            this.setState({
                                text: this._rewayDesc(rowData.description)
                            });

                            delete rowData.isLoading;
                            //
                            details.formatted_address = this._rewayDesc(details.formatted_address);
                            this.props.onPress(rowData, details);
                        }
                    } else {
                        this._disableRowLoaders();
                        console.warn('google places autocomplete: ' + responseJSON.status);
                    }
                } else {
                    this._disableRowLoaders();
                    console.warn('google places autocomplete: request could not be completed or has been aborted');
                }
            };

            console.log("Detail for: " + rowData.place_id);

            /*
            url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                    //latlng: rowData + ',' + longitude,
                    place_id: rowData.place_id,
                    key: this.props.query.key
                    //...this.props.GoogleReverseGeocodingQuery,
                });
                */

            let url = 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
                    key: this.props.query.key,
                    placeid: rowData.place_id,
                    language: this.props.query.language
                });

            request.open('GET', url);

                request.send();
        } else if (rowData.isCurrentLocation === true) {

            // display loader
            this._enableRowLoader(rowData);


            this.setState({
                text: rowData.description,
            });
            this.triggerBlur(); // hide keyboard but not the results

            delete rowData.isLoading;

            this.getCurrentLocation();

        } else {
            this.setState({
                text: rowData.description,
            });

            this._onBlur();

            delete rowData.isLoading;

            let predefinedPlace = this._getPredefinedPlace(rowData);

            // sending predefinedPlace as details for predefined places
            this.props.onPress(predefinedPlace, predefinedPlace);
        }
    },
    _results: [],
    _requests: [],

    _getPredefinedPlace(rowData) {
        if (rowData.isPredefinedPlace !== true) {
            return rowData;
        }
        for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
            if (this.props.predefinedPlaces[i].description === rowData.description) {
                return this.props.predefinedPlaces[i];
            }
        }
        return rowData;
    },

    _filterResultsByTypes(responseJSON, types) {
        if (types.length === 0) return responseJSON.results;

        var results = [];
        for (let i = 0; i < responseJSON.results.length; i++) {
            let found = false;
            for (let j = 0; j < types.length; j++) {
                if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }
            if (found === true) {
                results.push(responseJSON.results[i]);
            }
        }
        return results;
    },


    _requestNearby(latitude, longitude) {
        this._abortRequests();
        if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    this._disableRowLoaders();

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this.isMounted()) {
                            var results = [];
                            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
                            } else {
                                results = responseJSON.results;
                            }

                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(results)),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        console.warn('google places autocomplete: ' + responseJSON.error_message);
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };

            let url = '';


            if (this.props.nearbyPlacesAPI === 'GooglePlacesSearch') {
                url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
                        location: latitude + ',' + longitude,
                        key: this.props.query.key,
                        ...this.props.GooglePlacesSearchQuery,
                    });

            } else {
                // your key must be allowed to use Google Maps Geocoding API
                url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                        latlng: latitude + ',' + longitude,
                        key: this.props.query.key,
                        ...this.props.GoogleReverseGeocodingQuery,
                    });
            }

            request.open('GET', url);
            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
            });
        }
    },


    _request(text) {
        this._abortRequests();
        if (text.length >= this.props.minLength) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.predictions !== 'undefined') {
                        if (this.isMounted()) {
                            this._results = responseJSON.predictions;
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(responseJSON.predictions)),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        console.warn('google places autocomplete: ' + responseJSON.error_message);
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };
            request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input='
                + encodeURI(text) + '&' + Qs.stringify(this.props.query));
            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
            });
        }
    },
    _onChangeText(text) {
        this._request(text);
        this.setState({
            text: text,
            listViewDisplayed: true,
        });
    },

    _getRowLoader() {
        if (Platform.OS === 'android') {
            return (
                <ProgressBarAndroid
                    style={[defaultStyles.androidLoader, this.props.styles.androidLoader]}
                    styleAttr="Inverse"
                />
            );
        }
        return (
            <ActivityIndicatorIOS
                animating={true}
                size="small"
            />
        );
    },

    _renderLoader(rowData) {
        if (rowData.isLoading === true) {
            return (
                <View
                    style={[defaultStyles.loader, this.props.styles.loader]}
                >
                    {this._getRowLoader()}
                </View>
            );
        }
        return null;
    },

    _getPlaceType(place) {
        return placeUtil.getTypeName(place);
    },
    
    _isDiaDiem(place) {
        return placeUtil.isDiaDiem(place);
    },

    _renderRow(rowData = {}) {

        console.log(rowData);

        rowData.description = rowData.description || rowData.formatted_address || rowData.name;

        rowData.relandTypeName = this._getPlaceType(rowData);
        
        var placeIcon = this._isDiaDiem(rowData) ?
            (<RelandIcon name={"location"} size={26} color={'#ACACAC'}
                         mainProps={{flexDirection: 'row'}}
                         iconProps={{style: {marginRight: 0, paddingRight: 4.5}}}
                         textProps={{paddingLeft: 0}}></RelandIcon>) :
            (<TruliaIcon name={"star"} size={18} color={'#DD0006'}></TruliaIcon>);

        return (
            <TouchableHighlight
                onPress={() =>
          this._onPress(rowData)
        }
                underlayColor="#c8c7cc"
            >
                <View>
                    <View style={[defaultStyles.row, this.props.styles.row
          , rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>

                        <View style={{flex:1, flexDirection:'row',alignItems:'center', marginLeft: 25, marginRight: 25}}>
                            {placeIcon}
                            <Text
                                style={[{flex: 1}, defaultStyles.description
              , this.props.styles.description
              , rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
                                numberOfLines={1}
                            >
                                {this._rewayDesc(rowData.description)}
                            </Text>
                            <Text style={{alignSelf: 'flex-end'}}>
                                {rowData.relandTypeName}
                            </Text>
                        </View>

                        {this._renderLoader(rowData)}
                    </View>
                </View>
            </TouchableHighlight>
        );
    },

    _renderSeparator(sectionID, rowID, isLastRow) {
        var separatorStypeExt = isLastRow ? {marginLeft: 10} : {marginLeft: 54};
        return (
            <View key={`${sectionID}-${rowID}`} style={[defaultStyles.separator, this.props.styles.separator, separatorStypeExt]} />
        );
    },

    _onBlur() {
        this.triggerBlur();
        this.setState({listViewDisplayed: false});
    },

    _onFocus() {
        this.setState({listViewDisplayed: true});
    },

    _getListView() {
        if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
            return (
                <ListView
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode="on-drag"
                    style={[defaultStyles.listView, this.props.styles.listView]}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={(sectionID, rowID) => this._renderSeparator(sectionID, rowID, (rowID == (this.state.dataSource._dataBlob.s1.length-1)))}
                    automaticallyAdjustContentInsets={false}

                    {...this.props}
                />
            );
        }

        if (this.props.enablePoweredByContainer) {
            return (
                <View
                    style={[defaultStyles.poweredContainer, this.props.styles.poweredContainer]}
                >
                    <Image
                        style={[defaultStyles.powered, this.props.styles.powered]}
                        resizeMode={Image.resizeMode.contain}
                        source={require('../assets/image/powered_by_google_on_white.png')}
                    />
                </View>
            );
        }

        return null;
    },
    render() {
        let {onChangeText, onFocus, ...userProps} = this.props.textInputProps;
        return (
            <View
                style={[defaultStyles.container, this.props.styles.container]}
            >
                <View
                    style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
                >
                    <View style={defaultStyles.inputView}>
                        <TruliaIcon name="search" size={14} color={'white'}
                            mainProps={{marginRight: 5}}></TruliaIcon>
                        <TextInput
                            { ...userProps }
                            ref="textInput"
                            autoFocus={this.props.autoFocus}
                            style={[defaultStyles.textInput, this.props.styles.textInput]}
                            onChangeText={onChangeText ? text => {this._onChangeText(text); onChangeText(text)} : this._onChangeText}
                            value={this.state.text}
                            placeholder={this.props.placeholder}
                            onFocus={onFocus ? () => {this._onFocus(); onFocus()} : this._onFocus}
                            clearButtonMode="while-editing"
                        />
                    </View>

                    <TouchableHighlight underlayColor="transparent" onPress={this.props.onCancelPress}>
                        <Text style={defaultStyles.cancel}>
                            Thoát
                        </Text>
                    </TouchableHighlight>

                </View>
                <View style={[defaultStyles.separator, this.props.styles.separator]}/>
                {this._getListView()}
            </View>
        );
    },
});


// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
    return React.createClass({
        render() {
            return (
                <GooglePlacesAutocomplete ref="GooglePlacesAutocomplete"
                    {...options}
                />
            );
        },
    });
};


module.exports = {GooglePlacesAutocomplete, create};