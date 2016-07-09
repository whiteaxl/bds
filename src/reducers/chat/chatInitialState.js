'use strict';

const {Record} = require('immutable');

const ReactNative = require('react-native');

var testMessages = [
    {
      text: 'https://a.travel-assets.com/mediavault.le/media/b562baf90b3c49f8116dc9164472a8053bf4173a.jpeg',
      name: 'React-Bot',
      //image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},: bug right now with image
      position: 'left',
      date: new Date(2016, 3, 14, 13, 0),
      type: 'image',
      uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
    },
    {
      text: "Yes, and I use Gifted Messenger!",
      name: 'Awesome Developer',
      image: null,
      position: 'right',
      date: new Date(2016, 3, 14, 13, 1),
      uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
    },
  ];

var InitialState = Record({
  partner: {
    fullName: 'Lo Van Ten',
    userID : 'User_1',
    phone: '0980002',
    avatar  : "https://techreviewpro-techreviewpro.netdna-ssl.com/wp-content/uploads//2015/03/Funny-Love-Quote-Best-Whatsapp-Profile-Dp-Profiledp.jpg"
  },
  ads: {
    adsID : "Ads_bds_3989184",
    loaiNhaDatFmt : "",
    giaFmt : "",
    diaChinhFullName : "",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20131125095109163.jpg"
  },

  messages: testMessages,
  isLoadingEarlierMessages: false,
  typingMessage: '',
  allLoaded: false,
});

export default InitialState;

