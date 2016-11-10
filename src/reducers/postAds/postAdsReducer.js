'use strict';

const InitialState = require('./postAdsInitialState').default;

const {
    ON_POST_ADS_FIELD_CHANGE,
    POST_ADS_REQUEST,
    POST_ADS_SUCCESS,
    POST_ADS_FAILURE,
    GET_UPDATE_ADS_REQUEST,
    GET_UPDATE_ADS_SUCCESS,
    GET_UPDATE_ADS_FAILURE,
    POST_ADS_GET_DIACHINH_REQUEST,
    POST_ADS_GET_DIACHINH_SUCCESS,
    POST_ADS_GET_DIACHINH_FAILURE

} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function postAdsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_POST_ADS_FIELD_CHANGE: {
      const {field, value} = action.payload;
      let nextState =  state.set(field, value)
          .set('error', null);
      return nextState;
    }

    case POST_ADS_REQUEST:{
      return state.set('uploading', true);
    }

    case POST_ADS_SUCCESS:{
      let nextState =  state.set('error', null)
          .set('uploading', false);
      return nextState;
    }
    case POST_ADS_FAILURE:
      return state.set('error', action.payload)
          .set('uploading', false);

    case POST_ADS_GET_DIACHINH_REQUEST:
    case POST_ADS_GET_DIACHINH_FAILURE:
    case POST_ADS_GET_DIACHINH_SUCCESS: {
      let selectedDiaChinh = action.payload.diaChinh;
      let duAnList = action.payload.duAn;
      let nextState = state.set('selectedDiaChinh', selectedDiaChinh)
          .set('duAnList', duAnList);
      return nextState;
    }

    case GET_UPDATE_ADS_SUCCESS: {
      let ads = action.payload;

      let photos = [];
      if (ads.image){
        if (ads.image.cover && ads.image.cover.length >0 )
          photos.push({uri: ads.image.cover});
        if (ads.image.images && ads.image.images.length >0) {
          ads.image.images.map( (e) => photos.push({uri:e}));
        }
      }
      let nextState = state.set('id', ads.id)
          .set('maSo', ads.maSo)
          .set('loaiTin', ads.loaiTin==0 ? 'ban' : 'thue')
          .set('loaiNhaDat', ads.loaiNhaDat)
          .set('dienTich', ads.dienTich)
          .set('matTien', ads.matTien)
          .set('namXayDung', ads.namXayDung)
          .set('soPhongNguSelectedIdx', ads.soPhongNgu ? ads.soPhongNgu - 1 : -1)
          .set('soPhongNguText', ads.soPhongNgu||'')
          .set('soNhaTamSelectedIdx', ads.soPhongTam ? ads.soPhongTam - 1 : -1)
          .set('soNhaTamText', ads.soPhongTam||'')
          .set('soTangSelectedIdx', ads.soTang ? ads.soTang - 1 : -1)
          .set('soTangText', ads.soTang||'')
          .set('place', ads.place)
          .set('photos', photos)
          .set('lienHe', ads.lienHe||undefined)
          .set('dangBoi', ads.dangBoi||undefined)
          .set('huongNha', ads.huongNha||-1)
          .set('duongTruocNha', ads.duongTruocNha||null)
          .set('nhaMoiXay', ads.nhaMoiXay||false)
          .set('nhaLoGoc', ads.nhaLoGoc||false)
          .set('otoDoCua', ads.otoDoCua||false)
          .set('nhaKinhDoanhDuoc', ads.nhaKinhDoanhDuoc||false)
          .set('noiThatDayDu', ads.noiThatDayDu||false)
          .set('chinhChuDangTin', ads.chinhChuDangTin||false)
          .set('gia', ads.gia||-1)
          .set('chiTiet', ads.chiTiet||undefined)
          ;
      return nextState;
    }
  }

  return state;
}
