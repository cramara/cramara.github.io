// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Ajout des imports au début du fichier
const loader = new THREE.FontLoader();

// Modification des traductions pour éviter le conflit
const threejsTranslations = {
    fr: {
        welcome: "Bienvenue sur mon portfolio",
        description: "Étudiant en informatique",
        viewProjects: "Voir mes projets",
        learnMore: "En savoir plus",
        projects_title: "Projets",
        projects_desc: "Découvrez mes réalisations",
        about_title: "À propos",
        about_desc: "Mon parcours et mes compétences",
        contact_title: "Contact",
        contact_desc: "Prenez contact avec moi",
        footer: "© 2024 Gabin Joussot-Dubien - Tous droits réservés"
    },
    en: {
        welcome: "Welcome to my portfolio",
        description: "Computer science student",
        viewProjects: "View my projects",
        learnMore: "Learn more",
        projects_title: "Projects",
        projects_desc: "Discover my work",
        about_title: "About",
        about_desc: "My journey and skills",
        contact_title: "Contact",
        contact_desc: "Get in touch",
        footer: "© 2024 Gabin Joussot-Dubien - All rights reserved"
    }
};

// Création d'une variable pour stocker les meshes de texte
let textMeshes = {
    welcome: null,
    description: null,
    projects_title: null,
    projects_desc: null,
    about_title: null,
    about_desc: null,
    contact_title: null,
    contact_desc: null,
    footer: null
};

// Ajout d'une variable pour activer/désactiver les logs de débogage
const DEBUG = true;

// Positions globales pour les quick links
const quickLinksY = -1; // Position Y des quick links
const quickLinksZ = -2; // Position Z des quick links

// Au début du fichier, après les autres constantes
const HEADER_SHOW_THRESHOLD = 100;
let isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
const header = document.querySelector('header');

// Ajouter la classe index-page au body si nous sommes sur la page d'accueil
if (isIndexPage) {
    document.body.classList.add('index-page');
    // Forcer le header à être caché au chargement
    header.style.transform = 'translateY(-100%)';
}

// Ajout des constantes pour la détection mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const MOBILE_SCALE_FACTOR = 0.6; // Facteur d'échelle pour les éléments sur mobile

