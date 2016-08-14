// Api.js

import ApiUtils from './ApiUtils';

import cfg from "../cfg";
import log from "./logUtil";
import gui from "./gui";

var topupApiUrl = cfg.rootUrl + "/1pay";

var topupApi = {
  /*
   dto = {type, pin, serial, userID, clientInfor}
   */
  topupScratch(dto) {
    const url  = topupApiUrl + "/scratchTopup";
    log.info("Call POST ", url, dto);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        return response.json()
      })
      .catch(e => {
        log.info("Error in topupScratch", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  }
};

export {topupApi as default};
