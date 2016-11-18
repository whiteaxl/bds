// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"
import cfg from "../cfg";
import log from "./logUtil";
import gui from './gui';

var rootUrl = `http://${cfg.server}:5000/api`;
var uploadUrl = rootUrl + "/upload";
var postAds = rootUrl + "/postAds";

'use strict';

var React = require('react-native');
var FileUpload = require('NativeModules').FileUpload;

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} = React;

var Api = {
  onUpload: function(filename, filepath, uploadCallback) {
      var obj = {
          uploadUrl: uploadUrl,
          method: 'POST', // default 'POST',support 'POST' and 'PUT'
          headers: {
              'Accept': 'application/json'
          },
          files: [
              {
                  filename: filename, // require, file name
                  filepath: filepath, // require, file absoluete path
                  filetype: 'image/jpeg' // options, if none, will get mimetype from `filepath` extension
              }
          ]
      };
      return FileUpload.upload(obj, function(err, result) {
          //console.log('upload: ' + uploadUrl, err, result);
          uploadCallback(err, result);
      });
  },

  postAds: function(adsDto, token) {
      return fetch(`${postAds}`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(adsDto)
      })
          .then(ApiUtils.checkStatus)
          .then(response => {
              log.info("Response of postAds", response);
              return response.json()
          })
          .catch(e => {
              log.info("Error when postAds", e);
              return {
                  status : 101,
                  msg: gui.ERR_LoiKetNoiMayChu
              }
          });
  }
};

export { Api as default };
