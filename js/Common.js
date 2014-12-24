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

/*
 * @author Goran Antic
 * the most used utilities for the project
 */
 

/*
 * binds an function to a scope in which it will be running, useful on events
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/*
 * different ajax calls on multiple places made easier
 */
function callAjax(url, data, fsuccess, ferror) {
    if (ferror === undefined) ferror = function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data || {}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: fsuccess,
        error: ferror
    });
}