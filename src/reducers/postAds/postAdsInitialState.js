'use strict';

const {Record} = require('immutable');

const InitialState = Record({
    photos: [{uri: ''},{uri: ''},{uri: ''},{uri: ''}],
    loaiTin: 'ban',
    loaiNhaDat: '',
    dienTich: null,
    matTien: null,
    namXayDung: null,
    soPhongNguSelectedIdx: -1,
    soPhongNguText: '',
    soNhaTamSelectedIdx : -1,
    soNhaTamText : '',
    soTangSelectedIdx: -1,
    soTangText: '',
    place: {
        duAn: '',
        duAnFullName: '',
        placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
        diaChi: '',
        diaChiFullName: "Hà Nội",
        diaChinh: {
            tinh: 'Hà Nội',
            huyen: '',
            xa: '',
            tinhKhongDau: 'ha-noi',
            huyenKhongDau: '',
            xaKhongDau: ''
        },
        geo: {lat: '', lon: ''}
    },
    lienHe: {
        tenLienLac: null,
        showTenLienLac: false,
        phone: null,
        showPhone: false,
        email: null,
        showEmail: false
    },
    huongNha: null,
    duongTruocNha: null,
    nhaMoiXay: null,
    nhaLoGoc: null,
    otoDoCua: null,
    nhaKinhDoanhDuoc: null,
    noiThatDayDu: null,
    chinhChuDangTin: null,
    gia: null,
    donViTien: 1,
    chiTiet: '',
    error: '',
    selectedDiaChinh: null,
    selectedDuAn: null,
    duAnList: null
});

export default InitialState;
