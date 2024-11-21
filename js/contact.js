document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');

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