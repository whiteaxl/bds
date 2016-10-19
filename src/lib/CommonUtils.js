//

const imageItems = [
  // require('../assets/image/default_cover/no_cover_01.jpg'),
  // require('../assets/image/default_cover/no_cover_02.jpg'),
  require('../assets/image/default_cover/no_cover_03.jpg'),
  // require('../assets/image/default_cover/no_cover_04.jpg'),
  // require('../assets/image/default_cover/no_cover_05.jpg'),
  // require('../assets/image/default_cover/no_cover_06.jpg'),
  // require('../assets/image/default_cover/no_cover_07.jpg'),
  // require('../assets/image/default_cover/no_cover_08.jpg'),
  // require('../assets/image/default_cover/no_cover_09.jpg'),
  // require('../assets/image/default_cover/no_cover_10.jpg')
];

var CommonUtils = {
  getKeyOfMap: function(hash, value) {
    for(var key in hash){
    	if(hash[key]==value)
    		return key;
    }
    return null;
  },

  getNoCoverImage: function () {
    // var imageId = Math.floor((Math.random() * 10));
    // return imageItems[imageId];
    return imageItems[0];
  }
};

export { CommonUtils as default };
