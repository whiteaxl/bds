var cfg = {
    //server : 'localhost'
    server : 'dev2.landber.com'
    //server : '203.162.13.40'
    //server : '192.168.0.109'
};

cfg.rootUrl = `https://${cfg.server}/api`;
cfg.serverUrl = `https://${cfg.server}`;

cfg.maxWidth = 745;
cfg.maxHeight = 510;
cfg.topupSMSNumber = "9029";

cfg.noCoverUrl = `https://${cfg.server}/web/asset/img/reland_house_large.jpg`;

export default cfg;