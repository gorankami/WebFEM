var SERVICES = (function () {
    return {
        getInitData: function (fsuccess) {
            $.getJSON("/initdata", fsuccess);
        },
        getGeometryData: function (geometryId, fsuccess) {
            $.getJSON("/geometry/" + geometryId, fsuccess);
            //callService(getModelDataUrl + "?modelId=" + modelId, fsuccess);
        },
        getContourData: function (geometryId, contourId, fsuccess) {
            $.getJSON("/geometry/" + geometryId + "/" + contourId, fsuccess);
            //callService(getModelDataUrl + "?contourId=" + contourId, fsuccess);
        }
    }
})();