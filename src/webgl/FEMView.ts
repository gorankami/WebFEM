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
import { vec3 } from "gl-matrix";
import { Mesh } from "../Mesh";
import Camera from "./Camera";
import Renderer from "./Renderer";
import TransformationController from "./TransformationController";

export default class FEMView {
  private cvsFEM: HTMLCanvasElement;
  private camera: Camera;
  private renderer: Renderer;

  public transformationController: TransformationController;
  public zoomSpeed: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.cvsFEM = canvas;
    this.camera = new Camera(
      45,
      this.cvsFEM.width / this.cvsFEM.height,
      1,
      100.0,
      vec3.fromValues(0, 0, -10)
    );
    this.transformationController = new TransformationController(
      this.cvsFEM,
      this.camera
    );
    this.renderer = new Renderer();
    this.resize(window.innerWidth, window.innerHeight);
    this.initEvents();
    this.animate();
  }

  initEvents() {
    //events
    window.addEventListener("resize", () =>
      this.resize(document.body.clientWidth, document.body.clientHeight)
    );

    //disable context menu
    this.cvsFEM.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    //mouse events
    const mouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const rect = this.cvsFEM.getBoundingClientRect();
      const coords = [event.clientX - rect.left, event.clientY - rect.top];

      if (event.buttons === 1) {
        this.transformationController.doRotate(coords);
      } else if (event.buttons === 2) {
        this.transformationController.doPan(coords);
      }

      requestAnimationFrame(this.animate.bind(this));
    };

    const mouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const rect = this.cvsFEM.getBoundingClientRect();
      const coords = [event.clientX - rect.left, event.clientY - rect.top];

      if (event.buttons === 1) {
        this.transformationController.startRotate(coords);
      } else if (event.buttons === 2) {
        this.transformationController.startPan(coords);
      }

      //add events to detect while mouse down
      this.cvsFEM.addEventListener("mousemove", mouseMove, false);
      this.cvsFEM.addEventListener("mouseup", mouseOut, false);
      this.cvsFEM.addEventListener("mouseout", mouseOut, false);

      requestAnimationFrame(this.animate.bind(this));
    };

    const mouseOut = () => {
      this.cvsFEM.removeEventListener("mousemove", mouseMove, false);
      this.cvsFEM.removeEventListener("mouseup", mouseOut, false);
      this.cvsFEM.removeEventListener("mouseout", mouseOut, false);

      requestAnimationFrame(this.animate.bind(this));
    };

    const mouseWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.deltaY !== undefined) {
        // WebKit / Opera / Explorer 9
        this.transformationController.doZoom(event.deltaY);
      } else if (event.detail !== undefined) {
        // Firefox
        this.transformationController.doZoom(-event.detail);
      }

      requestAnimationFrame(this.animate.bind(this));
    };

    this.cvsFEM.addEventListener("mousedown", mouseDown, false);
    this.cvsFEM.addEventListener("wheel", mouseWheel, false);
  }

  resize(width: number, height: number) {
    this.cvsFEM.width = width;
    this.cvsFEM.height = height;
    this.transformationController.camera.changePerspective(width, height);

    requestAnimationFrame(this.animate.bind(this));
  }

  public draw(mesh: Mesh) {
    this.renderer.prepare(mesh);
    requestAnimationFrame(this.animate.bind(this));
  }

  unload() {
    this.renderer.modelLoaded = false;
  }

  animate() {
    this.transformationController.update();
    this.renderer.render(
      this.transformationController.camera,
      this.cvsFEM.width,
      this.cvsFEM.height,
      this.transformationController.position,
      this.transformationController.rotation
    );
    //  this.transformationController.position = [0, 0, 0]; this.transformationController.rotation = [0, 0];
  }

  recalibrateCamera(mesh: Mesh) {
    const maxFrontSize = Math.max(mesh.maxX - mesh.minX, mesh.maxY - mesh.minY);
    const position = vec3.fromValues(
      -mesh.maxX + (mesh.maxX - mesh.minX) / 2,
      -mesh.maxY + (mesh.maxY - mesh.minY) / 2,
      mesh.minZ - maxFrontSize * 2
    );
    const pivot = vec3.fromValues(
      mesh.maxX - (mesh.maxX - mesh.minX) / 2,
      mesh.maxY - (mesh.maxY - mesh.minY) / 2,
      mesh.maxZ - (mesh.maxZ - mesh.minZ) / 2
    );
    const nearPlane = maxFrontSize / 100.0;
    const farPlane = maxFrontSize * 10;
    this.camera.recalibrate(nearPlane, farPlane, position, pivot);

    this.zoomSpeed = maxFrontSize / 10;
  }
}
