let posts = JSON.parse(localStorage.getItem('posts')) || [];
let sortOrder = 'newest';

const modal = document.getElementById('modal');
const newPostBtn = document.getElementById('newPostBtn');
const closeBtn = document.querySelector('.close');
const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');
const coverImageInput = document.getElementById('coverImage');
const imagePreview = document.getElementById('imagePreview');
const sortSelect = document.getElementById('sortSelect');

newPostBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Create Post';
    postForm.reset();
    document.getElementById('postId').value = '';
    imagePreview.style.display = 'none';
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

sortSelect.addEventListener('change', (e) => {
    sortOrder = e.target.value;
    renderPosts();
});

coverImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('postId').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const coverImage = imagePreview.src || '';
    
    if (id) {
        const index = posts.findIndex(p => p.id === id);
        posts[index] = { ...posts[index], title, content, coverImage };
    } else {
        const newPost = {
            id: Date.now().toString(),
            title,
            content,
            coverImage,
            date: new Date().toLocaleString()
        };
        posts.push(newPost);
    }
    
    localStorage.setItem('posts', JSON.stringify(posts));
    modal.style.display = 'none';
    renderPosts();
});

function renderPosts() {
    postsContainer.innerHTML = '';
    
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.id - a.id;
        } else {
            return a.id - b.id;
        }
    });
    
    sortedPosts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        
        postDiv.innerHTML = `
            ${post.coverImage ? `<img src="${post.coverImage}" alt="Cover">` : '<img src="https://via.placeholder.com/300x200" alt="Cover">'}
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <p class="post-date">${post.date || 'No date'}</p>
                <div class="post-actions">
                    <button class="btn-edit" onclick="editPost('${post.id}')">Edit</button>
                    <button class="btn-delete" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
        `;
        
        postDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-edit') && !e.target.classList.contains('btn-delete')) {
                window.location.href = `post.html?id=${post.id}`;
            }
        });
        
        postsContainer.appendChild(postDiv);
    });
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    document.getElementById('modalTitle').textContent = 'Edit Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    
    if (post.coverImage) {
        imagePreview.src = post.coverImage;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

renderPosts();
