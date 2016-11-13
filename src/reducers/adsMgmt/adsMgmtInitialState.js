'use strict';

const {Record, List} = require('immutable');

var Package = Record({
  lengthName : '0 ngày',
  startDateTime : 0,
  levelName : 'Chưa có' //cao cap....
});

var InitialState = new Record({
  likedList :[],
  sellList :[],
  rentList :[],
  activeTab : 0,
  errorMsg:'',
  refreshing : false, //refresh when scroll down
  deletingAds: false,

  package : new (Record({
    current_goiViTri : "Chưa có",
    current_goiTrangChu : "Chưa có",
    current_goiLogo : "Chưa có",

    adsID : null,

    goiViTri : new Package,
    goiTrangChu : new Package,
    goiLogo : new Package,

    packageSelected : "" //same name of properties: goiViTri, goiTrangChu, goiLogo
  }))
});

export default InitialState;

