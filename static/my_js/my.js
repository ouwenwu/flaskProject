function begin_run(){
    getMedia()
    //获得video摄像头区域
    let video = document.getElementById("video");
    function getMedia() {
        let constraints = {
            video: {facingMode: "environment" ,width: 500, height: 500},
            audio: false
        };
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise.then(function (MediaStream) {
            video.srcObject = MediaStream;
            console.log(MediaStream)
            video.play();
            takePhoto()
        }).catch(function (PermissionDeniedError) {
            console.log(PermissionDeniedError);
        })
    }
    function takePhoto() {
        //获得Canvas对象
        // console.log(video.clientWidth)
        // console.log(video.clientHeight)
        let canvas1 = document.createElement("canvas")
        canvas1.width = video.clientWidth
        canvas1.height = video.clientHeight
        let ctx1 = canvas1.getContext('2d')
        ctx1.drawImage(video,0,0,video.clientWidth,video.clientHeight)
        $.ajax({
            url:"https://api-test.app.wshunli.cc//upLoadImg",
            type:"POST",
            data:{"base64":canvas1.toDataURL("image/jpeg",1.0)},
            success:function (res){
                requestAnimationFrame(takePhoto);
            }
        })
    }
}

function getLocation(){
    var image_binary_data;
    var pureCoverage = true;
        // if this is just a coverage or a group of them, disable a few items,
        // and default to jpeg format
        var format = 'image/png';
        var bounds = [3.943383, 50.616949,
                    21.118383, 69.406949];
        if (pureCoverage) {
            format = "image/jpeg";
        }
        //加载wms geotiff图片
        var untiled = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          ratio: 1,
          // url: 'http://10.100.12.8:8080/geoserver/oww/wms',
          url: 'https://ar-test.app.wshunli.cc:443/geoserver/anboar/wms',
          params: {'FORMAT': format,
              'VERSION': '1.1.1',
                "STYLES": '',
                "LAYERS": 'anboar:qunlou_xd',
                "exceptions": 'application/vnd.ogc.se_inimage',
          }
        })
      });
        var tiled = new ol.layer.Tile({
        visible: false,
        source: new ol.source.TileWMS({
          url: 'https://ar-test.app.wshunli.cc:443/geoserver/anboar/wms',
          params: {'FORMAT': format,
              'VERSION': '1.1.1',
              tiled: true,
              "STYLES": '',
              "LAYERS": 'anboar:qunlou_xd',
              "exceptions": 'application/vnd.ogc.se_inimage',
              tilesOrigin: 3.943383 + "," + 50.616949
          }
        })
      });


        var projection = new ol.proj.Projection({
            code: 'EPSG:404000',
            units: 'degrees',
            global: false
        });
        var map = new ol.Map({
            target: 'map',
            layers: [
                untiled,
                tiled,
            ],
            view: new ol.View({
                projection: projection
            })
        });
    map.getView().fit(bounds, map.getSize());

    function addPoint(coordinate, map){
        var features = [new ol.Feature({geometry: new ol.geom.Point(coordinate)})]
         var pointLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color:'#fff'
                    }),
                    fill: new ol.style.Fill({
                        color:'#f00'
                    })
                })
            })
        })
        map.addLayer(pointLayer)
        var arr = map.getLayers().array_
        console.log(arr)

    }
    function addLine(lineData, map){
        //画线
        var line_features = []
        line_features[0] = new ol.Feature({
            geometry: new ol.geom.LineString(lineData)
        })
        var lineLayer = new ol.layer.Vector({
            source:new ol.source.Vector({
                features:line_features
            })
        })
        map.addLayer(lineLayer)
        map.getView().fit(bounds, map.getSize());
    }

    let video = document.getElementById("video");
    getMedia()
    function getMedia() {
        let constraints = {
            video: {facingMode: "environment" ,width: 500, height: 500},
            audio: false
        };
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise.then(function (MediaStream) {
            video.srcObject = MediaStream;
            console.log(MediaStream)
            video.play();
            // takePhoto()
            // addPoint([5.6919, 60.776], map)
        }).catch(function (PermissionDeniedError) {
            console.log(PermissionDeniedError);
        })
    }

    function takePhoto() {
        let canvas1 = document.createElement("canvas")
        canvas1.width = video.clientWidth
        canvas1.height = video.clientHeight
        let ctx1 = canvas1.getContext('2d')
        ctx1.drawImage(video,0,0,video.clientWidth,video.clientHeight)

        var image_base64 = canvas1.toDataURL()

        // const el = document.createElement('a');
        // el.href = canvas1.toDataURL('image/jpeg',1.0);
        // el.download = '1.jpeg';
        // el.click()
        // el.remove()
        //
        var content_type = image_base64.substring(5,image_base64.indexOf(';'))
        var content = image_base64.substring(image_base64.indexOf(',')+1)
        var img_decoded_base64 = atob(content)
        var img_decoded_len = img_decoded_base64.length
        image_binary_data = new ArrayBuffer(img_decoded_len)
        var u8arr = new Uint8Array(img_decoded_len);
        while (img_decoded_len--) {
            u8arr[img_decoded_len] = img_decoded_base64.charCodeAt(img_decoded_len);
        }
        image_binary_data = new Blob([u8arr],{ type: 'image/jpeg' })
        // let url = URL.createObjectURL(image_binary_data)
        // let a = document.createElement('a')
        // a.setAttribute("href", url);
        // a.setAttribute("download","1.jpeg")
        // a.click()
        // a.remove()
        _vise_extract_features()
        // $.ajax({
        //     url:"https://api-test.app.wshunli.cc//upLoadImg",
        //     type:"POST",
        //     data:{"base64":canvas1.toDataURL("image/jpeg",1.0)},
        //     success:function (res){
        //         coordinate = [res.data.x, res.data.y]
        //         addPoint(coordinate, map)
        //         var lineData = [[10,56],[11,56],[11,57]]
        //         addLine(lineData, map)
        //         console.log(res)
        //         // requestAnimationFrame(takePhoto);
        //     }
        // })
    }

    var transToFile = async(blob, fileName, fileType) => {
        return new window.File([blob], fileName, {type: fileType})
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
        xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/qunlou_floor3/_extract_image_features');
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.send(image_binary_data);

    }
    function _vise_search_features(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = "aplication/json";
        xhr.addEventListener('load', function(e) {
            if (xhr.status === 200){
                _vise_external_search = JSON.parse(this.response);
                console.log(_vise_external_search["RESULT"])
            }
          });
          xhr.addEventListener('timeout', function(e) {
            console.log('Timeout waiting for response from server');
          });
          xhr.addEventListener('error', function(e) {
            console.log('Error waiting for response from server');
          });
          xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/qunlou_floor3/_search_using_features');
          xhr.send(selected_file_features);

    }
}
let base64;
function upLoadImg() {
    document.querySelector('#file').onchange = function (e) {
        console.log("im=mage")
        console.log(this.files.length)
        selected_file = e.target.files[0];
        console.log(selected_file)

        var reader = new FileReader();
        reader.onload = function (e) { //当文件加载完成后调用
            //我们可以看到文件转为Base64后的格式
            console.log(e.target.result); //e.target.resul  就是我们需要的base64 ！！！
            base64 = e.target.result
            _vise_extract_features()
        }
        if (selected_file) {
            reader.readAsDataURL(selected_file);
        }
    }
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
    xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/qunlou_floor3/_extract_image_features');
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
            var fileNameList = {}
            for(var i=0;i<_vise_external_search["RESULT"].length;i++){
                if(_vise_external_search["RESULT"][i]["score"]>100){
                    fileNameList[i] = {}
                    fileNameList[i]["name"] = _vise_external_search["RESULT"][i]["filename"]
                }
            }
            $.ajax({
                url: "https://api-test.app.wshunli.cc//upLoadImg",
                type: "POST",
                data: {"base64": base64,"image":JSON.stringify(fileNameList)},
                timeout: 100000,
                success: function (res) {
                    coordinate = [res.data.x, res.data.y]
                    addPoint(coordinate, map)
                    var lineData = [[10, 56], [11, 56], [11, 57]]
                    addLine(lineData, map)
                    console.log(res)
                    // requestAnimationFrame(takePhoto);
                }
            })
        }
      });
      xhr.addEventListener('timeout', function(e) {
        console.log('Timeout waiting for response from server');
      });
      xhr.addEventListener('error', function(e) {
        console.log('Error waiting for response from server');
      });
      xhr.open('POST', 'https://ar-test.app.wshunli.cc:443/qunlou_floor3/_search_using_features');
      xhr.send(selected_file_features);

}





