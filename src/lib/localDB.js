var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
//var {manager} = require('react-native-couchbase-lite');

var {manager} = require('./relandCB');

import log from "../lib/logUtil";
import cfg from "../cfg";
import moment from 'moment';
import gui from "../lib/gui";

import ls from './localStorage';


class DBService {
  constructor() {
    log.error("Call LOCAL DB constructor!!!");

    this.adsDesignDocName = "ads";
    this.dbName = 'default';
    this.remoteDbUrl = `http://${cfg.server}:4984/${this.dbName}`;

    this.databaseUrl = 'http://admin:321@localhost:5984/';

    ReactCBLite.init(5984, 'admin', '321', e => {
      log.warn('initialized localDB!');
    });

    this.database = new manager(this.databaseUrl, this.dbName);

    //subscribe event
    this.database.changesEventEmitter.on('changes', (e) => {
      //log.info("DB just changes:", e.results ? e.results.length:0);
      log.info("DB just changes:", e.results);

      if (e.results) {
        e.results.forEach(one => {
          //check one by one to make sure it's my change, somehow data come from from other source
          this.database.getDocument(one.id).then((doc) => {
            if (!doc.error) {
              this.onDBChange(doc)
            }
          });
        });
      } else {
        log.warn("DB just changes but e.results is null, e is:", e)
      }

    });
  }

