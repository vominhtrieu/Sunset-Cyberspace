import ExpoTHREE, { THREE } from 'expo-three';
import { TweenMax } from 'gsap';

import Assets from '../Assets';
import Colors from '../constants/Colors';
import Settings from '../constants/Settings';
import randomRange from '../utils/randomRange';
import Node from './Node';

const zRot = Math.PI / 8;

class Collectible extends Node {
  collided = false;
  setupAsync = async () => {
    this.position.x = randomRange(
      -Settings.FLOOR_WIDTH / 2,
      Settings.FLOOR_WIDTH / 2,
    );
    this.position.z = randomRange(
      -Settings.FLOOR_DEPTH / 2,
      Settings.FLOOR_DEPTH / 2,
    );
    const collectibleMaterial = new THREE.MeshPhongMaterial({
      color: Colors.item,
      specular: 0x00ffff,
      emissive: 0x111111,
      shininess: 200,
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: false,
    });
    collectibleMaterial.flatShading = true;

    this.model = await ExpoTHREE.loadAsync(Assets.models['expo.obj']);
    ExpoTHREE.utils.scaleLongestSideToSize(this.model, 200);

    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = collectibleMaterial;
      }
    });
    this.add(this.model);

    this.add(new THREE.PointLight(0x2188ff, 1.2, 900));

    this.runCoolAnimation();
  };

  runCoolAnimation = () => {
    TweenMax.to(this.rotation, 0.3, {
      y: this.rotation.y + Math.PI,
      delay: 1.3,
      onComplete: this.runCoolAnimation,
    });
  };

  update = (delta, time) => {
    this.position.y = Math.sin(time * 6) * 25;

    this.model.rotation.z = Math.sin(time * 8) * zRot;
  };
}

export default Collectible;
