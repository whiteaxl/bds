var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
//var {manager} = require('react-native-couchbase-lite');

var {manager} = require('./relandCB');

import cookie from 'cookie';

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

    }

    //may be need check connection when close...
    db() {
        if (!this.database) {
            log.warn("Create db manager for local database!");
            this.database = new manager(this.databaseUrl, this.dbName);
        }

        return this.database
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

        this.db().createDesignDocument(this.adsDesignDocName, adsViews)
            .then((res) => {
                if (res.status === 409) {
                    log.warn("design doc 'all_ads' already exists!");
                } else {
                    log.info("Created all_ads design doc!");
                }
            })
          .catch((e) => {
              log.error("Error when _createDesignDoc",e);
          })
    }

    startSync(sessionCookie) {
        this.db().replicate(
            this.dbName,
            {headers: {Cookie: sessionCookie}, url: this.remoteDbUrl},
            true
        );

        this.db().replicate(
            {headers: {Cookie: sessionCookie}, url: this.remoteDbUrl},
            this.dbName,
            true
        );
    }

    loginAndStartSync(username, password) {

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

                        this.db().deleteDatabase()
                          .then((res) => {
                              console.log('deleted database!', res);

                              this.db().createDatabase()
                                .then((res) => {

                                  //subscribe event
                                  this.db().getInfo()
                                    .then((res) => {
                                      this.db().listen({since: res.update_seq - 1, feed: 'longpoll', include_docs:true});
                                    });
                                  this.db().changesEventEmitter.on('changes', function (e) {
                                    console.log("DB just changes:",e);
                                  }.bind(this));


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
        return this.db().getAllDocuments({include_docs: true}).then((res) => {
            return res.rows
        });
    }

    getAllAds() {
        return this.db().queryView(this.adsDesignDocName, 'all_ads')
            .then((res) => {
                console.log("getAllAds", res);

                return res.rows || [];
            });
    }

    updateFullName(docID, fullName) {
        var options = {conflicts: true};

        this.db().getDocument(docID, options)
          .then((doc) => {
              let documentRevision = doc._rev;

              doc.fullName = fullName;

              this.db().updateDocument(doc, docID, documentRevision)
                .then((res) => {
                  console.log("Updated document", res);
                });

          });
    }

    sendChat(state) {
        this.db().createDocument({
            timestamp: new Date().toISOString(),
            type: "Chat",
            msg: state.chatMsg,
            toUser: state.chatTo,
            fromUser: state.phone,
        }).then((res) => {
            let documentId = res.id;
            console.log("created document!", documentId);
        });
    }

    logout(sessionCookie) {
        this.db().deleteDatabase()
          .then((res) => {
              console.log("Done delete localDB", res);
          });
    }
}

let dbService = new DBService();

export default dbService;








