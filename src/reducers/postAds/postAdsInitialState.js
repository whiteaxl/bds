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
            tinhKhongDau: 'ha-noi',
            huyenKhongDau: '',
            xaKhongDau: '',
            codeTinh: 'HN',
            codeHuyen: '',
            codeXa: '',
            codeDuAn: ''
        },
        geo: {lat: null, lon: null}
    },
    lienHe: {
        tenLienLac: null,
        showTenLienLac: true,
        phone: null,
        showPhone: true,
        email: null,
        showEmail: true
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
    loadingDiaChinh: false,
    selectedDiaChinh: null,
    selectedDuAn: null,
    duAnList: null
});

export default InitialState;
