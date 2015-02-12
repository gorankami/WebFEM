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

//$(window).load(function () {
//    // executes when complete page is fully loaded, including all frames, objects and images
//    alert("window is loaded");
//});

//Globals are upper case
var renderer = null,
    legend = null,
    models = [],
    colorMaps = [],
    loadPass = 0,
    GL = null;

$(function () {
    var canvas3d = $('#canvas3d')[0];
    try {
        GL = canvas3d.getContext("webgl") || canvas3d.getContext("experimental-webgl");
    } catch (e) {
    }
    if (!GL) {
        alert("Unfortunately, your browser does not support Webgl.");
        return;
    }

    //inits canvases
    legend = new Legend($('#canvas2d')[0]);
    renderer = new Renderer(canvas3d);
    renderer.resize(window.innerWidth, window.innerHeight);
    renderer.start();

    //fills init data
    SERVICES.getInitData(function (data) {
        //Models = data.Models;
        $.each(data.models, function (i, model) {
            models[model.id] = {
                name: model.name,
                numVertices: model.numVertices,
                numIndices: model.numIndices,
                minX: model.minX,
                minY: model.minY,
                minZ: model.minZ,
                maxX: model.maxX,
                maxY: model.maxY,
                maxZ: model.maxZ,
                vertexData: [],
                indexData: [],
                contours: [],
                loaded: false
            };
            $.each(model.contours, function (i, contour) {
                models[model.id].contours[contour.id] = {
                    name: contour.name,
                    minValue: contour.minValue,
                    maxValue: contour.maxValue,
                    numValues: contour.minValues,
                    valueData: [],
                    loaded: false
                };
            });
        });
        fillCombo("#cbModels", models);

        $.each(data.colorMaps, function (i, colorMap) {
            colorMap.data = CMU.parseSplittableColorMap(colorMap.data);
            colorMaps[colorMap.id] = colorMap;
        });
        fillCombo("#cbColorMaps", colorMaps);
    });

    //events
    $(window).resize(function () {
        renderer.resize(document.body.clientWidth, document.body.clientHeight);
    });
    
    $('#cbModels').change(cbModels_change);
    $('#cbColorMaps').change(cbColorMaps_change);
    $('#btnLoad').click(btnLoad_click);
    $('#btnReset').click(function () {
        renderer.resetTransformations();
    });
    $('#toggleSidebar').click(function () {
        $('ul').toggle();
        $('#toggleSidebar').toggleClass("arrow-up arrow-down");
    });
    //disable context menu
    renderer.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);

    //mouse events
    renderer.canvas.addEventListener('mousedown', mouseDown, false);
    renderer.canvas.addEventListener('mousewheel', mouseWheel, false);
    renderer.canvas.addEventListener('DOMMouseScroll', mouseWheel, false); // firefox

    //touch events
    //renderer.canvas.addEventListener('touchstart', touchStart, false);
    //renderer.canvas.addEventListener('touchmove', touchMove, false);
    //renderer.canvas.addEventListener('touchend', touchEnd, false);

    //keyboard events
    document.addEventListener("keydown", keyDown, false);
    
});


function mouseDown(event) {
    event.preventDefault();
    var rect = renderer.canvas.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.button === 0) {
        renderer.controls.startRotate(coords);
    }
    else if (event.button === 2) {
        renderer.controls.startPan(coords);
    }

    //add events to detect while mouse down
    renderer.canvas.addEventListener('mousemove', mouseMove, false);
    renderer.canvas.addEventListener('mouseup', mouseOut, false);
    renderer.canvas.addEventListener('mouseout', mouseOut, false);
}

function mouseMove(event) {
    event.preventDefault();
    var rect = renderer.canvas.getBoundingClientRect();
    var coords = [event.clientX - rect.left, event.clientY - rect.top];

    if (event.button === 0) {
        renderer.controls.doRotate(coords);
    }
    else if (event.button === 2) {
        renderer.controls.doPan(coords);
    }
}

function mouseOut() {
    renderer.canvas.removeEventListener('mousemove', mouseMove, false);
    renderer.canvas.removeEventListener('mouseup', mouseOut, false);
    renderer.canvas.removeEventListener('mouseout', mouseOut, false);
}

function mouseWheel(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
        renderer.controls.doZoom(event.wheelDelta);
    } else if (event.detail !== undefined) { // Firefox
        renderer.controls.doZoom(-event.detail);
    }
}

function keyDown(e) {
    if (!renderer.modelLoaded) return;
    
    switch (e.which) {
        case 65: // left
            renderer.controls.startPan([0.0, 0.0]);
            renderer.controls.doPan([-5, 0]);
            break;
        case 68: // right
            renderer.controls.startPan([0.0, 0.0]);
            renderer.controls.doPan([5, 0]);
            break;
        case 87: // up
            renderer.controls.startPan([0.0, 0.0]);
            renderer.controls.doPan([0, -5]);
            break;
        case 83: // down
            renderer.controls.startPan([0.0, 0.0]);
            renderer.controls.doPan([0, 5]);
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

    CMU.reset(renderer.minPropValue, renderer.maxPropValue, colorMaps[mapId].data);
    legend.reset(0, 0);
}

function btnLoad_click() {
    var modelId = $('#cbModels').find('option:selected').val();
    var propertyId = $('#cbProperties').find('option:selected').val();

    renderer.clearScene(['mesh', 'cube', 'wireframe']);
    loadModel(modelId, propertyId, function () {
        legend.reset(renderer.minValue, renderer.maxValue);
    }, function (err) {
        //on error
        alert(err);
        legend.reset(0, 0);
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

function loadModel(geometryId, contourId, onDone, onError) {
    if (!models[geometryId].loaded) {
        if (loadPass >= 1) {
            onError.call("Error loading model");
            return;
        }
        SERVICES.getGeometryData(geometryId, function (data) {
            loadPass++;
            models[geometryId].vertexData = data.vertexData;
            models[geometryId].indexData = data.indexData;
            models[geometryId].loaded = true;
            loadModel(geometryId, contourId, onDone, onError);
        });
    } else {
        if (!models[geometryId].contours[contourId].loaded) {
            if (loadPass >= 2) {
                onError.call("Error loading model properties");
                return;
            }
            SERVICES.getContourData(geometryId, contourId, function (data) {
                loadPass++;
                models[geometryId].contours[contourId].valueData = data;
                models[geometryId].contours[contourId].loaded = true;
                loadModel(geometryId, contourId, onDone, onError);
            });
        } else {
            loadPass = 0;
            renderer.displayModel(geometryId, contourId);
            onDone.call();
        }
    }
}

/*
 * binds an function to a scope in which it will be running, useful on events
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}