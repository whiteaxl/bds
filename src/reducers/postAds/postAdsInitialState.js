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
        diaChiChiTiet: '',
        diaChi: '',
        diaChinh: {
            tinh: 'Hanoi',
            huyen: '',
            xa: '',
            duAn: '',
            tinhKhongDau: 'Hanoi',
            huyenKhongDau: '',
            xaKhongDau: '',
            codeTinh: '',
            codeHuyen: '',
            codeXa: '',
            codeDuAn: ''
        },
        geo: {lat: null, lon: null}
    },
    lienHe: {
        tenLienLac: null,
        showTenLienLac: false,
        phone: null,
        showPhone: false,
        email: null,
        showEmail: false
    },
    dangBoi: {
        userID: undefined,
        email: null,
        phone: null,
        name: null
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
    id: null,
    maSo: null,
    error: '',
    uploading: false,
    loadingUpdateAds: false,
    selectedDiaChinh: null,
    selectedDuAn: null,
    duAnList: null
});

export default InitialState;
