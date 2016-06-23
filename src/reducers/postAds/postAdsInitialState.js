'use strict';

const {Record} = require('immutable');

const InitialState = Record({
    photos: [{uri: ''},{uri: ''},{uri: ''},{uri: ''}],
    loaiTin: 'ban',
    loaiNhaDat: '',
    soPhongNguSelectedIdx: 0,
    soTangSelectedIdx: 0,
    soNhaTamSelectedIdx : 0,
    dienTich: null,
    gia: null,
    place: {
        placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
        relandTypeName : "Tỉnh",
        fullName: "Hanoi",
        currentLocation : '',
        diaChi: '',
        geo: {lat: '', lon: ''}
    },
    chiTiet: '',
    error: ''
});

export default InitialState;
