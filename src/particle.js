import * as THREE from 'three';

export class ParticleSystem {
    constructor(count = 1) {
        this.count = count;
        this.geometry = new THREE.BufferGeometry();
        this.particles = new Float32Array(count * 3);

        // Load the texture
        const textureLoader = new THREE.TextureLoader();

        const particleTexture = textureLoader.load('./particles/particle_alpha_map_256x256.png');

        for (let i = 0; i < count; i++) {

            const r = 2.5 + Math.random() * 8; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            this.particles[i * 3] = x;
            this.particles[i * 3 + 1] = y;
            this.particles[i * 3 + 2] = z;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.particles, 3));

        this.material = new THREE.PointsMaterial({
            size: 0.2, 
            sizeAttenuation: true,
            map: particleTexture,
            transparent: true,
            depthWrite: false, 
            blending: THREE.AdditiveBlending,
            color: 0xc482ff, 
            opacity: 1.0 
        });

        this.points = new THREE.Points(this.geometry, this.material);
    }

    update(time) {
        // Slowly rotate the entire particle system
        this.points.rotation.y = time * 0.05;
        this.points.rotation.x = time * 0.025;
    }
}
