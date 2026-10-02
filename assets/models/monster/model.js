(function (global) {
  global.createBlackMazeMonsterModel = function (THREE) {
    var model = new THREE.Group();
    model.userData.blackMazeMonsterModel = true;

    var resources = [];
    var sphere = new THREE.SphereGeometry(1, 24, 18);
    resources.push(sphere);

    function material(color, shininess) {
      var result = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0x52666a,
        shininess: shininess || 28
      });
      resources.push(result);
      return result;
    }

    function ellipsoid(mat, x, y, z, sx, sy, sz) {
      var mesh = new THREE.Mesh(sphere, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      model.add(mesh);
      return mesh;
    }

    var deepTeal = material(0x178c87);
    var teal = material(0x43c6b7, 34);
    var lightTeal = material(0x78dfd0, 20);
    var cream = material(0xffedc9, 20);
    var coral = material(0xf48670, 26);
    var coralLight = material(0xffb095, 24);
    var white = material(0xffffff, 50);
    var amber = material(0xe7a63d, 40);
    var pupil = material(0x38211c, 50);
    var mouth = material(0x632c3b, 16);
    var tongue = material(0xf47783, 30);

    // The second layer gives the creature a clean dark rim at small size.
    ellipsoid(deepTeal, 0, 0, 0, 0.355, 0.36, 0.295);
    ellipsoid(teal, 0, 0, 0.016, 0.337, 0.342, 0.296);

    var tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.24, -0.19, -0.08),
      new THREE.Vector3(-0.4, -0.2, -0.09),
      new THREE.Vector3(-0.49, -0.08, -0.08),
      new THREE.Vector3(-0.43, 0.04, -0.07),
      new THREE.Vector3(-0.32, 0.03, -0.06)
    ]);
    var tail = new THREE.TubeGeometry(tailCurve, 18, 0.045, 8, false);
    resources.push(tail);
    var tailMesh = new THREE.Mesh(tail, teal);
    tailMesh.castShadow = true;
    model.add(tailMesh);
    ellipsoid(coral, -0.43, -0.08, -0.07, 0.065, 0.07, 0.055);

    var hornGeometry = new THREE.ConeGeometry(0.105, 0.26, 12);
    var innerHornGeometry = new THREE.ConeGeometry(0.055, 0.145, 10);
    var spikeGeometry = new THREE.ConeGeometry(0.055, 0.15, 10);
    resources.push(hornGeometry, innerHornGeometry, spikeGeometry);

    [-1, 1].forEach(function (side) {
      var horn = new THREE.Mesh(hornGeometry, coral);
      horn.position.set(side * 0.21, 0.295, -0.005);
      horn.rotation.z = side * -0.42;
      horn.castShadow = true;
      model.add(horn);

      var innerHorn = new THREE.Mesh(innerHornGeometry, coralLight);
      innerHorn.position.set(side * 0.21, 0.294, 0.048);
      innerHorn.rotation.z = side * -0.42;
      model.add(innerHorn);
    });

    [-0.12, 0, 0.12].forEach(function (x, index) {
      var spike = new THREE.Mesh(spikeGeometry, index === 1 ? lightTeal : teal);
      spike.position.set(x, 0.29, -0.17);
      spike.rotation.z = -x * 1.8;
      model.add(spike);
    });

    ellipsoid(cream, 0, -0.12, 0.273, 0.205, 0.235, 0.066);

    [-1, 1].forEach(function (side) {
      var x = side * 0.108;
      ellipsoid(white, x, 0.088, 0.278, 0.073, 0.09, 0.038);
      ellipsoid(amber, x + side * 0.008, 0.082, 0.312, 0.049, 0.061, 0.027);
      ellipsoid(pupil, x + side * 0.012, 0.079, 0.335, 0.029, 0.041, 0.018);
      ellipsoid(white, x - 0.009, 0.101, 0.349, 0.012, 0.016, 0.009);
      ellipsoid(lightTeal, side * 0.235, -0.018, 0.205, 0.026, 0.035, 0.018);
      ellipsoid(lightTeal, side * 0.26, 0.035, 0.166, 0.018, 0.024, 0.014);
    });

    ellipsoid(teal, 0, -0.018, 0.326, 0.082, 0.052, 0.036);
    ellipsoid(deepTeal, -0.021, -0.018, 0.36, 0.009, 0.012, 0.008);
    ellipsoid(deepTeal, 0.021, -0.018, 0.36, 0.009, 0.012, 0.008);
    ellipsoid(mouth, 0, -0.098, 0.326, 0.066, 0.043, 0.018);
    ellipsoid(tongue, 0, -0.122, 0.342, 0.033, 0.014, 0.009);

    [-1, 1].forEach(function (side) {
      ellipsoid(teal, side * 0.267, -0.17, 0.085, 0.095, 0.074, 0.12);
      ellipsoid(cream, side * 0.285, -0.197, 0.185, 0.027, 0.021, 0.025);
      ellipsoid(cream, side * 0.244, -0.205, 0.184, 0.025, 0.019, 0.024);
      ellipsoid(teal, side * 0.135, -0.306, 0.02, 0.076, 0.055, 0.12);
      ellipsoid(cream, side * 0.16, -0.327, 0.107, 0.034, 0.022, 0.028);
    });

    model.rotation.x = -Math.PI / 2;
    model.userData.blackMazeMonsterResources = resources;
    return model;
  };
})(window);