// Modification de la fonction setRendererSize
function setRendererSize() {
    const container = document.getElementById('animation-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    
    if (isMobile) {
        // Ajuster le champ de vision pour mobile
        camera.fov = 90;
        camera.position.z = 6;
    } else {
        camera.fov = 75;
        camera.position.z = 5;
    }
    
    camera.updateProjectionMatrix();
}

// Création des particules
function createParticles() {
    const particleCount = isMobile ? 1000 : 2000; // Réduire le nombre de particules sur mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position des étoiles en sphère
        const radius = 150;  // Rayon de la sphère d'étoiles
        const theta = Math.random() * Math.PI * 2; // Angle horizontal (0 à 2π)
        const phi = Math.acos((Math.random() * 2) - 1); // Angle vertical (0 à π)
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Couleurs plus vives
        const colorChoice = Math.random();
        if (colorChoice < 0.6) { // 60% blanches
            colors[i] = 1;
            colors[i + 1] = 1;
            colors[i + 2] = 1;
        } else if (colorChoice < 0.9) { // 30% jaunes
            colors[i] = 1;
            colors[i + 1] = 1;
            colors[i + 2] = 0.7;
        } else { // 10% orangées
            colors[i] = 1;
            colors[i + 1] = 0.85;
            colors[i + 2] = 0.4;
        }
        
        // Tailles légèrement plus grandes
        sizes[i/3] = Math.random() * 0.2 + 0.1;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            varying float vBrightness;
            uniform float time;
            
            void main() {
                vColor = color;
                float scintillation = sin(time * 0.5 + position.x * 5.0) * 0.15 + 0.85;
                vBrightness = scintillation;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * scintillation * (1000.0 / -mvPosition.z); // Augmentation du facteur de taille
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vBrightness;
            
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                
                // Création d'un halo plus prononcé
                float center = 1.0 - smoothstep(0.0, 0.2, dist);
                float halo = 1.0 - smoothstep(0.2, 0.5, dist);
                
                // Intensité plus forte au centre
                float intensity = center * 1.5 + halo * 0.5;
                intensity *= vBrightness;
                
                // Ajout d'un effet de brillance
                vec3 finalColor = vColor * (1.0 + intensity * 0.5);
                gl_FragColor = vec4(finalColor, intensity);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    return particles;
}

// Création du soleil
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            
            void main() {
                float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                vec3 sunColor = vec3(1.0, 0.7, 0.3); // Couleur orangée
                vec3 glowColor = mix(sunColor, vec3(1.0, 0.4, 0.0), intensity);
                gl_FragColor = vec4(glowColor, 1.0);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    return new THREE.Mesh(sunGeometry, sunMaterial);
}

// Modification de la fonction createText pour utiliser une police avec support des accents
function createText(text, position, size = 0.2) {
    // Ajuster la taille du texte pour mobile
    const adjustedSize = isMobile ? size * MOBILE_SCALE_FACTOR : size;
    
    return new Promise((resolve) => {
        loader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
            const createGeometry = (text) => new THREE.TextGeometry(text, {
                font: font,
                size: adjustedSize,
                height: 0.05,
                curveSegments: isMobile ? 8 : 12, // Réduire les segments sur mobile
                bevelEnabled: false
            });

            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });

            const geometry = createGeometry(text);
            const textMesh = new THREE.Mesh(geometry, material);
            
            // Ajout de méthodes pour mettre à jour le texte
            textMesh.updateText = (newText) => {
                const newGeometry = createGeometry(newText);
                textMesh.geometry.dispose();
                textMesh.geometry = newGeometry;
                
                // Recentrer le texte
                newGeometry.computeBoundingBox();
                const centerOffset = -0.5 * (newGeometry.boundingBox.max.x - newGeometry.boundingBox.min.x);
                textMesh.position.x = position.x + centerOffset;
            };

            geometry.computeBoundingBox();
            const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            textMesh.position.set(position.x + centerOffset, position.y, position.z);
            
            resolve(textMesh);
        });
    });
}

// Fonction pour créer une zone d'interaction (hit area) sous forme d'un rectangle invisible derrière un texte
function createHitArea(textMesh) {
    textMesh.geometry.computeBoundingBox();
    const bbox = textMesh.geometry.boundingBox;
    // Calcul de la largeur et de la hauteur de la bounding box
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;
    // Marge additionnelle pour faciliter le clic (à ajuster si nécessaire)
    const margin = 0.2;
    // Création d'une géométrie de plan avec la largeur et la hauteur augmentées
    const planeGeometry = new THREE.PlaneGeometry(width + margin, height + margin);
    // Matériau transparent pour le hit area
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, // couleur de debug (vous pouvez la commenter pour masquer)
        opacity: 0,      // rend le rectangle invisible
        transparent: true,
        side: THREE.DoubleSide
    });
    const hitArea = new THREE.Mesh(planeGeometry, planeMaterial);
    
    // Calcul et positionnement au centre du texte (en coordonnées locales)
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    hitArea.position.copy(center);
    
    // Optionnel : vous pouvez ajouter le hitArea comme enfant du texte pour qu'il suive ses transformations
    textMesh.add(hitArea);
    
    return hitArea;
}

// Modification de la fonction updateLanguage
async function updateLanguage(lang) {
    if (DEBUG) {
        console.log("Mise à jour de la langue :", lang);
    }
    if (textMeshes.welcome) {
        textMeshes.welcome.updateText(threejsTranslations[lang].welcome);
        textMeshes.description.updateText(threejsTranslations[lang].description);
        textMeshes.projects_title.updateText(threejsTranslations[lang].projects_title);
        textMeshes.projects_desc.updateText(threejsTranslations[lang].projects_desc);
        textMeshes.about_title.updateText(threejsTranslations[lang].about_title);
        textMeshes.about_desc.updateText(threejsTranslations[lang].about_desc);
        textMeshes.contact_title.updateText(threejsTranslations[lang].contact_title);
        textMeshes.contact_desc.updateText(threejsTranslations[lang].contact_desc);
        textMeshes.footer.updateText(threejsTranslations[lang].footer);
    }
}

