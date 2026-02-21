import * as THREE from 'three';

export class FresnelMaterial extends THREE.MeshStandardMaterial {
    constructor(parameters) {
        super(parameters);

        // Store our custom parameters
        this.userData.fresnelParameters = {
            fresnelColor: new THREE.Color(0x00d9ff),
            fresnelStrength: 2.0,
            edgeAttenuation: 0.45,
            steepness: 8.0,
            enabled: true,
        };

        this.onBeforeCompile = (shader) => {
            // Register custom uniforms
            shader.uniforms.uFresnelColor = { value: this.userData.fresnelParameters.fresnelColor };
            shader.uniforms.uFresnelStrength = { value: this.userData.fresnelParameters.fresnelStrength };
            shader.uniforms.uEdgeAttenuation = { value: this.userData.fresnelParameters.edgeAttenuation };
            shader.uniforms.uSteepness = { value: this.userData.fresnelParameters.steepness };
            shader.uniforms.uFresnelEnabled = { value: this.userData.fresnelParameters.enabled };

            this.userData.shader = shader;

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform vec3 uFresnelColor;
                uniform float uFresnelStrength;
                uniform float uEdgeAttenuation;
                uniform float uSteepness;
                uniform bool uFresnelEnabled;

                // Sigmoid interpolation for natural, S-Curve falloff
                float sigmoid(float x, float midpoint, float steepness) {
                    return 1.0 / (1.0 + exp(-steepness * (x - midpoint)));
                }
                `
            );

           
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `
                #include <color_fragment>
                
                if (uFresnelEnabled) {
                    // Normalize the view direction and normal
                    vec3 viewDir = normalize(-vViewPosition);
                    vec3 cNormal = normalize(vNormal);
                    
                    // Dot product: 1 at center, 0 at grazing angles
                    float viewDotNormal = abs(dot(viewDir, cNormal));
                    
                    // Invert so grazing angles (edges) are 1, and center is 0
                    float edgeFactor = 1.0 - viewDotNormal;
                    
                    // Apply Sigmoid Interpolation
                    float fresnelFactor = sigmoid(edgeFactor, uEdgeAttenuation, uSteepness);
                    
                    // Scale and clamp
                    fresnelFactor = clamp(fresnelFactor * uFresnelStrength, 0.0, 1.0);
                    
                    // Blend the base diffuse color with the Fresnel edge color
                    diffuseColor.rgb = mix(diffuseColor.rgb, uFresnelColor, fresnelFactor);
                }
                `
            );
        };
    }

    // --- Setters for GUI Controllers ---
    setFresnelColor(colorHex) {
        this.userData.fresnelParameters.fresnelColor.set(colorHex);
        if (this.userData.shader) {
            this.userData.shader.uniforms.uFresnelColor.value.copy(this.userData.fresnelParameters.fresnelColor);
        }
    }

    setFresnelStrength(v) {
        this.userData.fresnelParameters.fresnelStrength = v;
        if (this.userData.shader) {
            this.userData.shader.uniforms.uFresnelStrength.value = v;
        }
    }

    setEdgeAttenuation(v) {
        this.userData.fresnelParameters.edgeAttenuation = v;
        if (this.userData.shader) {
            this.userData.shader.uniforms.uEdgeAttenuation.value = v;
        }
    }

    setSteepness(v) {
        this.userData.fresnelParameters.steepness = v;
        if (this.userData.shader) {
            this.userData.shader.uniforms.uSteepness.value = v;
        }
    }

    setFresnelEnabled(v) {
        this.userData.fresnelParameters.enabled = v;
        if (this.userData.shader) {
            this.userData.shader.uniforms.uFresnelEnabled.value = v;
        }
    }
}
