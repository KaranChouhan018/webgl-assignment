import GUI from 'lil-gui';

export function setupUI(material) {
    const gui = new GUI({ title: 'WebGL Fresnel Effect Settings', width: 300 });


    const state = {
        baseColor: `#${material.color.getHexString()}`,
        roughness: material.roughness,
        metalness: material.metalness,

        fresnelEnabled: material.userData.fresnelParameters.enabled,
        edgeColor: `#${material.userData.fresnelParameters.fresnelColor.getHexString()}`,
        fresnelStrength: material.userData.fresnelParameters.fresnelStrength,
        edgeAttenuation: material.userData.fresnelParameters.edgeAttenuation,
        steepness: material.userData.fresnelParameters.steepness
    };

    // --- Core PBR Properties ---
    const pbrFolder = gui.addFolder('PBR Properties');
    pbrFolder.addColor(state, 'baseColor').name('Base Color (Albedo)').onChange(v => material.color.set(v));
    pbrFolder.add(state, 'roughness', 0, 1, 0.01).name('Roughness').onChange(v => material.roughness = v);
    pbrFolder.add(state, 'metalness', 0, 1, 0.01).name('Metallic').onChange(v => material.metalness = v);

    // --- Custom Fresnel Properties ---
    const fresnelFolder = gui.addFolder('Interactive Controls');

    fresnelFolder.add(state, 'fresnelEnabled').name('Enable/Disable Effect').onChange(v => material.setFresnelEnabled(v));

   
    fresnelFolder.addColor(state, 'edgeColor').name('Edge Color').onChange(v => material.setFresnelColor(v));

    fresnelFolder.add(state, 'fresnelStrength', 0.0, 1.0, 0.01).name(' Fresnel Strength')
        .onChange(v => material.setFresnelStrength(v));

    fresnelFolder.add(state, 'edgeAttenuation', 0.0, 1.0, 0.01).name('Edge Attenuation')
        .onChange(v => material.setEdgeAttenuation(v));

    fresnelFolder.add(state, 'steepness', 1.0, 30.0, 0.1).name('Steepness')
        .onChange(v => material.setSteepness(v));

    pbrFolder.open();
    fresnelFolder.open();


    gui.domElement.style.marginTop = '10px';
    gui.domElement.style.marginRight = '10px';
}
