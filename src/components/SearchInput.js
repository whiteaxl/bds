'use strict';

import Autocomplete from 'react-native-autocomplete-input';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API = 'http://swapi.co/api';
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      query: '',
    };
  }

  _findFilm(query) {
    if (query === '') {
      return [];
    }

    const { films } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return films.filter(film => film.title.search(regex) >= 0);
  }

  componentDidMount() {
    fetch(`${API}/films/`).then(res => res.json()).then(json => {
      const { results: films } = json;
      this.setState({films});
    });
  }

  _renderFilm(films) {


    if (films.length > 0) {
      const { title, director, opening_crawl, episode_id} = films[0];
      const roman = episode_id < ROMAN.length ? ROMAN[episode_id] : episode_id;
      return (
        <View style={styles.info}>
          <Text style={styles.titleText}>{roman}. {title}</Text>
          <Text style={styles.directorText}>({director})</Text>
          <Text style={styles.openingText}>{opening_crawl}</Text>
        </View>
      );
    }

    return (
      <View style={styles.info}>
        <Text style={styles.infoText}>Enter Title of a Star Wars movie</Text>
      </View>
    );
  }
  _onClear() {

  }

  render() {
    const { query } = this.state;
    const films = this._findFilm(query);
    const comp = (s, s2) => s.toLowerCase().trim() === s2.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <Autocomplete
          style = {styles.textInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode={'always'}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle = {styles.inputContainerStyle}
          data={films.length === 1 && comp(query, films[0].title) ? [] : films}
          defaultValue={query}
          onChangeText={text => this.setState({query: text})}
          placeholder="Nhập tên dự án/đường/xã/huyện..."
          renderItem={({title, release_date}) => (
            <TouchableOpacity onPress={() => this.setState({query: title})}>
              <Text style={styles.itemText}>
                {title} ({release_date.split('-')[0]})
              </Text>
            </TouchableOpacity>
          )}
        />
       
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    top: 0,
    position: 'absolute',
    left:0, 
    right:0, 
  },
  textInput : {
    fontSize: 15, 
    height: 30, 
    borderRadius: 5
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 15, 

  },
  inputContainerStyle: {
    borderRadius:5
  },

  itemText: {
    fontSize: 15,
    margin: 2
  },
  info: {
    paddingTop: 60,
    flex:4,
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  openingText: {
    textAlign: 'center'
  }
});
