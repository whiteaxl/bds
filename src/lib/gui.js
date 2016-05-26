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

	//Error msg
	ERR_LoiKetNoiMayChu : "Lỗi kết nối đến máy chủ!",
	INF_KhongCoKetQua : "Không có kết quả nào!",
	ERR_MaXacMinhSai : 'Mã xác minh sai!'
};

var styles = StyleSheet.create({
    defaultText: {
        fontFamily: gui.fontFamily,
        fontSize: gui.normalFontSize
    }
});

gui.styles = styles;


module.exports = gui;