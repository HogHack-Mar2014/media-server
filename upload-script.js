
var request = require('superagent'),
    expect = require('expect.js'), 
    csv = require('csv'),
    fs = require('fs'),
    VIDI_URL = 'http://10.105.12.44:8080/API', 
    VIDI_IMPORT_PATH = 'file:///opt/vidispine/import/',
    OUR_URL = 'http://10.105.12.22:8080/API', 
    OUR_PATH = 'file:///opt/node/import/',
    API_URL = OUR_URL,
    IMPORT_PATH = OUR_PATH;
    __ = require('underscore')


request.get(API_URL + '/version/')
    .auth('admin', 'admin')
    .end(function (err, res) {
        expect(res.status).to.be(200);
    }
    );


function import_placeholder (callback, file_name) {
    request.post(API_URL + '/import/placeholder/')
        .query({ 'container': '1'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send('{}')
        .end(function (err, res) {
            vx_id = JSON.parse(res.text).id;
            console.log(vx_id);
            callback(vx_id, file_name);
        });
}
        
function import_placeholder_item (item_id, file_name) {
    var vidi_uri = IMPORT_PATH + file_name;
    console.log(vidi_uri);
    request.post(API_URL + '/import/placeholder/' +
            item_id + '/container')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .query({'uri': vidi_uri})
        .set('Accept', 'application/json')
        .send('{}')
        .end(function (err, res) {
            put_item(item_id, file_name);
        });
}


import_placeholder(import_placeholder_item, 'Beach.jpg');

function put_item (item_id, file_name) {
    var metadata = [];
    metadata.push({ name : 'title', value: file_name});
    metadata.push({ name : 'country', value: random_choice(countries)});
    metadata.push({ name : 'created', value: random_choice(author)});
    metadata.push({ name : 'expiry-date', value: random_choice(days)});
    
    request.put(API_URL + '/item/' + item_id)
        .send(metadata)
        .end(function (err, res) {
        });
}


var files = JSON.parse('{"files": [{"title": "Antelope Canyon.jpg"}, {"title": "Bahamas Aerial.jpg"}, {"title": "Beach.jpg"}, {"title": "Blue Pond.jpg"}, {"title": "Bristle Grass.jpg"}, {"title": "Brushes.jpg"}, {"title": "Circles.jpg"}, {"title": "Ducks on a Misty Pond.jpg"}, {"title": "Eagle & Waterfall.jpg"}, {"title": "Earth Horizon.jpg"}, {"title": "Earth and Moon.jpg"}, {"title": "Elephant.jpg"}, {"title": "Flamingos.jpg"}, {"title": "Floating Ice.jpg"}, {"title": "Floating Leaves.jpg"}, {"title": "Forest in Mist.jpg"}, {"title": "Frog.jpg"}, {"title": "Galaxy.jpg"}, {"title": "Grass Blades.jpg"}, {"title": "Hawaiian Print.jpg"}, {"title": "Isles.jpg"}, {"title": "Lake.jpg"}, {"title": "Lion.jpg"}, {"title": "Milky Way.jpg"}, {"title": "Moon.jpg"}, {"title": "Mt. Fuji.jpg"}, {"title": "Pink Forest.jpg"}, {"title": "Pink Lotus Flower.jpg"}, {"title": "Poppies.jpg"}, {"title": "Red Bells.jpg"}, {"title": "Rice Paddy.jpg"}, {"title": "Shapes.jpg"}, {"title": "Sky.jpg"}, {"title": "Snow.jpg"}, {"title": "Zebras.jpg"}]}')

var countries = ['France', 'UK', 'Germany', 'USA', 'Poland'];
var days = ['2012/04/15', '2014/12/23', '2013/11/18'];
var author = ['Greg', 'Karol', 'Tomasz', 'Michal'];

function random_choice (a_list) {
    var i = ~~(Math.random() * a_list.length);
    return a_list[i];
}


var import_file = function (x) {
    file_name = x.title;
    import_placeholder(import_placeholder_item, file_name);
};

//__.map(files.files, import_file);
__.map(files.files, function(e, i) {
    setTimeout(function() {
        import_file(e);
    }, i * 1000);
});
