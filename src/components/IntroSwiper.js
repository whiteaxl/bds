import React, {
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
              dot={<View style={[styles.dot, {backgroundColor: 'white'}]} />}
              activeDot={<View style={[styles.dot, {backgroundColor: 'red'}]}/>}
      >
        <View style={styles.slide} title={
          <Text style={styles.text} numberOfLines={2}>Intro one</Text>}
        >
          <Image style={styles.image} source={{uri: 'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg'}} />
        </View>

        <View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}>Introduction two</Text>}>
          <Image style={styles.image} source={{uri: 'http://a.hiphotos.baidu.com/image/w%3D310/sign=4459912736a85edffa8cf822795509d8/bba1cd11728b4710417a05bbc1cec3fdfc032374.jpg'}} />
        </View>
        <View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}>Third</Text>}>
          <Image style={styles.image} source={{uri: 'http://e.hiphotos.baidu.com/image/w%3D310/sign=9a8b4d497ed98d1076d40a30113eb807/0823dd54564e9258655f5d5b9e82d158ccbf4e18.jpg'}} />
        </View>
        <View style={styles.slide}
          title={<Text style={styles.text} numberOfLines={1}>Forth</Text>}>
          <Image style={styles.image} source={{uri: 'http://e.hiphotos.baidu.com/image/w%3D310/sign=2da0245f79ec54e741ec1c1f89399bfd/9d82d158ccbf6c818c958589be3eb13533fa4034.jpg'}} />
        </View>

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
    bottom: 160
  },
});
