var is_image_resized;
var selected_file_features;
var _vise_external_search;
var image_binary_data;
var selected_file;
var resize_uploaded_image = true;
var selected_filename;
var selected_filesize;
var start;
var end;
document.querySelector('#file').onchange = function (e) {
    console.log("im=mage")
    console.log(this.files.length)
    selected_file = e.target.files[0];
    selected_filename = selected_file.name;
    console.log(selected_filename)
    selected_filesize = selected_file.size;
    console.time(1)
    _vise_extract_features();
}

function _vise_extract_features() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.addEventListener('load', function (e) {
        if (xhr.status === 200){
            selected_file_features = this.response;
            console.log(selected_file_features)
            _vise_search_features();
        }
    });
    xhr.addEventListener('timeout', function (e) {
        console.log('Timeout waiting for response from server');
    });
    xhr.addEventListener('error', function (e) {
        console.log('Error waiting for response from server');
    });
    xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/100MEDIA_2/_extract_image_features');
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.send(selected_file);

}
function _vise_search_features(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "aplication/json";
    xhr.addEventListener('load', function(e) {
        if (xhr.status === 200){
            _vise_external_search = JSON.parse(this.response);
            console.log(_vise_external_search["RESULT"])
            end = Date.now()
            console.timeEnd(1)
        }
      });
      xhr.addEventListener('timeout', function(e) {
        console.log('Timeout waiting for response from server');
      });
      xhr.addEventListener('error', function(e) {
        console.log('Error waiting for response from server');
      });
      xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/100MEDIA_2/_search_using_features');
      xhr.send(selected_file_features);

}

