import moment from 'moment';

var danhMuc = {};

danhMuc.BAT_KY = "Bất kỳ";
danhMuc.BIG =9999999;
danhMuc.CHUA_XAC_DINH = "Chưa xác định";
danhMuc.THOA_THUAN = "Thỏa thuận";

var {BAT_KY, BIG, THOA_THUAN, CHUA_XAC_DINH} = danhMuc;

danhMuc.sellStepValues = [-1, 0, 500, 800, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000]; //trieu

danhMuc.rentStepValues = [-1, 0, 1, 3, 5, 10, 40, 70, 100]; //by month

danhMuc.dienTichStepValues = [-1, 0, 30, 50, 80, 100, 150, 200, 250, 300, 500];

danhMuc.loaiTin = {
    0 : "Bán",
    1  : "Cho Thuê"
};

danhMuc.LoaiNhaDatBan = {
    0 : BAT_KY,
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán biệt thự, liền kề",
    4  : "Bán nhà mặt phố",
    5  : "Bán đất nền dự án",
    6  : "Bán đất",
    7  : "Bán trang trại, khu nghỉ dưỡng",
    8  : "Bán kho, nhà xưởng",
    99 : "Bán loại bất động sản khác"
}

danhMuc.LoaiNhaDatThue = {
    0 : BAT_KY,
    1 : "Cho Thuê căn hộ chung cư",
    2 : "Cho Thuê nhà riêng",
    3 : "Cho Thuê nhà mặt phố",
    4 : "Cho thuê nhà trọ, phòng trọ",
    5 : "Cho Thuê văn phòng",
    6 : "Cho Thuê cửa hàng, ki-ốt",
    7 : "Cho thuê kho, nhà xưởng, đất",
    99: "Cho Thuê loại bất động sản khác"
}

danhMuc.LoaiNhaDatBanKey = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    99
];

danhMuc.LoaiNhaDatThueKey = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    99
];

danhMuc.SoPhongNgu = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.SoTang = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.SoPhongTam = {
    0: BAT_KY,
    1: "1+",
    2: "2+",
    3: "3+",
    4: "4+",
    5: "5+"
}

danhMuc.AdsSoPhongNgu = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7"
}

danhMuc.AdsSoTang = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7"
}

danhMuc.AdsSoPhongTam = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7"
}

danhMuc.RadiusInKm = {
    0.5: "0.5",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5"
}

danhMuc.RadiusInKmKey = [
    0.5,
    1,
    2,
    3,
    4,
    5
]

danhMuc.NgayDaDang = {
    0: BAT_KY,
    1: "1 ngày",
    3: "3 ngày",
    7: "7 ngày",
    14: "14 ngày",
    30: "30 ngày",
    90: "90 ngày"
}

danhMuc.NgayDaDangKey = [
    0,
    1,
    3,
    7,
    14,
    30,
    90
]

danhMuc.HuongNha = {
    0: BAT_KY,
    "-1" : CHUA_XAC_DINH,
    1: "Đông",
    2: "Tây",
    3: "Nam",
    4: "Bắc",
    5: "Đông-Bắc",
    6: "Tây-Bắc",
    7: "Đông-Nam",
    8: "Tây-Nam"
}

danhMuc.HuongNhaKey = [
    0,
    -1,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
];

danhMuc.LoaiTin = {
    0: "Bán",
    1: "Cho thuê"
};

danhMuc.MapType = [
    "Standard",
    "Satellite",
    "Hybrid"
];


danhMuc.CHAT_MESSAGE_TYPE ={
    TEXT: 1,
    IMAGE:2,
    FILE: 3,
    SYSTEM: 4
};

danhMuc.DonViTien = {
    1: "Triệu",
    2: "Tỷ",
    3: "Trăm nghìn/m²",
    4: "Triệu/m²",
    5: THOA_THUAN
};

danhMuc.DonViTienKey = [
    1,
    2,
    3,
    4,
    5
];

danhMuc.AdsAlertUs = {
    1: "Thông tin vị trí không chính xác",
    2: "Hình ảnh không phù hợp",
    3: "Tin bài sao chép",
    4: "Nội dung thông tin không có thật",
    5: "Nhà đã được bán",
    6: "Khác"
};

danhMuc.AdsAlertUsKey = [
    1,
    2,
    3,
    4,
    5,
    6
];

danhMuc.goiTin = [
    "1",
    "7",
    "14",
    "30",
    "90"
]

danhMuc.getOrderKey = function (key) {
    return key.indexOf("DESC") !== -1 ? key.substring(0, key.length-4) :
        key.substring(0, key.length-3);
}

danhMuc.getOrderType = function (key) {
    return (key && key.indexOf("ASC") !== -1) ? "ASC" : "DESC";
}

danhMuc.getDateFromNow = function (days) {
    if (!days || days == '') {
        return undefined;
    }
    return moment().subtract(days, 'days').format('YYYYMMDD');
}

danhMuc.getDanhMucKeys = function (hashDanhMuc) {
    var result = [];
    for (var k in hashDanhMuc) {
        result.push(k);
    }
    return result;
}

