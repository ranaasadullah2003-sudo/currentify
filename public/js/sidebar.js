document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('postSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeSidebar');

    const postLinks = document.querySelectorAll('.sidebar-trigger');

    postLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const postId = link.getAttribute('data-post-id');
            const title = link.getAttribute('data-title');
            const content = link.getAttribute('data-content');
            const image = link.getAttribute('data-image');
            const category = link.getAttribute('data-category');
            const date = link.getAttribute('data-date');
            const references = link.getAttribute('data-references');

            // Track click and view
            if (postId) {
                fetch('/track/click/' + postId, { method: 'POST' });
                fetch('/track/view/' + postId, { method: 'POST' });
            }

            const imageContainer = document.getElementById('sidebarImageContainer');
            if (image && image !== '') {
                imageContainer.innerHTML = `<img src="${image}" alt="${title}" onerror="this.style.display='none'">`;
            } else {
                imageContainer.innerHTML = '';
            }
            
            document.getElementById('sidebarTitle').innerText = title;
            document.getElementById('sidebarCategory').innerText = category;
            document.getElementById('sidebarDate').innerText = date;
            document.getElementById('sidebarBody').innerText = content;

            const referencesSection = document.getElementById('sidebarReferences');
            const referencesText = document.getElementById('sidebarReferencesText');
            if (references && references.trim() !== '' && references !== '[]') {
                try {
                    const refs = JSON.parse(references);
                    if (refs.length > 0) {
                        let html = '';
                        refs.forEach(ref => {
                            if (ref.url) {
                                html += `<a href="${ref.url}" target="_blank" rel="noopener" style="color: #3b82f6; display: block; margin-bottom: 4px;">${ref.name || ref.url}</a>`;
                            } else {
                                html += `<span style="display: block; margin-bottom: 4px;">${ref.name}</span>`;
                            }
                        });
                        referencesText.innerHTML = html;
                        referencesSection.style.display = 'block';
                    } else {
                        referencesSection.style.display = 'none';
                    }
                } catch(err) {
                    referencesSection.style.display = 'none';
                }
            } else {
                referencesSection.style.display = 'none';
            }

            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeSidebar = () => {
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    } else {
        console.warn('Sidebar close button not found');
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    } else {
        console.warn('Sidebar overlay not found');
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
});