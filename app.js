/*
 * app.js Simpole express server
 */
'use strict';
var
  http = require('http'),
  solr = require('solr-client'),
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  app = express(),
  files_serve_app = express(),
  server = http.createServer(app),
  files_server = http.createServer(files_serve_app),
  job_id_counter = 1,
  storage_dir = path.join(__dirname, 'storage'),
  solr_client = solr.createClient("172.17.0.3", '8983', 'item'),
  easyimg = require('easyimage'),
  storage_dir = path.join(__dirname, 'storage');

function String_startsWith(str, prefix) {
    return str.substring(0, prefix.length) === prefix;
}

function vx_id_to_id(vx_id) {
    return parseInt(vx_id.split('-')[1], 10);
}

solr_client.autoCommit = true;

files_serve_app.use(express.static(storage_dir));

app.use(express.json());
app.use(express.urlencoded());

app.get('/API/version', function (req, res) {
    var version_info = {
        "component" : [
            {
                "version" : "0.1",
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
                    "00:0c:29:4b:09:9e"
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

app.post('/API/import/placeholder', function(req, res) {
    var query;

    if (!req.is('application/json')) {
        res.send(400, 'JSON body expected');
        return;
    }

    /* We find the max id, so we can calculate the next one */
    var query = solr_client.createQuery().q("*:*").sort({id: 'desc'}).rows(1);

    solr_client.search(query, function(err, result) {
        console.log('result', result);
        var old_id, vx_id, id, doc;
        if (err) {
            console.error('Could not find max id', err);
            res.send(500, 'Could not search');
        }

        if (result.response.numFound < 1) {
            id = 1; // No documents yet.
            console.log('First document will have id', id);
        } else {
            old_id = result.response.docs[0].id;
            console.log("Old id", old_id);
            id = old_id + 1;
            console.log('Next document will have id', id);
        }
        vx_id = 'VX-' + id;

        /* We established the ID of the new item.
         * Now we add the new document. */
        doc = {
            'vx_id': vx_id,
            'id': id
        };
        solr_client.add(doc, function(err, obj) {
            if (err) {
                console.error(err);
                res.send(500, 'Failed to create solr item');
            } else {
                console.log('Created solr item', vx_id);
                res.json({
                    "id": vx_id
                });
            }
        });
    });

});

app.post('/API/import/placeholder/:vx_id/container', function(req, res) {
    var vx_id,
        uri,
        ext,
        new_file_name,
        new_path,
        job_id,
        now,
        input_file_path,
        read_stream,
        write_stream;

    if (!req.is('application/json')) {
        res.send(400, 'JSON body expected');
        return;
    }
    vx_id = req.params.vx_id;
    if (!vx_id) {
        res.send(400, 'Item ID not given');
        return;
    }
    uri = req.query.uri;
    if (!uri) {
        res.send(400, 'Path not given');
        return;
    }
    if (!String_startsWith(uri, 'file://')) {
        res.send(400, 'Only local files are supported');
    }
    input_file_path = uri.substring(7);
    ext = path.extname(uri);
    new_file_name = vx_id + ext;
    new_path = path.join(storage_dir, new_file_name);

    read_stream = fs.createReadStream(input_file_path);
    read_stream.on("error", function(err) {
        console.error('Error in reading stream', err);
    });
    write_stream = fs.createWriteStream(new_path);
    write_stream.on("error", function(err) {
        console.error("Error in writing stream", err);
    })
    write_stream.on("close", function() {
        var doc;
        console.log("Finished copying", input_file_path, "to", new_path);
        /* Now we update the reference in solr. */
        doc = {
            'vx_id': vx_id,
            'id': vx_id_to_id(vx_id),
            'file': new_file_name
        };
        solr_client.add(doc, function(err, obj) {
            if (err) {
                console.error('Failed to update solr', vx_id, err);
            } else {
                console.log('Updated solr', vx_id);
            }
        });
    });
    read_stream.pipe(write_stream);

    job_id = 'VX-' + job_id_counter++;
    now = new Date;

    var result = {
        "jobId": job_id,
        "user": "admin", // TODO
        "started": now.toISOString(),
        "status": "FINISHED",
        "type": "PLACEHOLDER_IMPORT",
        "priority": "MEDIUM"
    };
    res.json(result);
});

app.put('/API/item/:vx_id', function (req, res) {
    var vx_id,
        body,
        docs = [];

    if (!req.is('application/json')) {
        res.send(400, 'JSON body expected');
        return;
    }
    vx_id = req.params.vx_id;
    if (!vx_id) {
        res.send(400, 'Item ID not given');
        return;
    }
    body = request.body;
    body.forEach(function(item) {
        var doc = {

        }
    });
});

app.get('/API/thumbnail/:col_id/:vx_id', function (req, res) {
    var vx_id = req.params.vx_id;

    var query = solr_client.createQuery().q("vx_id:" + vx_id).rows(1);

    solr_client.search(query, function(err, result) {
        if (err) {
            console.error('Could not find asset', err);
            res.send(500, 'Could not search');
        } else if (result.response.numFound < 1) {
            res.send(404, 'Asset does not exist');
        } else {
            console.log(result.response.docs[0]);
            serve_thumbnail(res, result.response.docs[0].file);
        }
    });
});

function serve_thumbnail(res, file_name) {
    var dst = 'thumbnail/' + file_name;
    var src = 'storage/' + file_name;

    if (fs.existsSync(dst)) {
        res.sendfile(dst);
    } else if (!fs.existsSync(src)) {
        res.send(404, 'Sorry, we cannot find that!');
        res.end();
    } else {
        var options = {
             src: src,
             dst: dst,
             width:320,
             height:200,
        }

        easyimg.thumbnail(options, function (err, image) {
            if (err) {
                throw err;
            } else {
                res.sendfile(dst);
            }
        });
    }
}

server.listen(8080);
console.log(
    'API server listening on port %d in %s mode',
    server.address().port, app.settings.env
);
files_server.listen(8090);
console.log(
    'Files server listening on port %d in %s mode',
    files_server.address().port, files_serve_app.settings.env
);

