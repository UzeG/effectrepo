import {
  Curtains,
  Plane,
  Vec2,
} from "curtainsjs";
import { vs, fs } from "./_shader"

window.addEventListener("load", () => {
  // Define the mouse position and deltas
  const mousePosition = new Vec2();
  const mouseLastPosition = new Vec2();
  const deltas = {
    max: 0,
    applied: 0,
  };
  // set up our WebGL context and append the canvas to our wrapper
  const curtains = new Curtains({
    container: "canvas",
    pixelRation: Math.min(1.5, window.devicePixelRatio),
  });

  // get our plane element
  const planeElements = document.getElementsByClassName("curtain");
  // create our plane
  const params = {
    vertexShader: vs,
    fragmentShader: fs,
    widthSegments: 20,
    heightSegments: 20,
    uniforms: {
      resolution: {
        name: "uResolution",
        type: "2f",
        value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
      },
      time: {
        name: "uTime",
        type: "1f",
        value: 0
      },
      mousePosition: {
        name: "uMousePosition",
        type: "2f",
        value: mousePosition
      },
      mouseMoveStrength: {
        name: "uMouseMoveStrength",
        type: "1f",
        value: 0,
      }
    }
  };

  const simplePlane = new Plane(curtains, planeElements[0], params);

  simplePlane
    .onReady(() => {
      simplePlane.setPerspective(55);

      const wrapper = document.getElementById("curtainjs");
      wrapper.addEventListener("mousemove", e => {
        handleMovement(e, simplePlane);
      });

      document.body.classList.add("video-started")

      deltas.max = 5;
      simplePlane.playVideos();
    })
    .onRender(() => {
      simplePlane.uniforms.time.value++;

      deltas.applied += (deltas.max - deltas.applied) * .02;
      deltas.max += (0 - deltas.max) * .01;

      simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;
    });

  // handle the mouse move event
  function handleMovement(e, plane) {
    // update mouse last pos
    mouseLastPosition.copy(mousePosition);

    const mouse = new Vec2();

    // touch event
    if (e.targetTouches) {
      mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
    // mouse event
    else {
      mouse.set(e.clientX, e.clientY);
    }

    // lerp the mouse position a bit to smoothen the overall effect
    mousePosition.set(
      curtains.lerp(mousePosition.x, mouse.x, 0.3),
      curtains.lerp(mousePosition.y, mouse.y, 0.3)
    );

    // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
    plane.uniforms.mousePosition.value =
      plane.mouseToPlaneCoords(mousePosition);

    // calculate the mouse move strength
    if (mouseLastPosition.x && mouseLastPosition.y) {
      let delta =
        Math.sqrt(
          Math.pow(mousePosition.x - mouseLastPosition.x, 2) +
          Math.pow(mousePosition.y - mouseLastPosition.y, 2)
        ) / 30;
      delta = Math.min(4, delta);
      // update max delta only if it increased
      if (delta >= deltas.max) {
        deltas.max = delta;
      }
    }
  }
});
