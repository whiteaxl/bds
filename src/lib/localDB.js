var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
var {manager} = require('react-native-couchbase-lite');

import log from "../lib/logUtil";
import cfg from "../cfg";

class DBService {
    constructor() {
        this.adsDesignDocName = "ads";
        this.dbName = 'default';
        this.remoteDbUrl = `http://${cfg.server}:4984/${this.dbName}`;

        ReactCBLite.init(5984, 'admin', '321', e => {
            log.warn('initialized localDB!');
        });
    }

    //may be need check connection when close...
    db() {
        if (!this.database) {
            log.warn("Create db manager for local database!");
            this.database = new manager('http://admin:321@localhost:5984/', this.dbName);
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
                console.log("created design doc", res);
            });
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

                        this.db().createDatabase()
                            .then((res) => {
                                this.startSync(sessionCookie);

                                this.db().getDesignDocument(this.adsDesignDocName)
                                    .then((res) => {
                                        this._createDesignDoc();
                                    })
                                    .catch((e) => {
                                        log.error("error when getDesignDocument:", e);
                                    });
                            })
                            .catch((e) => {
                                log.error(e);
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
        return this.db().getAllDocuments();
    }

    getAllAds() {
        return this.db().queryView(this.adsDesignDocName, 'all_ads')

            .then((res) => {
                console.log(res);

                return res.rows || [];
            });
    }
}

let dbService = new DBService();

export default dbService;








