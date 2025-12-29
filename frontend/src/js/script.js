// Inserisce l'anno corrente nel footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Aggiungiamo un effetto di scroll dolce per i link interni
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Console log motivazionale :)
console.log("🚀 Benvenuto nel tuo percorso! Ogni grande viaggio inizia con un primo passo.");