document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner uniquement les boutons de copie pour email (1er élément) et téléphone (2ème élément)
    const copyButtons = document.querySelectorAll('.contact-item:nth-child(-n+2) .copy-btn');

    // Ajout des sons de machine à écrire avec gestion des erreurs
    const typeSounds = [];
    const soundFiles = [
        'sounds/type_writer_key_1.mp3',
        'sounds/type_writer_key_2.mp3',
        'sounds/type_writer_key_3.mp3'
    ];

    // Cacher tout le texte initialement
    document.querySelectorAll('.contact-item p').forEach(p => {
        p.style.visibility = 'hidden';
    });

    // Fonction pour charger un son avec vérification
    function loadSound(url) {
        const audio = new Audio(url);
        audio.addEventListener('error', (e) => {
            console.error(`Erreur de chargement du son ${url}:`, e);
        });
        return audio;
    }

    // Chargement des sons avec vérification
    soundFiles.forEach(url => {
        const sound = loadSound(url);
        sound.volume = 0.2;
        typeSounds.push(sound);
    });

    const returnSound = loadSound('sounds/type_writer_return_1.mp3');
    returnSound.volume = 0.3;

    // Fonction pour obtenir un son de frappe aléatoire avec vérification
    function getRandomTypeSound() {
        const randomIndex = Math.floor(Math.random() * typeSounds.length);
        const sound = typeSounds[randomIndex];
        
        if (sound.readyState >= 2) {
            return sound;
        } else {
            return typeSounds.find(s => s.readyState >= 2) || sound;
        }
    }

    // Fonction pour jouer un son avec gestion des erreurs
    async function playSound(sound) {
        try {
            sound.currentTime = 0;
            await sound.play();
        } catch (error) {
            console.error('Erreur lors de la lecture du son:', error);
        }
    }

    // Nouvelle fonction pour l'animation de machine à écrire
    function typewriterEffect(element, text, speed = 20) { // Vitesse réduite à 20ms
        let index = 0;
        element.textContent = '';
        element.style.visibility = 'visible';
        element.classList.add('typing');
        
        return new Promise(resolve => {
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    
                    // Jouer un son de frappe seulement une fois sur deux (pour les caractères non-espaces)
                    if (text.charAt(index) !== ' ' && index % 2 === 0) {
                        const typeSound = getRandomTypeSound();
                        playSound(typeSound);
                    }
                    
                    index++;
                    setTimeout(type, speed + Math.random() * 20); // Variation de vitesse réduite
                } else {
                    element.classList.remove('typing');
                    playSound(returnSound);
                    resolve();
                }
            }
            type();
        });
    }

    // Animation séquentielle des éléments de contact
    async function animateContactInfo() {
        const contactItems = document.querySelectorAll('.contact-item p');
        
        // Attendre que les sons soient chargés
        await Promise.all([
            ...typeSounds.map(sound => new Promise(resolve => {
                if (sound.readyState >= 2) resolve();
                sound.addEventListener('canplaythrough', resolve);
            })),
            new Promise(resolve => {
                if (returnSound.readyState >= 2) resolve();
                returnSound.addEventListener('canplaythrough', resolve);
            })
        ]);
        
        for (const item of contactItems) {
            const originalText = item.textContent;
            await typewriterEffect(item, originalText);
            await new Promise(resolve => setTimeout(resolve, 150)); // Pause réduite entre chaque élément
        }
    }

    // Fonction pour démarrer l'animation sans son
    function startAnimationWithoutSound() {
        document.removeEventListener('click', startAnimation);
        document.removeEventListener('keypress', startAnimation);
        clearTimeout(autoStartTimer);
        startMessage.remove();
        
        // Version modifiée de animateContactInfo sans son
        async function animateContactInfoSilent() {
            const contactItems = document.querySelectorAll('.contact-item p');
            
            for (const item of contactItems) {
                const originalText = item.textContent;
                await typewriterEffectSilent(item, originalText);
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }

        // Version modifiée de typewriterEffect sans son
        function typewriterEffectSilent(element, text, speed = 20) {
            let index = 0;
            element.textContent = '';
            element.style.visibility = 'visible';
            element.classList.add('typing');
            
            return new Promise(resolve => {
                function type() {
                    if (index < text.length) {
                        element.textContent += text.charAt(index);
                        index++;
                        setTimeout(type, speed + Math.random() * 20);
                    } else {
                        element.classList.remove('typing');
                        resolve();
                    }
                }
                type();
            });
        }

        animateContactInfoSilent();
    }

    // Fonction pour démarrer l'animation avec son
    function startAnimation() {
        document.removeEventListener('click', startAnimation);
        document.removeEventListener('keypress', startAnimation);
        clearTimeout(autoStartTimer);
        startMessage.remove();
        animateContactInfo();
    }

    // Ajouter un message pour indiquer qu'il faut cliquer
    const contactPage = document.querySelector('.contact-page');
    const startMessage = document.createElement('div');
    startMessage.className = 'start-message';
    startMessage.textContent = 'Cliquez n\'importe où pour démarrer l\'animation avec le son';
    contactPage.appendChild(startMessage);

    // Timer pour démarrer automatiquement après 5 secondes
    const autoStartTimer = setTimeout(startAnimationWithoutSound, 5000);

    // Attendre une interaction utilisateur pour démarrer avec son
    document.addEventListener('click', startAnimation);
    document.addEventListener('keypress', startAnimation);

    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const textToCopy = this.getAttribute('data-copy');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Feedback visuel
                const icon = this.querySelector('i');
                icon.className = 'fas fa-check';
                this.classList.add('copied');
                
                // Remettre l'icône originale après 2 secondes
                setTimeout(() => {
                    icon.className = 'fas fa-copy';
                    this.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                console.error('Erreur lors de la copie :', err);
            }
        });
    });
}); 