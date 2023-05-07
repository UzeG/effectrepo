const vs =
    "\n        precision mediump float;\n\n        // default mandatory variables\n        attribute vec3 aVertexPosition;\n        attribute vec2 aTextureCoord;\n\n        uniform mat4 uMVMatrix;\n        uniform mat4 uPMatrix;\n        \n        // our texture matrix uniform\n        uniform mat4 simplePlaneVideoTextureMatrix;\n\n        // custom variables\n        varying vec3 vVertexPosition;\n        varying vec2 vTextureCoord;\n\n        uniform float uTime;\n        uniform vec2 uResolution;\n        uniform vec2 uMousePosition;\n        uniform float uMouseMoveStrength;\n\n\n        void main() {\n\n            vec3 vertexPosition = aVertexPosition;\n\n            // get the distance between our vertex and the mouse position\n            float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));\n\n            // calculate our wave effect\n            float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));\n\n            // attenuate the effect based on mouse distance\n            float distanceStrength = (0.4 / (distanceFromMouse + 0.4));\n\n            // calculate our distortion effect\n            float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;\n\n            // apply it to our vertex position\n            vertexPosition.z +=  distortionEffect / 30.0;\n            vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));\n            vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);\n\n            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);\n\n            // varyings\n            vTextureCoord = (simplePlaneVideoTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n            vVertexPosition = vertexPosition;\n        }\n    ",
  fs =
    "\n        precision mediump float;\n\n        varying vec3 vVertexPosition;\n        varying vec2 vTextureCoord;\n\n        uniform sampler2D simplePlaneVideoTexture;\n\n        void main() {\n            // apply our texture\n            vec4 finalColor = texture2D(simplePlaneVideoTexture, vTextureCoord);\n\n            // fake shadows based on vertex position along Z axis\n            finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);\n            // fake lights based on vertex position along Z axis\n            finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);\n\n            // handling premultiplied alpha (useful if we were using a png with transparency)\n            finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);\n\n            gl_FragColor = finalColor;\n        }\n    ";
