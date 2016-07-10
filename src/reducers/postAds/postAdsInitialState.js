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
    donViTien: 1,
    place: {
        duAn: '',
        duAnFullName: '',
        placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
        diaChi: '',
        diaChiFullName: "Hanoi",
        diaChinh: {
            tinh: 'Hanoi',
            huyen: '',
            xa: '',
            tinhKhongDau: 'Hanoi',
            huyenKhongDau: '',
            xaKhongDau: ''
        },
        geo: {lat: '', lon: ''}
    },
    chiTiet: '',
    error: ''
});

export default InitialState;
