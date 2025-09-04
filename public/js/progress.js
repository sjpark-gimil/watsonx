// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnMenuToggle = menuToggle && (menuToggle === event.target || menuToggle.contains(event.target));
        
        if (!isClickInsideSidebar && !isClickOnMenuToggle && window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        }
    });
    
    // Close menu when a navigation link is clicked (for single-page navigation)
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
        }
    });
});
