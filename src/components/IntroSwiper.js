'use strict';
import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import Swiper from 'react-native-swiper';


export default class IntroSwiper extends React.Component {
  render() {
    return (
      <Swiper style={styles.wrapper} showsButtons={false} //autoplay={true} autoplayTimeout={5}
              dot={<View style={[styles.dot, {backgroundColor: 'transparent'}]} />}
              activeDot={<View style={[styles.dot, {backgroundColor: 'transparent'}]}/>}
      >
        <View style={styles.slide} title={
          <Text style={styles.text} numberOfLines={2}></Text>}
        >
          <Image
            style={styles.image} resizeMode = {'cover'}
            source={require('../assets/image/welcome/welcome.png')}
          />
        </View>

        {/*<View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}></Text>}>
          <Image
            style={styles.image}
            source={require('../assets/image/welcome/welcome.png')}
          />
        </View>
        <View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}></Text>}>
          <Image
            style={styles.image}
            source={require('../assets/image/welcome/welcome.png')}
          />
        </View>
        <View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}></Text>}>
          <Image
            style={styles.image}
            resizeMode={Image.resizeMode.cover}
            source={require('../assets/image/welcome/welcome.png')}
          />
        </View>*/}

      </Swiper>
    );
  }
}


var styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    //
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    top: -250,
    alignSelf:'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    marginTop: 0
  },
  dot : {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    bottom: 110
  },
});
