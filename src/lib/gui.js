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

	//Error msg
	ERR_LoiKetNoiMayChu : "Lỗi kết nối đến máy chủ!",
	INF_KhongCoKetQua : "Không có kết quả nào!",
	INF_KhongCoGoiYNao : "Không có gợi ý nào!",
	ERR_MaXacMinhSai : 'Mã xác minh sai!',
	ERR_dataRequired : 'Chưa nhập ',
	INFO_userCreatedSuccessfully : 'Bạn đã đăng ký thành công!',
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
gui.MAX_ITEM = 100;

gui.MAX_VIEWABLE_ADS = 25;

gui.LATITUDE_DELTA = 0.08616620000177733;
gui.LONGITUDE_DELTA = 0.0608263772712121;

module.exports = gui;