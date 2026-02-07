// Dark Mode Toggle (Required on ALL tools)
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
});

// Embed Button Functionality (Required on ALL tools)
document.addEventListener('DOMContentLoaded', function() {
    const embedBtn = document.getElementById('embedBtn');
    const embedModal = document.getElementById('embedModal');
    const modalClose = document.querySelector('.modal-close');
    const copyEmbedCode = document.getElementById('copyEmbedCode');
    const embedCodeTextarea = document.getElementById('embedCode');

    if (embedBtn && embedModal) {
        // Get current tool path
        const currentPath = window.location.pathname;
        const embedUrl = window.location.origin + currentPath.replace('index.html', 'embed.html');

        // Generate embed code
        const embedCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`;
        embedCodeTextarea.value = embedCode;

        // Show modal
        embedBtn.addEventListener('click', function() {
            embedModal.style.display = 'flex';
        });

        // Close modal
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                embedModal.style.display = 'none';
            });
        }

        // Copy code
        if (copyEmbedCode) {
            copyEmbedCode.addEventListener('click', function() {
                embedCodeTextarea.select();
                document.execCommand('copy');
                copyEmbedCode.textContent = 'Copied!';
                setTimeout(() => {
                    copyEmbedCode.textContent = 'Copy Code';
                }, 2000);
            });
        }

        // Close on outside click
        window.addEventListener('click', function(e) {
            if (e.target === embedModal) {
                embedModal.style.display = 'none';
            }
        });
    }
});