// Ajouter ces variables au début du fichier
const hoverEffects = {
    pulse: {
        animate: (mesh, time, isHovered) => {
            if (isHovered) {
                const scale = 1 + Math.sin(time * 8) * 0.1;
                mesh.scale.set(scale, scale, scale);
                // Utiliser la même couleur que le torus au survol
                const hue = (time * 0.1) % 1;
                mesh.material.color.setHSL(hue, 0.8, 0.5);
            } else {
                // Retour à la couleur blanche
                mesh.material.color.setHex(0xffffff);
                mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    },
    rainbow: {
        animate: (mesh, time, isHovered) => {
            if (isHovered) {
                const hue = (time * 0.1) % 1;
                mesh.material.color.setHSL(hue, 0.8, 0.5);
                mesh.scale.setScalar(1.1);
            } else {
                mesh.material.color.setHex(0xffffff);
                mesh.scale.setScalar(1);
            }
        }
    },
};

// Nouvelle fonction handleButtonHover
function handleButtonHover(mesh, isHovered) {
    if (!mesh.userData.originalPosition) {
        mesh.userData.originalPosition = mesh.position.clone();
    }
    
    const effect = mesh.userData.hoverEffect || hoverEffects.wave;
    effect.animate(mesh, performance.now() * 0.001, isHovered);
}

// Initialisation
async function init() {
    const container = document.getElementById('animation-container');
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.95);
    container.appendChild(renderer.domElement);

    // S'assurer que le header est caché au démarrage sur la page d'index
    if (isIndexPage) {
        header.style.transform = 'translateY(-100%)';
    }

    // Ajout des particules en premier (important pour le rendu)
    const particles = createParticles();
    scene.add(particles);

    // Fonction pour obtenir des paramètres aléatoires pour le torus knot
    function getRandomTorusKnotParams() {
        // Générer p et q en évitant certaines combinaisons
        //Exclu les combinaisons 3-3 et 5-5 car font des tirets sur les torus knots
        let p, q;
        do {
            p = Math.floor(2 + Math.random() * 5);  // p entre 2 et 6
            q = Math.floor(1 + Math.random() * 4);  // q entre 1 et 4 
        } while ((p === 3 && q === 3) || (p === 5 && q === 5) || (p === 6 && q === 3));
        
        return {
            radius: 0.4,                    // Rayon principal fixe
            tube: 0.05 + Math.random() * 0.1,  // Épaisseur du tube entre 0.05 et 0.15
            tubularSegments: 200,           // Segments fixes pour la qualité
            radialSegments: 32,             // Segments fixes pour la qualité
            p: p,  // Nombre de tours autour de l'axe
            q: q,  // Nombre de tours autour du tube
            initialHue: Math.random()       // Couleur initiale aléatoire (0-1)
        };
    }

    // Création des torus knots pour chaque quick link
    const torusKnots = {
        'projects.html': createTorusKnot(-4, quickLinksY, quickLinksZ),
        'about.html': createTorusKnot(0, quickLinksY, quickLinksZ),
        'contact.html': createTorusKnot(4, quickLinksY, quickLinksZ)
    };
    
    // Afficher les paramètres de tous les torus dans la console
    if (DEBUG) {
        console.log("%cParamètres des Torus Knots:", "font-weight: bold; color: #00ff00;");
        Object.entries(torusKnots).forEach(([page, torus]) => {
            console.log(`%c${page}:`, "color: #00ff00;", {
                radius: torus.geometry.parameters.radius,
                tube: torus.geometry.parameters.tube,
                tubularSegments: torus.geometry.parameters.tubularSegments,
                radialSegments: torus.geometry.parameters.radialSegments,
                p: torus.geometry.parameters.p,
                q: torus.geometry.parameters.q
            });
        });
    }

    
    // Fonction pour créer un torus knot
    function createTorusKnot(x, y, z) {
        const params = getRandomTorusKnotParams();
        const geometry = new THREE.TorusKnotGeometry(
            params.radius,
            params.tube,
            params.tubularSegments,
            params.radialSegments,
            params.p,
            params.q
        );
        
        const initialColor = new THREE.Color().setHSL(params.initialHue, 0.8, 0.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: initialColor,
            shininess: 100,
            specular: 0x666666,
            emissive: initialColor,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const torusKnot = new THREE.Mesh(geometry, material);
        torusKnot.position.set(x, y + 1.2, z);
        
        // Créer une hit area rectangulaire plus grande qui englobe le torus et le texte
        const hitAreaGeometry = new THREE.PlaneGeometry(2, 4); // Augmenter la taille pour couvrir le torus et le texte
        const hitAreaMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const hitArea = new THREE.Mesh(hitAreaGeometry, hitAreaMaterial);
        // Positionner la hit area entre le torus et le texte
        hitArea.position.set(x, y + 0.6, z); // Ajuster la position Y pour centrer entre le torus et le texte
        hitArea.userData.parentTorus = torusKnot;
        scene.add(hitArea);
        torusKnot.userData.hitArea = hitArea;
        
        scene.add(torusKnot);
        
        if (DEBUG) {
            console.log(`Torus Knot Parameters for ${x}:`, params);
        }
        
        return torusKnot;
    }

    // Création et ajout du soleil
    const sun = createSun();
    scene.add(sun);

    // Création de la lumière attachée au soleil
    const sunLight = new THREE.PointLight(0xF6EAC8, 3, 15, 1); // Augmentation de l'intensité et de la portée
    sun.add(sunLight);

    // Lumière ambiante plus forte
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Augmentation de l'intensité ambiante
    scene.add(ambientLight);

    // Ajout d'une lumière hémisphérique pour un éclairage plus naturel
    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.25);
    scene.add(hemiLight);

    // Position de la caméra
    camera.position.z = 5;

    // Gestion du redimensionnement
    window.addEventListener('resize', setRendererSize);
    setRendererSize();

    // Création du texte 3D avec stockage des références
    textMeshes.welcome = await createText(threejsTranslations.fr.welcome, { x: 0, y: 2, z: -2 }, 0.3);
    textMeshes.description = await createText(threejsTranslations.fr.description, { x: 0, y: 1.5, z: -2 }, 0.2);
    
    // Ajout uniquement des textes essentiels
    scene.add(textMeshes.welcome);
    scene.add(textMeshes.description);

    // Ajout des écouteurs d'événements pour le changement de langue
    document.querySelectorAll('.language-selector a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            updateLanguage(lang);
            
            // Mise à jour de la classe active
            document.querySelectorAll('.language-selector a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Projets
    textMeshes.projects_title = await createText(threejsTranslations.fr.projects_title, { x: -4, y: quickLinksY, z: quickLinksZ }, 0.2);
    textMeshes.projects_desc = await createText(threejsTranslations.fr.projects_desc, { x: -4, y: quickLinksY - 0.3, z: quickLinksZ }, 0.15);
    
    // À propos
    textMeshes.about_title = await createText(threejsTranslations.fr.about_title, { x: 0, y: quickLinksY, z: quickLinksZ }, 0.2);
    textMeshes.about_desc = await createText(threejsTranslations.fr.about_desc, { x: 0, y: quickLinksY - 0.3, z: quickLinksZ }, 0.15);
    
    // Contact
    textMeshes.contact_title = await createText(threejsTranslations.fr.contact_title, { x: 4, y: quickLinksY, z: quickLinksZ }, 0.2);
    textMeshes.contact_desc = await createText(threejsTranslations.fr.contact_desc, { x: 4, y: quickLinksY - 0.3, z: quickLinksZ }, 0.15);
    
    // Footer
    textMeshes.footer = await createText(threejsTranslations.fr.footer, { x: 0, y: -2.5, z: -2 }, 0.15);

    // Ajout des quick links et footer à la scène
    scene.add(textMeshes.projects_title);
    scene.add(textMeshes.projects_desc);
    scene.add(textMeshes.about_title);
    scene.add(textMeshes.about_desc);
    scene.add(textMeshes.contact_title);
    scene.add(textMeshes.contact_desc);
    scene.add(textMeshes.footer);

    // Création des hit areas pour les textes "quick links"
    const quickLinkHitMeshes = {
        'projects.html': createHitArea(textMeshes.projects_title),
        'about.html': createHitArea(textMeshes.about_title),
        'contact.html': createHitArea(textMeshes.contact_title)
    };

    // Dans la création des quick links
    textMeshes.projects_title.userData.hoverEffect = hoverEffects.pulse;
    textMeshes.about_title.userData.hoverEffect = hoverEffects.pulse;
    textMeshes.contact_title.userData.hoverEffect = hoverEffects.pulse;

    // Dans l'événement click, modifier la détection des clics
    window.addEventListener('click', (event) => {
        raycaster.setFromCamera(mouse, camera);
        
        // Récupérer les intersections sur l'ensemble des hit areas et des torus knots
        const allClickableObjects = [
            ...Object.values(quickLinkHitMeshes),
            ...Object.values(torusKnots).map(torus => torus.userData.hitArea)
        ];
        const intersections = raycaster.intersectObjects(allClickableObjects);

        if (DEBUG) {
            console.log("Intersections on click:", intersections);
        }
        if (intersections.length > 0) {
            const hitObject = intersections[0].object;
            let url;
            let meshToAnimate;

            // Vérifier si c'est un torus knot ou une hit area de texte
            if (hitObject.parent && hitObject.parent.type === "Mesh") {
                // C'est une hit area de texte
                const textMesh = hitObject.parent;
                meshToAnimate = textMesh;
                url = Object.entries(quickLinkHitMeshes).find(([_, area]) => area === hitObject)?.[0];
            } else if (hitObject.userData.parentTorus) {
                // C'est une hit area de torus
                meshToAnimate = hitObject.userData.parentTorus;
                url = Object.entries(torusKnots).find(([_, torus]) => torus === hitObject.userData.parentTorus)?.[0];
            }

            if (url && meshToAnimate) {
                if (DEBUG) {
                    console.log("Clicking URL:", url);
                }
                meshToAnimate.scale.setScalar(0.9);
                setTimeout(() => {
                    meshToAnimate.scale.setScalar(1.0);
                    window.location.href = url;
                }, 150);
            }
        }
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        let time = performance.now() * 0.001;
        
        // Mise à jour du raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Détection du survol des hit areas des torus knots et des textes
        const allHitAreas = [
            ...Object.values(torusKnots).map(torus => torus.userData.hitArea),
            ...Object.values(quickLinkHitMeshes)
        ];
        const torusIntersections = raycaster.intersectObjects(allHitAreas);
        const hoveredTorus = torusIntersections.length > 0 ? 
            (torusIntersections[0].object.userData.parentTorus || 
            Object.values(torusKnots)[Object.values(quickLinkHitMeshes).indexOf(torusIntersections[0].object)]) :
            null;
        
        // Animation des torus knots
        Object.values(torusKnots).forEach((torusKnot, index) => {
            torusKnot.rotation.x = time * 0.3;
            torusKnot.rotation.y = time * 0.2;
            torusKnot.rotation.z = time * 0.1;
            
            const hue = ((time * 0.1) + (index * 0.3)) % 1;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
            torusKnot.material.color = color;
            torusKnot.material.emissive = color;
            
            // Effet de survol
            if (torusKnot === hoveredTorus) {
                // Grossissement progressif au survol
                torusKnot.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
                document.body.style.cursor = 'pointer';
            } else {
                // Retour progressif à la taille normale
                torusKnot.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
            }
        });
        
        // Animation du soleil
        const radius = 3; // Distance du soleil par rapport au centre
        const sunSpeed = 0.3; // Vitesse de rotation du soleil
        sun.position.x = Math.cos(time * sunSpeed) * radius;
        sun.position.y = Math.sin(time * sunSpeed) * radius * 0.5; // Orbite elliptique
        sun.position.z = Math.sin(time * sunSpeed) * radius;
        
        // Mise à jour du shader du soleil
        sun.material.uniforms.time.value = time;
        
        // Mise à jour du temps pour l'effet de scintillement des étoiles
        particles.material.uniforms.time.value = time;
        
        // Rotation très lente des particules
        particles.rotation.y += 0.00005;
        
        // Animation du texte et des boutons
        textMeshes.welcome.position.y = 2 + Math.sin(time) * 0.05;
        textMeshes.description.position.y = 1.5 + Math.sin(time + 0.5) * 0.05;
        
        // Mise à jour du curseur (pour les hit areas et les torus)
        const isHoveringAny = Object.values(quickLinkHitMeshes).some(mesh => 
            raycaster.intersectObject(mesh).length > 0
        ) || torusIntersections.length > 0;
        document.body.style.cursor = isHoveringAny ? 'pointer' : 'default';



        renderer.render(scene, camera);
    }

    animate();

    // Ajuster les positions des textes pour mobile
    if (isMobile) {
        // Titre et description plus haut sur mobile
        textMeshes.welcome = await createText(threejsTranslations.fr.welcome, 
            { x: 0, y: 2.5, z: -2 }, 0.25);
        textMeshes.description = await createText(threejsTranslations.fr.description, 
            { x: 0, y: 2, z: -2 }, 0.18);

        // Organisation verticale des quick links
        const quickLinksStartY = 1.2; // Position Y de départ plus haute
        const quickLinksSpacing = 1.0; // Espacement vertical entre chaque section

        // Projets - Premier groupe
        textMeshes.projects_title = await createText(threejsTranslations.fr.projects_title, 
            { x: 0, y: quickLinksStartY, z: -2 }, 0.22);
        textMeshes.projects_desc = await createText(threejsTranslations.fr.projects_desc, 
            { x: 0, y: quickLinksStartY - 0.3, z: -2 }, 0.15);

        // À propos - Deuxième groupe
        textMeshes.about_title = await createText(threejsTranslations.fr.about_title, 
            { x: 0, y: quickLinksStartY - quickLinksSpacing, z: -2 }, 0.22);
        textMeshes.about_desc = await createText(threejsTranslations.fr.about_desc, 
            { x: 0, y: quickLinksStartY - quickLinksSpacing - 0.3, z: -2 }, 0.15);

        // Contact - Troisième groupe
        textMeshes.contact_title = await createText(threejsTranslations.fr.contact_title, 
            { x: 0, y: quickLinksStartY - quickLinksSpacing * 2, z: -2 }, 0.22);
        textMeshes.contact_desc = await createText(threejsTranslations.fr.contact_desc, 
            { x: 0, y: quickLinksStartY - quickLinksSpacing * 2 - 0.3, z: -2 }, 0.15);

        // Footer plus bas
        textMeshes.footer = await createText(threejsTranslations.fr.footer, 
            { x: 0, y: -2.5, z: -2 }, 0.1);

        // Ajuster la caméra pour mobile
        camera.position.z = 6;
        camera.fov = 90;
        camera.updateProjectionMatrix();

        // Ajuster la taille et position du torus knot
        torusKnots.projects.scale.set(0.5, 0.5, 0.5);
        torusKnots.projects.position.y = 1.5;

        // Ajuster la position du soleil pour mobile
        sun.scale.set(0.7, 0.7, 0.7);
    } else {
        // Configuration desktop existante
        // ... existing desktop code ...
    }

    // Ajouter la gestion des événements tactiles
    if (isMobile) {
        window.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            // Simuler un clic pour les interactions tactiles
            handleClick(event);
        }, { passive: false });
    }
}

// Appel de la fonction init au chargement de la page
window.addEventListener('load', init);

// Modifier l'écouteur mousemove existant
window.addEventListener('mousemove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;
    
    // Gestion de l'affichage du header sur la page index
    if (isIndexPage) {
        if (event.clientY <= HEADER_SHOW_THRESHOLD) {
            header.style.transform = 'translateY(0)';
        } else {
            header.style.transform = 'translateY(-100%)';
        }
    }

    if (DEBUG) {
        console.log("MouseMoved:", { x: mouse.x, y: mouse.y });
    }
});

// Ajouter une fonction handleClick pour gérer les interactions
function handleClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(quickLinkHitMeshes));
    
    if (intersects.length > 0) {
        const hitArea = intersects[0].object;
        const textMesh = hitArea.parent;
        
        // Animation de clic
        textMesh.scale.setScalar(0.9);
        setTimeout(() => {
            textMesh.scale.setScalar(1.0);
            // Navigation vers la page correspondante
            // ... existing navigation code ...
        }, 150);
    }
} 