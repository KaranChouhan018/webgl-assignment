# WebGL Fresnel Effect

A real-time WebGL demonstration showcasing the Fresnel effect implemented using Three.js with custom shader modifications.

## 🌐 Live Demo

[View Live Demo](https://webgl-assignment-three.vercel.app)

## ✨ Features

- **Custom Fresnel Material** - A custom shader material extending `MeshStandardMaterial` with Fresnel edge glow effect
- **Sigmoid Interpolation** - Smooth, natural S-curve falloff for realistic edge lighting
- **Real-time Controls** - Interactive GUI to adjust Fresnel parameters on the fly
- **Responsive Design** - Adapts to different screen sizes with optimized camera positioning
- **Performance Monitoring** - Built-in FPS stats panel
- **Smooth Loading** - Animated loading bar with fade transition

## 🛠️ Technologies Used

- [Three.js](https://threejs.org/) (v0.160.0) - 3D graphics library
- [lil-gui](https://lil-gui.georgealways.com/) - Lightweight GUI controls
- WebGL Shaders (GLSL) - Custom fragment shader for Fresnel effect
- ES Modules - Modern JavaScript module system

## 📁 Project Structure

```
webgl-assignment/
├── index.html              # Main HTML file with loading screen
├── src/
│   ├── main.js             # Application entry point, scene setup
│   ├── FresnelMaterial.js  # Custom Fresnel shader material class
│   └── ui.js               # GUI controls setup
└── particles/              # Additional assets
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebGL support
- A local development server (e.g., VS Code Live Server, Python http.server)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/KaranChouhan018/webgl-assignment.git
   cd webgl-assignment
   ```

2. Start a local server (choose one):
   ```bash
   # Using Python 3
   python -m http.server 8080

   # Using Node.js http-server
   npx http-server

   # Or use VS Code Live Server extension
   ```

3. Open your browser and navigate to `http://localhost:8080`

## ⚙️ Fresnel Parameters

The custom Fresnel material supports the following adjustable parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `fresnelColor` | Edge glow color | `#00d9ff` (cyan) |
| `fresnelStrength` | Intensity of the effect | `2.0` |
| `edgeAttenuation` | Sigmoid midpoint for falloff | `0.45` |
| `steepness` | Sharpness of the edge transition | `8.0` |
| `enabled` | Toggle Fresnel effect on/off | `true` |

## 🎨 How It Works

The Fresnel effect is achieved by:

1. Calculating the dot product between the view direction and surface normal
2. Inverting the result so edges (grazing angles) have higher values
3. Applying sigmoid interpolation for a smooth, natural S-curve falloff
4. Blending the base material color with the Fresnel edge color

```glsl
float viewDotNormal = abs(dot(viewDir, cNormal));
float edgeFactor = 1.0 - viewDotNormal;
float fresnelFactor = sigmoid(edgeFactor, uEdgeAttenuation, uSteepness);
diffuseColor.rgb = mix(diffuseColor.rgb, uFresnelColor, fresnelFactor);
```

## 📱 Responsive Features

- Automatically adjusts camera distance for mobile devices (< 768px)
- Pixel ratio optimization (capped at 2x for performance)
- Full viewport canvas rendering

## 📝 License

This project is open source and available for educational purposes.

## 👤 Author

**Karan Chouhan** - [@KaranChouhan018](https://github.com/KaranChouhan018)