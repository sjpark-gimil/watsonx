// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                e.target !== menuToggle && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Close menu when a navigation link is clicked (for mobile)
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
        }
    }
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
});