  //may be need check connection when close...
  db() {
    return this.database.getInfo()
      .then((res) => {
        log.info("DB infor:", res);
        return this.database
      })
      .catch(res => {
        log.warn("Fail to DB infor, will reinit:", res);
        var that = this;
        var p1 = new Promise(
          function(resolve, reject) {
            ReactCBLite.init(5984, 'admin', '321', e => {
              log.warn('initialized localDB!');
              that.startChangeListener();
              //this.startSync();
              resolve(that.database)
            });
          }
        );

        return p1
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

  _createAds(data, createAdsCallBack) {
    var {loaiTin, loaiNha, place, gia, dienTich, soTang, phongNgu, phongTam, chiTiet, uploadUrls, userID, tenLoaiNhaDat, tenLoaiTin, dangBoi} = data;
    var ms = moment().toDate().getTime();
    var adsID = 'Ads_reland_' + userID + '_' + ms;
    var giaM2 = 0;
    if (gia && dienTich) {
        giaM2 = Number((gia/dienTich).toFixed(3));
    }
    var image = {cover: '', images: []};
    if (uploadUrls.length > 0) {
        image.cover = uploadUrls[0];
        image.images = uploadUrls;
    }
    var ngayDangTin = moment().format('YYYYMMDD');

      var adsDto = {
        "type": "Ads",
        "adsID": adsID,
        "chiTiet": chiTiet,
        "dangBoi": dangBoi,
        "dienTich": dienTich,
        "gia": gia,
        "giaM2": giaM2,
        "image": image,
        "loaiNhaDat": loaiNha,
        "loaiTin": loaiTin,
        "maSo": ms,
        "ngayDangTin": ngayDangTin,
        "place": place,
        "soPhongNgu": phongNgu,
        "soPhongTam": phongTam,
        "soTang": soTang,
        "ten_loaiNhaDat": tenLoaiNhaDat,
        "ten_loaiTin": tenLoaiTin,
        "source" : 'reland',
        "timeModified" : ms
      };
      adsDto._id = adsDto.adsID;
      return this.db().then(db => {
          db.createDocument(adsDto).then((res) => {
              let documentId = res.id;
              log.info("created document!", documentId);
              createAdsCallBack(documentId);
              return documentId;
          });
      });
  }

  startSync() {
    log.info("Call startSync database with server");
    let sessionCookie = this.sessionCookie;

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

  startChangeListener() {
    log.info("startChangeListener... ");
    this.database.getAllDocuments({include_docs: true})
      .then((res) => {
        if (res.rows) {
          res.rows.forEach( (e) => {
            this.onDBChange(e.doc);
          })
        }
      });

    this.database.getInfo()
      .then((res) => {
        this.database.listen({since: res.update_seq - 1, feed: 'longpoll', include_docs: true});
      });
    //always start from 0
    /*
    this.database.listen({since: 0, feed: 'longpoll', include_docs: false});
    */
  }

  loginAndStartSync(username, password, onDBChange) {
    this.onDBChange = onDBChange;

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
            log.info("Login success, starting sync...", res);
            let sessionCookie = res.headers.map['set-cookie'][0];
            this.sessionCookie = sessionCookie;
            //log.info(sessionCookie);
            ls.setLoginInfo({username,password,sessionCookie});

            this.database.deleteDatabase()
              .then((res) => {
                log.info('deleted database!', res);

                this.database.createDatabase()
                  .then((res) => {
                    this.startSync();
                    setTimeout(() => {
                      this.startChangeListener();
                    },1000);
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
            log.info("getAllAds", res);

            return res.rows || [];
          });
      });
  }

  getAllAdsDocs() {
      return this.db()
          .then(db => {
              return db.getAllDocuments({include_docs: true})
                  .then((res) => {
                      let rows = res.rows;
                      if (!rows) {
                          return [];
                      }
                      let filtered = rows.filter((e) => {
                          return e.doc.type == 'Ads'
                      } );
                      return filtered.map(e => e.doc);
                  });
          });
  }

  getAds(adsID, getAdsCallback) {
    var options = {conflicts: true};
    log.info("getAds adsID", adsID);
    return this.db()
      .then(db => {
        return db.getDocument(adsID, options)
            .then((doc) => {
              log.info("getAds", doc);
              if (!doc.error) {
                  getAdsCallback(doc);
              }
              return doc;
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
                log.info("Updated document", res);
              });

          });
      });
  }

  sendChat(msg) {
    return this.db().then(db => {
        //log.info("dbservice.sendChat", db);
        db.createDocument(msg).then((res) => {
          let documentId = res.id;
          log.info("created document!", documentId);
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
    return this.db()
      .then(db => {
        db.getChanges().then(res => {
          console.log("getChanges", res);

          db.abortAllRequest();
          return db.deleteDatabase();
        });
      });
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

  getAllChatMsgByLoaiTin(partnerID, loaiTin) {
      return this.db()
          .then(db => {
              return db.getAllDocuments({include_docs: true}).then((res) => {
                  let rows = res.rows;
                  let filtered = rows.filter((e) => {
                      let doc = e.doc;
                      return doc.type=='Chat'
                          && (doc.fromUserID == partnerID || doc.toUserID == partnerID)
                          && (loaiTin === null || doc.relatedToAds.loaiTin === loaiTin)
                  } );

                  return filtered.map(e => e.doc);
              });
          });
  }

  //{userID, adsID}
  likeAds(dto) {
    return this.db().then(db => {
      log.info("localDB.likeAds", db);
      return db.getDocument(dto.userID, {})
        .then((doc) => {
          log.info("Found user," , doc);
          let documentRevision = doc._rev;

          let {adsLikes} = doc;
          let idx = adsLikes ? adsLikes.indexOf(dto.adsID) : null;

          if (idx && idx > -1) {
            return {
              status:1,
              msg : gui.ERR_LIKED
            }
          }

          if (!adsLikes) adsLikes=[];

          adsLikes.push(dto.adsID);

          doc.adsLikes = adsLikes;

          return db.updateDocument(doc, doc.userID, documentRevision)
            .then((res) => {
              log.info("Updated document for likeAds", res);
              return {
                status:0,
                msg : "Ngon",
                adsLikes: adsLikes
              }
            });
        });
    });
  }

    //{userID, adsID}
    unlikeAds(dto) {
        return this.db().then(db => {
            log.info("localDB.unlikeAds", db);
            return db.getDocument(dto.userID, {})
                .then((doc) => {
                    log.info("Found user," , doc);
                    let documentRevision = doc._rev;

                    let {adsLikes} = doc;
                    let idx = adsLikes ? adsLikes.indexOf(dto.adsID) : null;

                    if (idx && idx == -1) {
                        return {
                            status:1,
                            msg : gui.ERR_UNLIKED
                        }
                    }

                    if (!adsLikes) adsLikes=[];

                    adsLikes.splice(idx, 1);

                    doc.adsLikes = adsLikes;

                    return db.updateDocument(doc, doc.userID, documentRevision)
                        .then((res) => {
                            log.info("Updated document for unlikeAds", res);
                            return {
                                status:0,
                                msg : "Ngon",
                                adsLikes: adsLikes
                            }
                        });
                });
        });
    }

  //saveSearch {userID, searchObj}
  saveSearch(dto) {
    return this.db().then(db => {
      log.info("localDB.saveSearch", dto);
      return db.getDocument(dto.userID, {})
        .then((doc) => {
          log.info("Found user," , doc);
          let documentRevision = doc._rev;

          let savedList = doc.saveSearch;
          let exists = savedList ? savedList.find((e) => e && e.name == dto.searchObj.name) : null;

          log.info("localDB.saveSearch, exists=", exists);

          if (exists) {
            //Object.assign(exists, dto.searchObj);

            return {
              status:1,
              msg : gui.ERR_Saved
            }

          } else {
            if (!savedList) savedList=[];
            savedList.push(dto.searchObj);
            savedList.sort((a,b) => b.timeModified - a.timeModified);

            let LIMIT_SAVESEARCH = 10;
            
            if (savedList.length > LIMIT_SAVESEARCH) {
              savedList = savedList.slice(0, LIMIT_SAVESEARCH);
            }
          }

          doc.saveSearch = savedList;

          return db.updateDocument(doc, doc.userID, documentRevision)
            .then((res) => {
              log.info("Updated document for saveSearch", res);
              return {
                status:0,
                msg : "Ngon",
                saveSearch: savedList
              }
            });
        });
    });
  }

  //pack = {level, length, startDateTime}
  updateAdsPack(adsID, packName, pack) {
    return this.db().then(db => {
      log.info("localDB.updateAdsPack", db);
      return db.getDocument(adsID, {})
        .then((doc) => {
          log.info("Found ads," , doc);
          let documentRevision = doc._rev;

          doc[packName] = pack;

          return db.updateDocument(doc, adsID, documentRevision)
            .then((res) => {
              log.info("Updated Ads for new package", res);
              return {
                status:0
              }
            });
        });
    });
  }
}

let dbService = new DBService();

export default dbService;








