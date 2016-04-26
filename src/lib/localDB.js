var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
ReactCBLite.init(5984, 'admin', '321', e => {
    console.log('initialized');
});

var { manager } = require('react-native-couchbase-lite');
var dbName = 'default';
var localDbName = 'reland';

var database = new manager('http://admin:321@localhost:5984/', localDbName);

var remoteUser = 'mobile';
var remotePass = '123';

var remoteDbUrl = 'http://localhost:4984/' + dbName;

var settings = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: remoteUser,
        password: remotePass
    })
};

var dbService = {};

dbService.database = database;

dbService.initSync = function() {
    fetch(remoteDbUrl+"/_session", settings)
        .then((res) => {
            switch (res.status) {
                case 200: {
                    console.log("Login success to setup sync");

                    let sessionCookie = res.headers.map['set-cookie'][0];

                    this.database.replicate(
                        localDbName,
                        {headers: {Cookie: sessionCookie}, url: remoteDbUrl},
                        true
                    );

                    this.database.replicate(
                        {headers: {Cookie: sessionCookie}, url: remoteDbUrl},
                        localDbName,
                        true
                    );
                }
                default: {
                    console.log("Bad user", res);
                }
            }
        });
};


export default dbService;








