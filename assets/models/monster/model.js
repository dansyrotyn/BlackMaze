(function (global) {
  var modeKey = "blackmaze-monster-debug-mode-v2";
  var debugMode = global.blackMazeMonsterDebugMode;
  try {
    if (!debugMode) debugMode = global.localStorage.getItem(modeKey);
  } catch (_) {}
  if (["camera", "movement", "sprite"].indexOf(debugMode) === -1) debugMode = "movement";
  global.blackMazeMonsterDebugMode = debugMode;

  // Skin numbers are one-based in the catalog: 2, 5, 8, ... are the 3D skins.
  global.isBlackMaze3DSkinIndex = function (skinIndex) {
    var index = Number(skinIndex);
    return Number.isInteger(index) && index >= 1 && (index - 1) % 3 === 0;
  };

  var designs = [
    { name: "Tide", outline: 0x075753, body: 0x178c87, light: 0x43c6b7, shine: 0x78dfd0, belly: 0xffedc9, accent: 0xf48670, accentLight: 0xffb095, eye: 0xe7a63d, pupil: 0x38211c, mouth: 0x632c3b, tongue: 0xf47783, style: "horns", bodyForm: "sphere", shape: [1, 1, 1] },
    { name: "Ember", outline: 0x742719, body: 0xc9442f, light: 0xf16b3b, shine: 0xffa34d, belly: 0xffdf9e, accent: 0x7b2731, accentLight: 0xffd06a, eye: 0xf4c74d, pupil: 0x321c23, mouth: 0x612333, tongue: 0xff8290, style: "flame", bodyForm: "cone", shape: [1.06, 0.96, 0.96] },
    { name: "Moss", outline: 0x274e32, body: 0x397a47, light: 0x75b957, shine: 0xb6dc75, belly: 0xffe6b2, accent: 0x87aa4b, accentLight: 0xd0e87d, eye: 0xa9d8ef, pupil: 0x213d32, mouth: 0x633b3a, tongue: 0xe88e8b, style: "leaf", bodyForm: "dodecahedron", shape: [1.04, 1.02, 0.94] },
    { name: "Glacier", outline: 0x244d7c, body: 0x579acb, light: 0x8ad9f1, shine: 0xd0f7ff, belly: 0xf3fbff, accent: 0x6481dc, accentLight: 0xc1caff, eye: 0x77dff2, pupil: 0x183b61, mouth: 0x4e4772, tongue: 0xec8fac, style: "crystal", bodyForm: "octahedron", shape: [0.98, 1.06, 0.94] },
    { name: "Amethyst", outline: 0x48265f, body: 0x7850a8, light: 0xa67bdd, shine: 0xd7b6ff, belly: 0xffe3f3, accent: 0x4ab7b0, accentLight: 0x9af3df, eye: 0xffcc73, pupil: 0x36254a, mouth: 0x542c55, tongue: 0xff86b9, style: "crystal", bodyForm: "icosahedron", shape: [0.94, 1.08, 1] },
    { name: "Sol", outline: 0x7d4312, body: 0xe58a21, light: 0xffbc3d, shine: 0xffe478, belly: 0xfff0c0, accent: 0xb74e25, accentLight: 0xffdd6a, eye: 0x9f5532, pupil: 0x392331, mouth: 0x663047, tongue: 0xf5848b, style: "mane", bodyForm: "cylinder", shape: [1.08, 0.96, 0.96] },
    { name: "Orbit", outline: 0x263060, body: 0x414db2, light: 0x6878ed, shine: 0xb2c0ff, belly: 0xe4edff, accent: 0x24b9bf, accentLight: 0x93ffff, eye: 0x6ff1f1, pupil: 0x202849, mouth: 0x432c65, tongue: 0xe884c9, style: "antenna", bodyForm: "ring", shape: [0.96, 1.05, 1.02] },
    { name: "Coral", outline: 0x783548, body: 0xc94e68, light: 0xf48287, shine: 0xffc5a6, belly: 0xffefd0, accent: 0x5a9cbb, accentLight: 0x9de6ed, eye: 0xf6cc75, pupil: 0x512b3a, mouth: 0x702f4a, tongue: 0xff9caa, style: "fin", bodyForm: "shell", shape: [1.08, 0.92, 1.02] },
    { name: "Jelly", outline: 0x503a84, body: 0x805cc5, light: 0xb08bec, shine: 0xe1c9ff, belly: 0xffe4fd, accent: 0x44c6cc, accentLight: 0xa0ffff, eye: 0xffdf78, pupil: 0x392c5a, mouth: 0x573c78, tongue: 0xff90ce, style: "jelly", bodyForm: "dome", shape: [1.12, 0.9, 1.08] },
    { name: "Volt", outline: 0x34500b, body: 0x79a820, light: 0xb8dc38, shine: 0xeaff72, belly: 0xffefb9, accent: 0x513287, accentLight: 0xbe8cff, eye: 0xffed8c, pupil: 0x303218, mouth: 0x554052, tongue: 0xf77da5, style: "spikes", bodyForm: "tetrahedron", shape: [1, 1.02, 0.96] },
    { name: "Obsidian", outline: 0x202b3d, body: 0x3e4b61, light: 0x65758a, shine: 0xa9c0d1, belly: 0xdce5e7, accent: 0xe64e55, accentLight: 0xffa36e, eye: 0x56e5d0, pupil: 0x172332, mouth: 0x582c47, tongue: 0xff869b, style: "armor", bodyForm: "box", shape: [1.02, 1.02, 0.94] }
  ];

  global.createBlackMazeMonsterModel = function (THREE, skinIndex) {
    var index = Number.isInteger(Number(skinIndex)) ? Number(skinIndex) : 1;
    var slot = Math.max(0, Math.floor((index - 1) / 3));
    // Ten new designs are added after the original. The catalog's last 3D slot
    // wraps to the original design so the every-third-skin rule stays regular.
    var design = designs[slot] || designs[0];
    var model = new THREE.Group();
    model.userData.blackMazeMonsterModel = true;
    model.userData.blackMazeSkinName = design.name;

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

    var outline = material(design.outline, 24);
    var body = material(design.body, 34);
    var light = material(design.light, 38);
    var shine = material(design.shine, 28);
    var belly = material(design.belly, 20);
    var accent = material(design.accent, 26);
    var accentLight = material(design.accentLight, 30);
    var white = material(0xffffff, 50);
    var eye = material(design.eye, 42);
    var pupil = material(design.pupil, 50);
    var mouth = material(design.mouth, 16);
    var tongue = material(design.tongue, 30);
    var shape = design.shape;

    function ellipsoid(mat, x, y, z, sx, sy, sz) {
      var mesh = new THREE.Mesh(sphere, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      model.add(mesh);
      return mesh;
    }

    function cone(mat, x, y, z, radius, height, rotationZ, sides) {
      var geometry = new THREE.ConeGeometry(radius, height, sides || 10);
      resources.push(geometry);
      var mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.z = rotationZ || 0;
      mesh.castShadow = true;
      model.add(mesh);
      return mesh;
    }

    function box(mat, x, y, z, sx, sy, sz, rotationZ) {
      var geometry = new THREE.BoxGeometry(sx, sy, sz);
      resources.push(geometry);
      var mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.z = rotationZ || 0;
      mesh.castShadow = true;
      model.add(mesh);
      return mesh;
    }

    function tube(mat, points, radius) {
      var curve = new THREE.CatmullRomCurve3(points.map(function (point) {
        return new THREE.Vector3(point[0], point[1], point[2]);
      }));
      var geometry = new THREE.TubeGeometry(curve, 16, radius, 8, false);
      resources.push(geometry);
      var mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      model.add(mesh);
      return mesh;
    }

    function createBodyGeometry() {
      if (design.bodyForm === "cone") return new THREE.ConeGeometry(0.37, 0.68, 9);
      if (design.bodyForm === "dodecahedron") return new THREE.DodecahedronGeometry(0.37, 0);
      if (design.bodyForm === "octahedron") return new THREE.OctahedronGeometry(0.39, 0);
      if (design.bodyForm === "icosahedron") return new THREE.IcosahedronGeometry(0.37, 1);
      if (design.bodyForm === "cylinder") return new THREE.CylinderGeometry(0.3, 0.36, 0.65, 12);
      if (design.bodyForm === "ring") return new THREE.TorusGeometry(0.225, 0.105, 9, 20);
      if (design.bodyForm === "shell") {
        return new THREE.LatheGeometry([
          new THREE.Vector2(0, -0.34), new THREE.Vector2(0.2, -0.31),
          new THREE.Vector2(0.33, -0.19), new THREE.Vector2(0.37, 0.02),
          new THREE.Vector2(0.31, 0.24), new THREE.Vector2(0.16, 0.34),
          new THREE.Vector2(0, 0.36)
        ], 16);
      }
      if (design.bodyForm === "dome") return new THREE.SphereGeometry(1, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2);
      if (design.bodyForm === "tetrahedron") return new THREE.TetrahedronGeometry(0.42, 0);
      if (design.bodyForm === "box") return new THREE.BoxGeometry(0.62, 0.6, 0.54);
      if (design.bodyForm === "lathe") {
        return new THREE.LatheGeometry([
          new THREE.Vector2(0, -0.35), new THREE.Vector2(0.24, -0.32),
          new THREE.Vector2(0.34, -0.18), new THREE.Vector2(0.36, 0.12),
          new THREE.Vector2(0.26, 0.3), new THREE.Vector2(0, 0.36)
        ], 16);
      }
      return new THREE.SphereGeometry(1, 24, 18);
    }

    function addBodyLayer(mat, z, inset) {
      var geometry = createBodyGeometry();
      resources.push(geometry);
      var mesh = new THREE.Mesh(geometry, mat);
      var factor = inset ? 0.94 : 1;
      mesh.position.z = z;
      if (design.bodyForm === "sphere" || design.bodyForm === "dome") {
        mesh.scale.set(0.355 * shape[0] * factor, 0.36 * shape[1] * factor, 0.295 * shape[2] * factor);
      } else {
        mesh.scale.set(shape[0] * factor, shape[1] * factor, shape[2] * factor);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      model.add(mesh);
      return mesh;
    }

    // Keep the original rounded silhouette for skin 2; later unlocks use
    // crystal, shell, ring, dome, and mechanical body geometry.
    addBodyLayer(outline, 0, false);
    addBodyLayer(body, 0.016, true);
    if (design.bodyForm === "ring") ellipsoid(body, 0, 0, -0.02, 0.205, 0.23, 0.15);
    if (design.bodyForm === "dome") ellipsoid(body, 0, -0.11, -0.04, 0.3, 0.22, 0.27);
    ellipsoid(belly, 0, -0.12, 0.273, 0.205, 0.235, 0.066);

    [-1, 1].forEach(function (side) {
      var x = side * 0.108;
      ellipsoid(white, x, 0.088, 0.278, 0.073, 0.09, 0.038);
      ellipsoid(eye, x + side * 0.008, 0.082, 0.312, 0.049, 0.061, 0.027);
      ellipsoid(pupil, x + side * 0.012, 0.079, 0.335, 0.029, 0.041, 0.018);
      ellipsoid(white, x - 0.009, 0.101, 0.349, 0.012, 0.016, 0.009);
      ellipsoid(shine, side * 0.235, -0.018, 0.205, 0.026, 0.035, 0.018);
      ellipsoid(shine, side * 0.26, 0.035, 0.166, 0.018, 0.024, 0.014);
      ellipsoid(body, side * 0.267, -0.17, 0.085, 0.095, 0.074, 0.12);
      ellipsoid(belly, side * 0.285, -0.197, 0.185, 0.027, 0.021, 0.025);
      ellipsoid(body, side * 0.135, -0.306, 0.02, 0.076, 0.055, 0.12);
      ellipsoid(belly, side * 0.16, -0.327, 0.107, 0.034, 0.022, 0.028);
    });

    ellipsoid(light, 0, -0.018, 0.326, 0.082, 0.052, 0.036);
    ellipsoid(outline, -0.021, -0.018, 0.36, 0.009, 0.012, 0.008);
    ellipsoid(outline, 0.021, -0.018, 0.36, 0.009, 0.012, 0.008);
    ellipsoid(mouth, 0, -0.098, 0.326, 0.066, 0.043, 0.018);
    ellipsoid(tongue, 0, -0.122, 0.342, 0.033, 0.014, 0.009);

    // Each unlock gets its own silhouette detail as well as a new palette.
    if (design.style === "horns" || design.style === "flame" || design.style === "crystal" || design.style === "mane") {
      [-1, 1].forEach(function (side) {
        cone(accent, side * 0.21, 0.295, -0.005, 0.105, 0.26, side * -0.42, 12);
        ellipsoid(accentLight, side * 0.21, 0.294, 0.048, 0.055, 0.07, 0.06);
      });
    }

    if (design.style === "horns") {
      [-0.12, 0, 0.12].forEach(function (x, i) {
        cone(i === 1 ? shine : light, x, 0.29, -0.17, 0.055, 0.15, -x * 1.8, 10);
      });
      tube(light, [[-0.24, -0.19, -0.08], [-0.4, -0.2, -0.09], [-0.49, -0.08, -0.08], [-0.43, 0.04, -0.07], [-0.32, 0.03, -0.06]], 0.045);
      ellipsoid(accent, -0.43, -0.08, -0.07, 0.065, 0.07, 0.055);
    } else if (design.style === "flame") {
      [-0.22, -0.08, 0.08, 0.22].forEach(function (x, i) {
        cone(i % 2 ? accentLight : accent, x, 0.31, -0.18, 0.075, 0.2 + (i % 2) * 0.05, -x, 8);
      });
      tube(accent, [[-0.25, -0.2, -0.1], [-0.45, -0.14, -0.1], [-0.48, 0.02, -0.1], [-0.36, 0.09, -0.1]], 0.052);
    } else if (design.style === "leaf") {
      tube(accent, [[0, 0.15, -0.1], [0, 0.31, -0.1], [0.02, 0.4, -0.1]], 0.022);
      [-1, 1].forEach(function (side) {
        var leaf = ellipsoid(accentLight, side * 0.08, 0.32, -0.1, 0.105, 0.045, 0.035);
        leaf.rotation.z = side * 0.55;
        ellipsoid(light, side * 0.31, 0.02, 0.07, 0.09, 0.045, 0.06).rotation.z = side * 0.7;
      });
      cone(shine, 0, 0.42, -0.1, 0.07, 0.18, 0, 7);
    } else if (design.style === "crystal") {
      [-0.22, -0.08, 0.08, 0.22].forEach(function (x, i) {
        cone(i % 2 ? accentLight : accent, x, 0.31, -0.18, 0.07, 0.23 + (i % 2) * 0.08, -x * 1.5, 6);
      });
      ellipsoid(accentLight, 0, 0.22, 0.27, 0.055, 0.075, 0.04);
    } else if (design.style === "mane") {
      for (var ray = 0; ray < 8; ray++) {
        var angle = ray * Math.PI / 4;
        cone(ray % 2 ? accent : accentLight, Math.cos(angle) * 0.28, Math.sin(angle) * 0.24 + 0.02, -0.12, 0.07, 0.2, -angle, 8);
      }
      tube(accent, [[-0.22, -0.19, -0.12], [-0.4, -0.19, -0.1], [-0.45, -0.04, -0.1]], 0.045);
    } else if (design.style === "antenna") {
      [-0.13, 0.13].forEach(function (side) {
        tube(accent, [[side, 0.22, -0.04], [side * 1.2, 0.39, -0.04], [side * 1.7, 0.44, -0.04]], 0.025);
        ellipsoid(accentLight, side * 0.22, 0.44, -0.04, 0.065, 0.065, 0.065);
      });
      ellipsoid(accent, 0, -0.24, -0.18, 0.28, 0.07, 0.055);
      ellipsoid(accentLight, 0, -0.24, -0.115, 0.2, 0.035, 0.025);
    } else if (design.style === "fin") {
      cone(accent, 0, 0.29, -0.12, 0.14, 0.24, 0, 5);
      [-1, 1].forEach(function (side) {
        var fin = ellipsoid(accentLight, side * 0.32, -0.02, -0.12, 0.14, 0.055, 0.09);
        fin.rotation.z = side * -0.4;
      });
      tube(accent, [[-0.24, -0.17, -0.11], [-0.43, -0.12, -0.1], [-0.49, 0.02, -0.1], [-0.43, 0.16, -0.1]], 0.04);
    } else if (design.style === "jelly") {
      ellipsoid(accent, 0, 0.23, -0.08, 0.24, 0.08, 0.2);
      for (var tentacle = -2; tentacle <= 2; tentacle++) {
        var tx = tentacle * 0.1;
        tube(accentLight, [[tx, -0.18, -0.12], [tx * 1.2, -0.31, -0.12], [tx * 0.8, -0.42, -0.1]], 0.018);
      }
      ellipsoid(shine, 0, 0.23, 0.11, 0.12, 0.025, 0.04);
    } else if (design.style === "spikes") {
      [-0.28, -0.14, 0, 0.14, 0.28].forEach(function (x, i) {
        cone(i % 2 ? accentLight : accent, x, 0.28, -0.16, 0.065, 0.2 + (i % 2) * 0.06, -x, 7);
      });
      [-1, 1].forEach(function (side) {
        ellipsoid(accent, side * 0.31, 0.08, 0.07, 0.06, 0.06, 0.055);
        ellipsoid(accentLight, side * 0.31, 0.08, 0.12, 0.025, 0.025, 0.02);
      });
    } else if (design.style === "armor") {
      box(accent, 0, 0.16, -0.22, 0.38, 0.12, 0.08, 0);
      [-1, 1].forEach(function (side) {
        var plate = box(light, side * 0.2, -0.05, 0.12, 0.14, 0.13, 0.045, side * -0.35);
        ellipsoid(accentLight, side * 0.2, -0.05, 0.15, 0.025, 0.025, 0.014);
      });
      tube(accentLight, [[-0.22, -0.21, -0.18], [-0.42, -0.21, -0.12], [-0.46, -0.08, -0.1]], 0.05);
    }

    model.rotation.order = "YXZ";
    model.rotation.x = -Math.PI / 2;
    model.userData.blackMazeMonsterResources = resources;
    return model;
  };

})(window);
