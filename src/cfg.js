var cfg = {
    //server : 'localhost'
    server : '203.162.13.177'
    //server : '192.168.0.109'
};

cfg.rootUrl = `http://${cfg.server}:5000/api`;

cfg.maxWidth = 745;
cfg.maxHeight = 510;
cfg.topupSMSNumber = "9029";

cfg.noCoverUrl = `http://${cfg.server}:5000/web/asset/img/reland_house_large.jpg`;

export default cfg;