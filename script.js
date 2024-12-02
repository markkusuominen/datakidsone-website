document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);

    // Handle game button clicks
    const gameButtons = document.querySelectorAll('.game-button');
    gameButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const gameName = e.target.parentElement.querySelector('h2').textContent;
            startGame(gameName);
        });
    });

    // Game initialization function
    const startGame = (gameName) => {
        switch(gameName) {
            case 'Word Explorer':
                // Initialize reading game
                console.log('Starting Word Explorer game...');
                break;
            case 'Number Quest':
                // Initialize math game
                console.log('Starting Number Quest game...');
                break;
            case 'Logic Land':
                // Initialize logic game
                console.log('Starting Logic Land game...');
                break;
        }
    };

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Skip if href is just "#" or empty
            if (!targetId || targetId === '#') return;
            
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.log('Invalid selector:', targetId);
            }
        });
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});
