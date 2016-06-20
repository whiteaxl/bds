var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
//var {manager} = require('react-native-couchbase-lite');

var {manager} = require('./relandCB');

import log from "../lib/logUtil";
import cfg from "../cfg";


class DBService {
  constructor() {
    this.adsDesignDocName = "ads";
    this.dbName = 'default';
    this.remoteDbUrl = `http://${cfg.server}:4984/${this.dbName}`;

    this.databaseUrl = 'http://admin:321@localhost:5984/';

    ReactCBLite.init(5984, 'admin', '321', e => {
      log.warn('initialized localDB!');
    });

    this.database = new manager(this.databaseUrl, this.dbName);
  }

  //may be need check connection when close...
  db() {
    return this.database.getInfo()
      .then((res) => {
        console.log("DB infor:", res);
        return this.database
      })
      .catch(res => {
        console.log("Fail to DB infor, will reinit:", res);
        return ReactCBLite.init(5984, 'admin', '321', e => {
          log.warn('initialized localDB!');
          return this.database
        });
      });
  };

  _createDesignDoc() {
    log.enter("localDB._createDesignDoc");

    var adsViews = {
      all_ads: {
        "map": function (doc) {
          if (doc.type == 'Ads')
            emit(doc.adsID, doc);
        }.toString()
      }
    };

    this.database.createDesignDocument(this.adsDesignDocName, adsViews)
      .then((res) => {
        if (res.status === 409) {
          log.warn("design doc 'all_ads' already exists!");
        } else {
          log.info("Created all_ads design doc!");
        }
      })
      .catch((e) => {
        log.error("Error when _createDesignDoc", e);
      })
  }

  _createAds(data) {
    var {nguoiDang, loaiTin, loaiNha, diaChi, gia, dienTich, soTang, phongNgu, chiTiet, uploadUrls, userID, geo, tenLoaiNhaDat, tenLoaiTin} = data;
    var d = new Date();
    var t = d.getTime();
    var adsID = 'Ads_bds_' + t;
    var giaM2 = '';
    if (gia && dienTich) {
        giaM2 = Number((gia/dienTich).toFixed(3));
    }
    var image = {cover: '', images: []};
    if (uploadUrls.length > 0) {
        image.cover = uploadUrls[0];
        uploadUrls.map(function (uploadUrl) {
            image.images.push(uploadUrl);
        })
    }
    var ngayDangTin = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

      var adsDto = {
        "type": "Ads",
        "adsID": adsID,
        "area_raw": '',
        "chiTiet": chiTiet,
        "dangBoi": {
          "email": '',
          "name": nguoiDang,
          "phone": '',
          "userID": userID
        },
        "dienTich": dienTich,
        "gia": gia,
        "giaM2": giaM2,
        "image": image,
        "loaiNhaDat": loaiNha,
        "loaiTin": loaiTin,
        "maSo": t,
        "ngayDangTin": ngayDangTin,
        "place": {
          "diaChi": diaChi,
          "diaChinh": {
            "huyen": '',
            "tinh": '',
            "xa": ''
          },
          "diaChinhFullName": '',
          "duAnFullName": null,
          "geo": geo
        },
        "price_raw": '',
        "soPhongNgu": phongNgu,
        "soTang", soTang,
        "ten_loaiNhaDat": tenLoaiNhaDat,
        "ten_loaiTin": tenLoaiTin,
        "title": chiTiet
      };
      return this.db().then(db => {
          db.createDocument(adsDto).then((res) => {
              let documentId = res.id;
              console.log("created document!", documentId);
              return documentId;
          });
      });
  }

  startSync(sessionCookie) {
    this.database.replicate(
      this.dbName,
      {headers: {Cookie: sessionCookie}, url: this.remoteDbUrl},
      true
    );

    this.database.replicate(
      {headers: {Cookie: sessionCookie}, url: this.remoteDbUrl},
      this.dbName,
      true
    );
  }

  loginAndStartSync(username, password, onDBChange) {

    var settings = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: username, password: password})
    };

    return fetch(this.remoteDbUrl + "/_session", settings)
      .then((res) => {
        switch (res.status) {
          case 200:
          {
            log.info("Login success, starting sync...");
            let sessionCookie = res.headers.map['set-cookie'][0];
            //console.log(sessionCookie);

            this.database.deleteDatabase()
              .then((res) => {
                console.log('deleted database!', res);

                this.database.createDatabase()
                  .then((res) => {

                    //subscribe event
                    this.database.getInfo()
                      .then((res) => {
                        this.database.listen({since: res.update_seq - 1, feed: 'longpoll', include_docs: true});
                      });
                    this.database.changesEventEmitter.on('changes', (e) => {
                      console.log("DB just changes:", e);

                      setTimeout(() =>
                          this.database.getAllDocuments({include_docs: true})
                            .then(res => {
                              onDBChange(e, res.rows);
                            })
                        , 1000
                      )
                    });

                    this.startSync(sessionCookie);

                    /*
                     this.db().getDesignDocument(this.adsDesignDocName)
                     .then((res) => {
                     this._createDesignDoc();
                     })
                     .catch((e) => {
                     log.error("error when getDesignDocument:", e);
                     });
                     */
                  })
                  .catch((e) => {
                    log.error(e);
                  });
              });


            return {status: 0, sessionCookie: sessionCookie};
          }
          default:
          {
            log.error("Bad user", res);
            return {status: 1, error: res};
          }
        }
      });
  }

  getAllDocuments() {
    return this.db().then(db => {
      return db.getAllDocuments({include_docs: true})
        .then((res) => {
          return res.rows
        });
    });
  }

  getAllAds() {
    return this.db()
      .then(db => {
        return db.queryView(this.adsDesignDocName, 'all_ads')
          .then((res) => {
            console.log("getAllAds", res);

            return res.rows || [];
          });
      });
  }

  updateFullName(docID, fullName) {
    var options = {conflicts: true};

    this.db()
      .then(db => {
        return db.getDocument(docID, options)
          .then((doc) => {
            let documentRevision = doc._rev;

            doc.fullName = fullName;

            db.updateDocument(doc, docID, documentRevision)
              .then((res) => {
                console.log("Updated document", res);
              });

          });
      });
  }

  sendChat(msg) {
    return this.db().then(db => {
        db.createDocument(msg).then((res) => {
          let documentId = res.id;
          console.log("created document!", documentId);
          return documentId;
        });
      });
  }

  getUser() {
    return this.db()
      .then(db => {
        return db.getAllDocuments({include_docs: true}).then((res) => {
          let rows = res.rows;

          for (var i in rows) {
            let doc = rows[i].doc;
            if (doc.type === 'User') {
              return doc;
            }
          }

          return null;
        });
      });
  }

  logout() {
    return this.database.deleteDatabase();
  }

  initListener() {
    log.warn("Try to re-open...");
    ReactCBLite.init(5984, 'admin', '321', e => {
      log.warn('initialized localDB!');
    });
  }

  //data={doc, partner}: get msg of user
  getAllChatMsg(partnerID, relatedToAdsID) {
    return this.db()
      .then(db => {
        return db.getAllDocuments({include_docs: true}).then((res) => {
          let rows = res.rows;
          let filtered = rows.filter((e) => {
            let doc = e.doc;
            return doc.type=='Chat'
              && (doc.fromUserID == partnerID || doc.toUserID == partnerID)
              && (doc.relatedToAds.adsID == relatedToAdsID)
          } );

          return filtered.map(e => e.doc);
        });
      });
  }
}

let dbService = new DBService();

export default dbService;








