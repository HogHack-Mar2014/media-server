/*
 * app.js Simpole express server
 */
'use strict';
var
  http = require('http'),
  express = require('express'),
  app = express(),
  server = http.createServer(app);

app.get('/API/version', function (req, res) {
    var version_info = {
        "component" : [
            {
                "version" : "3.3.10.pre-g0d99a67-11431",
                "name" : "API"
            }
        ],
        "licenseInfo" : {
            "licenseStatus" : "valid",
            "itemNumber" : {
                "allowed" : "-1",
                "current" : "10123"
            },
            "transcoderNumber" : {
                "allowed" : "-1",
                "current" : "1"
            },
            "userNumber" : {
                "allowed" : "-1",
                "current" : "2289"
            },
            "resellerCompanyName" : "Hogarth Worldwide",
            "endCustomerCompanyname" : "Hogarth Worldwide",
            "licenseType" : "2",
            "resellerCompanyContactEmail" : "softwarelicensing@hogarthww.com",
            "expiryDate" : "2014-06-30",
            "codecStatus" : {
                "codec" : [

                ]
            },
            "macaddresses" : {
                "macaddress" : [
                    "00:0c:29:4b:09:9e",
                    "00:0c:29:5e:cc:02",
                    "00:0c:29:99:f8:87",
                    "00:0c:29:ae:d0:89",
                    "00:0c:29:b2:6e:44",
                    "00:0c:29:d5:7a:8d",
                    "00:0c:29:dc:08:a7",
                    "00:0c:29:df:e2:c9",
                    "00:50:56:aa:44:fc",
                    "00:50:56:aa:6e:ab"
                ]
            },
            "storageNumber" : {
                "allowed" : "-1",
                "current" : "1"
            },
            "endCustomerCompanyContactEmail" : "softwarelicensing@hogarthww.com"
        },
        "systemInfo" : {
            "macaddress" : [
                "00:0c:29:d5:7a:8d"
            ]
        }
    };
    res.json(version_info);
});

server.listen(3000);
console.log('Express server listening on port %d in %s mode',
        server.address().port, app.settings.env
        );
