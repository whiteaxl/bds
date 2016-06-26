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
	LIMIT_RECENT_SEARCH : 3,
	LIMIT_SAVE_SEARCH : 5,

	//Error msg
	ERR_LoiKetNoiMayChu : "Lỗi kết nối đến máy chủ!",
	INF_KhongCoKetQua : "Không có kết quả nào!",
	ERR_MaXacMinhSai : 'Mã xác minh sai!',
	ERR_dataRequired : 'Chưa nhập ',
	INFO_userCreatedSuccessfully : 'Bạn đã đăng ký thành công!',
	ERR_PhoneExisted : 'Số điện thoại đã tồn tại!',
	ERR_LIKED : "Lỗi! Bài đăng đã lưu từ trước",
	ERR_UserNotExist : "Lỗi! User không tồn tại",
	INF_ClickToRefresh : "Nhấn vào đây để lấy dữ liệu lại",
	ERR_Saved : "Lỗi! Tên lưu tìm kiếm đã tồn tại!"
};

var styles = StyleSheet.create({
    defaultText: {
        fontFamily: gui.fontFamily,
        fontSize: gui.normalFontSize
    }
});

gui.styles = styles;


module.exports = gui;