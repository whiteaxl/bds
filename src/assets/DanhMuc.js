var danhMuc = {};

danhMuc.LoaiNhaDatBan = {
    1  : "Bán căn hộ chung cư",
    2  : "Bán nhà riêng",
    3  : "Bán nhà mặt phố", 
    4  : "Bán biệt thự, liền kề", 
    5  : "Bán đất", 
    99 : "Bán các bds khác"
}

danhMuc.LoaiNhaDatThue = {
    1 : "Cho Thuê căn hộ chung cư",
    2 : "Cho Thuê nhà riêng",
    3 : "Cho Thuê nhà mặt phố", 
    4 : "Cho Thuê văn phòng", 
    5 : "Cho Thuê cửa hàng, ki-ốt",
    99: "Cho Thuê các bds khác"
}

danhMuc.LoaiNhaDat = {
    ban: LoaiNhaDatBan, 
    thue: LoaiNhaDatThue
}

danhMuc.SoPhongTam = {

}

module.exports = danhMuc;


//import {LoaiNhaDatBan} from "danhMuc"...