

var request = require('superagent'),
    expect = require('expect.js'), 
    VIDI_URL = 'http://10.105.12.44:8080/API', 
    VIDI_IMPORT_PATH = 'file:///opt/vidispine/import/';

request.get(VIDI_URL + '/version/')
    .auth('admin', 'admin')
    .end(function (err, res) {
        expect(res.status).to.be(200);
    }
    );


function import_placeholder (callback, file_name) {
    request.post(VIDI_URL + '/import/placeholder/')
        .auth('admin', 'admin')
        .query({ 'container': '1'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send('{}')
        .end(function (err, res) {
            vx_id = JSON.parse(res.text).id;
            console.log(vx_id);
            callback(vx_id, file_name);
        }
        );
}
        
function import_placeholder_item (item_id, file_name) {
    var vidi_uri = VIDI_IMPORT_PATH + file_name;
    console.log(vidi_uri);
    request.post(VIDI_URL + '/import/placeholder/' +
            item_id + '/container')
        .auth('admin', 'admin')
        .query({'uri': vidi_uri})
        .set('Accept', 'application/json')
        .end(function (err, res) {
        }
        );
}

import_placeholder(import_placeholder_item, 'Beach.jpg');
