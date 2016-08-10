var danhMuc = {};

danhMuc.BAT_KY = "Bất kỳ";
var {BAT_KY} = danhMuc;

danhMuc.BIG =9999999;

danhMuc.sellStepValues = [0, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000]; //trieu

danhMuc.rentStepValues = [0, 2, 5, 10, 20, 50, 100, 500]; //by month

danhMuc.dienTichStepValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500];

danhMuc.loaiTin = {
    0 : "Bán",
    1  : "Cho Thuê"
};

danhMuc.LoaiNhaDatBan = {
    0 : BAT_KY,
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán nhà mặt phố", 
    4  : "Bán biệt thự, liền kề", 
    5  : "Bán đất", 
    99 : "Bán các bds khác"
}

danhMuc.LoaiNhaDatThue = {
    0 : BAT_KY,
    1 : "Cho Thuê căn hộ chung cư",
    2 : "Cho Thuê nhà riêng",
    3 : "Cho Thuê nhà mặt phố", 
    4 : "Cho Thuê văn phòng", 
    5 : "Cho Thuê cửa hàng, ki-ốt",
    99: "Cho Thuê các bds khác"
}

danhMuc.LoaiNhaDatKey = [
    0,
    1,
    2,
    3,
    4,
    5,
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
    1: "1",
    7: "7",
    14: "14",
    30: "30",
    90: "90"
}

danhMuc.NgayDaDangKey = [
    0,
    1,
    7,
    14,
    30,
    90
]

danhMuc.HuongNha = {
    0: BAT_KY,
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
    5: "Thỏa thuận"
};

danhMuc.DonViTienKey = [
    1,
    2,
    3,
    4,
    5
];

danhMuc.goiTin = [
    "1",
    "7",
    "14",
    "30",
    "90"
]

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
    return danhMuc.getDanhMucValues(danhMuc.HuongNha);
}

danhMuc.getDonViTienValues = function () {
    return danhMuc.getDanhMucValues(danhMuc.DonViTien);
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
        0: "0 ngày",
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



module.exports = danhMuc;


//import {LoaiNhaDatBan} from "danhMuc"...