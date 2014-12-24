<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebApp.Default" %>
<!--
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
-->
<!DOCTYPE html>
<html>
<head runat="server">
    <title>Web FEM</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" href="css/style.css" />
</head>
<body onload="initApp();" >
    <form id="form1" runat="server">
    <div class="grid">
        <div id="header" >
            Select model: 
            <select id="cbModels" style="width: 200px">
            </select>
            Select property values
            <select id="cbProperties" style="width: 300px">
            </select>
            <button id="btnLoad" type="button">Load</button>
            <button id="btnReset" type="button" >Reset</button>&nbsp;&nbsp;
            <img id="loading" src="img/loading.gif" alt="loading..." />
            <span id="statusLabel">Select a model with a property and click "Load" </span>
        </div>
        <div id="sidebar">
            <h3>Legend:</h3>
            <i>Color map:</i><br />
            <select id="cbColorMaps" style="width: 100px">
            </select><br />
            <canvas id="canvas2d" width="150px" height="500px"></canvas>
            <h3>Statistics:</h3>
            Object position:<br/><span id="oPos"></span><br />
            Mouse ray:<br/><span id="mPos"></span><br />

        </div>
        <div id="container-canvas3d">
            <canvas id="canvas3d"></canvas>
        </div>
    </div>
    </form>
    <script src="js/lib/jquery-1.11.1.min.js"></script>
    <script src="js/lib/gl-matrix.js"> </script>
    <script src="js/lib/Color.js"> </script>
            
    <script src="js/Camera.js"> </script>
    <script src="js/ColorMapUtility.js"> </script>
    <script src="js/Common.js"> </script>
    <script src="js/GControls.js"> </script>
    <script src="js/Legend.js"> </script>
    <script src="js/ModelViewWebGL.js"> </script>
    <script src="js/ShaderProgram.js"> </script>
    <script src="js/main.js"></script>
</body>
</html>
