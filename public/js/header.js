document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.querySelector('.main-nav').classList.toggle('active');
        });
    }

    // Explore/Categories dropdown menu
    const exploreMenuItem = document.querySelector('.has-mega-menu');
    if (exploreMenuItem) {
        const exploreLink = exploreMenuItem.querySelector('> a');
        const megaMenu = exploreMenuItem.querySelector('.mega-menu');

        if (exploreLink) {
            exploreLink.addEventListener('click', function(event) {
                event.preventDefault();
                exploreMenuItem.classList.toggle('open');
            });

            exploreLink.addEventListener('mouseenter', function() {
                exploreMenuItem.classList.add('open');
            });
        }

        if (megaMenu) {
            megaMenu.addEventListener('mouseenter', function() {
                exploreMenuItem.classList.add('open');
            });
        }

        exploreMenuItem.addEventListener('mouseleave', function() {
            exploreMenuItem.classList.remove('open');
        });
    }
});