danhMuc.getDanhMucValues = function (hashDanhMuc) {
    var result = [];
    for (var k in hashDanhMuc) {
        result.push(hashDanhMuc[k]);
    }
    return result;
}

danhMuc.getDanhMucHuongNhaValues = function () {
    var result = [];
    for (var i=0; i<danhMuc.HuongNhaKey.length; i++) {
        var k = danhMuc.HuongNhaKey[i];
        result.push(danhMuc.HuongNha[k]);
    }
    return result;
}

danhMuc.getLoaiNhaDatBanValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.LoaiNhaDatBan);
}

danhMuc.getLoaiNhaDatThueValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.LoaiNhaDatThue);
}

danhMuc.getSoPhongNguValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoPhongNgu);
}

danhMuc.getSoTangValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoTang);
}

danhMuc.getSoPhongTamValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.SoPhongTam);
}

danhMuc.getAdsSoPhongNguValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.AdsSoPhongNgu);
}

danhMuc.getAdsSoTangValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.AdsSoTang);
}

danhMuc.getAdsSoPhongTamValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.AdsSoPhongTam);
}

danhMuc.getHuongNhaValues = function () {
    return danhMuc.getDanhMucHuongNhaValues();
}

danhMuc.getDonViTienValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.DonViTien);
}

danhMuc.getAdsAlertUsValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.AdsAlertUs);
}

danhMuc.getRadiusInKmValues = function () {
    return ["0.5", "1", "2", "3", "4", "5"];
}

danhMuc.getNgayDaDangValues = function () {
    return danhMuc.NgayDaDangKey;
}

danhMuc.getLoaiNhaDatForDisplay = function(loaiTin, loaiNhaDatKey){
    var value = '';
    if (loaiTin == 'ban')
        value = danhMuc.LoaiNhaDatBan[loaiNhaDatKey];

    if (loaiTin == 'thue')
        value = danhMuc.LoaiNhaDatThue[loaiNhaDatKey];

    if (!value)
        value = BAT_KY;

    return value;
};

danhMuc.getGiaForDisplay = function (gia, donViTien) {
    var value = '';
    if (!gia || donViTien == 5) {
        value = danhMuc.DonViTien[5];
    } else {
        value = gia + ' ' + danhMuc.DonViTien[donViTien].toLowerCase();
    }
    return value;
};

danhMuc.calculateGia = function (gia, donViTien, dienTich) {
    if (!gia || donViTien == 1) {
        return gia;
    } else {
        if (donViTien == 5) {
            return null;
        }
        if (donViTien == 2) {
            return gia * 1000.0;
        }
        if (!dienTich) {
            return null;
        }
        if (donViTien == 3) {
            return (gia * dienTich) / 10.0;
        }
        if (donViTien == 4) {
            return gia * dienTich;
        }
    }
    return null;
};

danhMuc.getDanhMucKeyByIndex = function (hashDanhMuc, index) {
    var find = '';
    var i = 0;
    for (var k in hashDanhMuc) {
        if (i == index) {
            find = k;
            break;
        }
        i++;
    }
    return find;
};

danhMuc.getSoPhongByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoPhongNgu, index);
}

danhMuc.getSoTangByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoTang, index);
}

danhMuc.getSoPhongTamByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.SoPhongTam, index);
}

danhMuc.getAdsSoPhongByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.AdsSoPhongNgu, index);
}

danhMuc.getAdsSoTangByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.AdsSoTang, index);
}

danhMuc.getAdsSoPhongTamByIndex = function (index) {
    return danhMuc.getDanhMucKeyByIndex(danhMuc.AdsSoPhongTam, index);
}

danhMuc.getRadiusInKmByIndex = function(index) {
    return danhMuc.RadiusInKmKey[index];
}

danhMuc.getLoaiTinValue = function (key) {
    return danhMuc.LoaiTin[key];
}


//eg: map=danhMuc.SoPhongTam, value = 1
danhMuc.getIdx = function(map, value) {
    let i = 0;
    for (var k in map) {
        if (k == value) {
            return i
        }
        i++;
    }

    return 0;//default
};

danhMuc.package = {
    goi: {
        1: {
            title: "Vị trí"
        },
        2: {
            title: "Trang chủ"
        },
        3: {
            title: "Đặc biệt"
        }
    },
    level: {
        1: "Đặc biệt",
        2: "Cao cấp",
        3: "Tiêu chuẩn"
    }, 
    length : {
        1: "1 ngày",
        7: "7 ngày",
        14: "14 ngày",
        30: "30 ngày",
        90: "90 ngày"
    },

    getLevel(option) {
        let found = null;
        for (let field in danhMuc.package.level) {
            if (danhMuc.package.level[field] == option) {
                found = Number(field);
            }
        }

        return found;
    },

    getLength(option) {
        let found = null;
        for (let field in danhMuc.package.length) {
            if (danhMuc.package.length[field] == option) {
                found = Number(field);
            }
        }

        return found;
    }
};

danhMuc.telco = {
  mobifone: "mobifone",
  viettel : "viettel",
  vinaphone : "vinaphone",
};



module.exports = danhMuc;


//import {LoaiNhaDatBan} from "danhMuc"...