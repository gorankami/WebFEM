/**
    Copyright 2014 Goran Antic

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


var modelView = null,
    legend = null,
    cmu = null,
    models = [],
    colorMaps = [],
    loadPass = 0,
    gl = null;

function initApp() {
    var canvas3d = document.getElementById('canvas3d');
    try {
        gl = canvas3d.getContext("webgl") || canvas3d.getContext("experimental-webgl");
    } catch (e) {
    }
    if (!gl) {
        alert("Unfortunately, your browser does not support WebGL.");
        return;
    }

    //inits canvases
    cmu = new ColorMapUtility();
    legend = new Legend(document.getElementById('canvas2d'));
    modelView = new ModelViewWebGL(canvas3d, cmu);
    modelView.start();

    //fills init data
    callAjax("Default.aspx/GetPageInitData", null, function (msg) {
        var data = JSON.parse(msg.d);
        $.each(data.models, function (i, v) {
            models[v.id] = {
                name: v.name,
                contours: []
            }
            $.each(v.contours, function (j, c) {
                models[v.id].contours[c.id] = {
                    name: c.name
                }
            });
        });
        fillCombo("#cbModels", models);

        $.each(data.colorMaps, function (i, v) {
            v.data = cmu.parseSplittableColorMap(v.data);
            colorMaps[v.id] = v;
        });
        fillCombo("#cbColorMaps", colorMaps);
    });

    //events
    $(window).resize(function () {
        modelView.resize(window.innerWidth - 200, window.innerHeight - 50);
    });
    $('#loading').hide();
    $('#cbModels').change(cbModels_change);
    $('#cbColorMaps').change(cbColorMaps_change);
    $('#btnLoad').click(btnLoad_click);
    $('#btnReset').click(function () {
        modelView.resetTransformations();
    });
    //disable context menu
    modelView.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);

    //mouse events
    modelView.canvas.addEventListener('mousedown', mouseDown, false);
    modelView.canvas.addEventListener('mousewheel', mouseWheel, false);
    modelView.canvas.addEventListener('DOMMouseScroll', mouseWheel, false); // firefox

    //touch events
    //modelView.canvas.addEventListener('touchstart', touchStart, false);
    //modelView.canvas.addEventListener('touchmove', touchMove, false);
    //modelView.canvas.addEventListener('touchend', touchEnd, false);

    //keyboard events
    document.addEventListener("keydown", keyDown, false);
}

function mouseDown(event) {
    event.preventDefault();
    var rect = modelView.canvas.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.button === 0) {
        modelView.controls.startRotate(coords);
    }
    else if (event.button === 2) {
        modelView.controls.startPan(coords);
    }

    //add events to detect while mouse down
    modelView.canvas.addEventListener('mousemove', mouseMove, false);
    modelView.canvas.addEventListener('mouseup', mouseOut, false);
    modelView.canvas.addEventListener('mouseout', mouseOut, false);
}

function mouseMove(event) {
    event.preventDefault();
    var rect = modelView.canvas.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.button === 0) {
        modelView.controls.doRotate(coords);
    }
    else if (event.button === 2) {
        modelView.controls.doPan(coords);
    }
}

function mouseOut() {
    modelView.canvas.removeEventListener('mousemove', mouseMove, false);
    modelView.canvas.removeEventListener('mouseup', mouseOut, false);
    modelView.canvas.removeEventListener('mouseout', mouseOut, false);
}

function mouseWheel(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
        modelView.controls.doZoom(event.wheelDelta);
    } else if (event.detail !== undefined) { // Firefox
        modelView.controls.doZoom(-event.detail);
    }
}

function keyDown(e) {
    if (!modelView.modelLoaded) return;
    
    switch (e.which) {
        case 65: // left
            modelView.controls.startPan([0.0, 0.0]);
            modelView.controls.doPan([-5, 0]);
            break;
        case 68: // right
            modelView.controls.startPan([0.0, 0.0]);
            modelView.controls.doPan([5, 0]);
            break;
        case 87: // up
            modelView.controls.startPan([0.0, 0.0]);
            modelView.controls.doPan([0, -5]);
            break;
        case 83: // down
            modelView.controls.startPan([0.0, 0.0]);
            modelView.controls.doPan([0, 5]);
            break;
        default: return; // exit this handler for other keys
    }
    e.preventDefault();
}

function cbModels_change() {
    var selectedModel = models[$('#cbModels').find('option:selected').val()];
    var ddProperties = $("#cbProperties");
    ddProperties.empty();
    for (var key in selectedModel["contours"]) {
        var opt = selectedModel["contours"][key];
        var option = $('<option />');
        option.attr('value', key).text(opt.name);
        ddProperties.append(option);
    }
}

function cbColorMaps_change() {
    var mapId = $('#cbColorMaps').find('option:selected').val();

    cmu.reset(modelView.minPropValue, modelView.maxPropValue, colorMaps[mapId].data);
    legend.reset(cmu, 0, 0);
}

function btnLoad_click() {
    $('#statusLabel').text('Loading...');
    $('#loading').show();

    var modelId = $('#cbModels').find('option:selected').val();
    var propertyId = $('#cbProperties').find('option:selected').val();

    modelView.clearScene(['mesh', 'cube', 'wireframe']);
    loadModel(modelId, propertyId, function () {
        //on model loaded
        $('#statusLabel').text('Model loaded');
        $('#loading').hide();
        legend.reset(cmu, modelView.minValue, modelView.maxValue);
    }, function (err) {
        //on error
        alert(err);
        $('#statusLabel').text(err);
        $('#loading').hide();
        legend.reset([[0, "#000000"], 0, 0]);
    });
}

function fillCombo(id, data) {
    var select = $(id);

    for (var key in data) {
        var opt = data[key].name;
        var option = $('<option />');
        option.attr('value', key).text(opt);
        select.append(option);
    }
    select.change();
}

function loadModel(modelId, contourId, onDone, onError) {
    if (!models[modelId].modelData) {
        if (loadPass >= 1) {
            onError.call("Error loading model");
            return;
        }
        callAjax("GetBigData.ashx?modelId=" + modelId, null, function (msg) {
            loadPass++;
            models[modelId].modelData = msg;
            loadModel(modelId, contourId, onDone, onError);
        });
    } else {
        if (!models[modelId]["contours"][contourId].contourData) {
            if (loadPass >= 2) {
                onError.call("Error loading model properties");
                return;
            }
            callAjax("GetBigData.ashx?contourId=" + contourId, null, function (msg) {
                loadPass++;
                models[modelId]["contours"][contourId].contourData = msg;
                loadModel(modelId, contourId, onDone, onError);
            });
        } else {
            loadPass = 0;
            modelView.displayModel(modelId, contourId);
            onDone.call();
        }
    }
}