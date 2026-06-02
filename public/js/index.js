document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const dynamicZone = document.getElementById('dynamicZone');
    const loadMoreWrap = document.getElementById('loadMoreWrap');
    
    if (!loadMoreBtn) return;

    let currentPage = 1;
    let isExpanded = false;
    
    loadMoreBtn.addEventListener('click', async function() {
        
        // ── SHOW LESS: remove loaded posts ──
        if (isExpanded) {
            dynamicZone.innerHTML = '';
            currentPage = 1;
            loadMoreBtn.setAttribute('data-page', '1');
            loadMoreBtn.innerHTML = 'Load More Stories <i class="fa-solid fa-chevron-down"></i>';
            loadMoreBtn.classList.remove('open');
            isExpanded = false;
            return;
        }
        
        // ── LOAD MORE ──
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        try {
            const res = await fetch('/api/posts/' + currentPage);
            const data = await res.json();
            
            if (data.posts.length > 0) {
                data.posts.forEach(function(post) {
                    const card = document.createElement('article');
                    card.className = 'post-card post-card-grid';
                    
                    const title = post.title || '';
                    const content = post.content || '';
                    const image = post.image || '';
                    const category = post.category || '';
                    const createdAt = post.createdAt || '';
                    const references = post.references || '';
                    
                    card.innerHTML = 
                        '<div class="post-image-wrapper">' +
                            (image ? '<img src="' + image + '" alt="' + title + '" class="post-image">' : '') +
                        '</div>' +
                        '<div class="post-card-body">' +
                            '<h3 class="post-title">' +
                                '<a href="#" class="sidebar-trigger" data-post-id="' + post._id + '" data-title="' + title + '" data-content="' + content + '" data-image="' + (image || '/images/placeholder.jpg') + '" data-category="' + category + '" data-date="' + new Date(createdAt).toLocaleDateString() + '" data-references="' + references + '">' + title + '</a>' +
                            '</h3>' +
                            '<p class="post-excerpt">' + content.substring(0, 100) + '…</p>' +
                            '<div class="card-footer">' +
                                '<a href="#" class="read-more sidebar-trigger" data-post-id="' + post._id + '" data-title="' + title + '" data-content="' + content + '" data-image="' + (image || '/images/placeholder.jpg') + '" data-category="' + category + '" data-date="' + new Date(createdAt).toLocaleDateString() + '" data-references="' + references + '">Read Article <i class="fa-solid fa-arrow-right"></i></a>' +
                                (window.isAdmin ? 
                                    '<div class="admin-actions">' +
                                        '<a href="/edit/' + post._id + '" class="btn-edit">Edit</a>' +
                                        '<form method="POST" action="/delete/' + post._id + '" style="display:inline;" onsubmit="return confirm(\'Are you sure you want to delete this post?\');">' +
                                            '<button type="submit" class="btn-delete">Delete</button>' +
                                        '</form>' +
                                    '</div>' 
                                : '') +
                            '</div>' +
                        '</div>';
                    dynamicZone.appendChild(card);
                });
                
                currentPage++;
                loadMoreBtn.setAttribute('data-page', currentPage);
                
                if (!data.hasMore) {
                    // No more posts — switch to collapse mode
                    loadMoreBtn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-up"></i>';
                    loadMoreBtn.classList.add('open');
                    loadMoreBtn.disabled = false;
                    isExpanded = true;
                } else {
                    loadMoreBtn.innerHTML = 'Load More Stories <i class="fa-solid fa-chevron-down"></i>';
                    loadMoreBtn.disabled = false;
                }
            } else {
                // No posts returned
                loadMoreBtn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-up"></i>';
                loadMoreBtn.classList.add('open');
                loadMoreBtn.disabled = false;
                isExpanded = true;
            }
        } catch(err) {
            loadMoreBtn.textContent = 'Error. Try again.';
            loadMoreBtn.disabled = false;
        }
    });
});