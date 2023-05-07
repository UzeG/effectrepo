export const vs = `    
  precision mediump float;

  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 simplePlaneVideoTextureMatrix;

  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMousePosition;
  uniform float uMouseMoveStrength;
  
  
  void main() {
    vec3 vertexPosition = aVertexPosition;
    
    float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));
    
    float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));
    
    float distanceStrength = (0.4 / (distanceFromMouse + 0.4));
    float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;
    
    vertexPosition.z +=  distortionEffect / 30.0;
    vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
    vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
    
    vTextureCoord = (simplePlaneVideoTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = vertexPosition;
  }
`;
export const fs = `
  precision mediump float;
  
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  
  uniform sampler2D simplePlaneVideoTexture;
  
  
  void main() {
    vec4 finalColor = texture2D(simplePlaneVideoTexture, vTextureCoord);
    
    finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
    finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);
    finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
    
    gl_FragColor = finalColor;
  }
`;
