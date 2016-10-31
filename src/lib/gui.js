import {StyleSheet} from 'react-native'

var gui = {
	green : "#66c03f", 
	green1 : "#4db62c",
	mainColor : '#00a8e6',
	searchHeaderBg: '#adadad',
	separatorLine: '#DFDFE2',
	arrowColor: '#BBBBBB',
	fontFamily: 'Open Sans',
	normalFontSize : 16,
	buttonFontSize: 16,
	capitalizeFontSize: 13,
	LIMIT_RECENT_SEARCH : 10,
	LIMIT_SAVE_SEARCH : 5,
	VI_TRI_HIEN_TAI: "Vị trí hiện tại",

	//Error msg
	ERR_LoiKetNoiMayChu : "", //"Lỗi kết nối đến máy chủ!", TODO: temporary change for this error
	INF_KhongCoKetQua : "Không tìm thấy kết quả nào phù hợp.",
	INF_KhongCoKetQua2 : "Hãy zoom nhỏ lại, di chuyển bản đồ hoặc nhấn vào nút \"Lọc\" để thay đổi điều kiện",
	INF_KhongCoGoiYNao : "Không có gợi ý nào!",
	ERR_MaXacMinhSai : 'Mã xác minh sai!',
	ERR_dataRequired : 'Chưa nhập ',
	INFO_userCreatedSuccessfully : 'Bạn đã đăng ký thành công!',
	INFO_ComingSoon : 'Tính năng đang được phát triển. Sẽ xuất hiện trong vài ngày tới !',
	ERR_PhoneExisted : 'Số điện thoại đã tồn tại!',
	ERR_LIKED : "Lỗi! Bài đăng đã lưu từ trước",
	ERR_UNLIKED : "Lỗi! Bài đăng không tồn tại",
	ERR_UserNotExist : "Lỗi! User không tồn tại",
	INF_ClickToRefresh : "Nhấn vào đây để lấy dữ liệu lại",
	ERR_Saved : "Lỗi! Tên lưu tìm kiếm đã tồn tại!",
	ERR_NotRelandUser : "Lỗi! Bạn không chat được vì bài đăng không phải của Reland!",
	ERR_NotAllowChatYourSelf : "Lỗi! Đây là bài đăng của bạn!"
};

var styles = StyleSheet.create({
    defaultText: {
        fontFamily: gui.fontFamily,
        fontSize: gui.normalFontSize
    }
});

gui.styles = styles;
gui.defaultLocation = {
	lat : 20.95389909999999,
	lon : 105.75490945
};

gui.QUOTA_ITEM = 300;
gui.MAX_ITEM = 25;
gui.MAX_LIST_ITEM = 25;

gui.MAX_VIEWABLE_ADS = 25;

gui.LATITUDE_DELTA = 0.00579477856972;
gui.LONGITUDE_DELTA = 0.00409277265874;

module.exports = gui;