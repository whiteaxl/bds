console.log("Call localDB include...");

var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
ReactCBLite.init(5984, 'admin', '321', e => {
    console.log('initialized');
});

var {manager} = require('react-native-couchbase-lite');
var dbName = 'default';
var remoteDbUrl = 'http://localhost:4984/' + dbName;


var dbService = {};

//dbService.database = database;

dbService.loginAndStartSync = function (username, password) {

    var settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username,
            password: password
        })
    };

    return fetch(remoteDbUrl + "/_session", settings)
        .then((res) => {
            switch (res.status) {
                case 200:
                {
                    console.log("Login success to setup sync 1112");

                    var database = new manager('http://admin:321@localhost:5984/', dbName);
                    /*
                    var remoteDbUrl = 'http://0982969669:123@localhost:4984/' + dbName;
                    database.replicate(dbName, remoteDbUrl, true);
                    database.replicate(remoteDbUrl, dbName, true);
                    */

                    /*
                    var adsViews = {
                        listAll: {
                            "map": function (doc) {
                                emit(doc.adsID, doc);
                            }.toString()
                        },
                        list2: {
                            "map": function (doc) {
                                emit(null, doc);
                            }.toString()
                        }
                    };
                    console.log("create view _design_ads2");
                    database.createDesignDocument("_design_ads2", adsViews)
                        .then((res) => {
                            console.log("created design doc", res);
                        });
                        */

                    let sessionCookie = res.headers.map['set-cookie'][0];

                    console.log(sessionCookie);


                    database.createDatabase()
                        .then((res) => {
                            database.replicate(
                                dbName,
                                {headers: {Cookie: sessionCookie}, url: remoteDbUrl},
                                true
                            );

                            database.replicate(
                                {headers: {Cookie: sessionCookie}, url: remoteDbUrl},
                                dbName,
                                true
                            );

                            var adsViews = {
                                all_ads: {
                                    "map": function (doc) {
                                        emit(doc.adsID, doc);
                                    }.toString()
                                }
                            };
                            console.log("create view ads");
                            database.createDesignDocument("ads", adsViews)
                                .then((res) => {
                                    console.log("created design doc", res);
                                });

                        }).catch((e) => {
                            console.log(e);
                        });


                    return {status: 0, sessionCookie: sessionCookie};
                    //return 1
                }
                default:
                {
                    console.log("Bad user", res);

                    return {status: 1, error: res};
                }
            }
        });
};

dbService.getAllDocuments = function () {
    console.log("aaaaaaa");
    return database.getAllDocuments();
};


export default dbService;








