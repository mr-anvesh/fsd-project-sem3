let posts = JSON.parse(localStorage.getItem('posts')) || [];
let sortOrder = 'newest';

const modal = document.getElementById('modal');
const postForm = document.getElementById('postForm');
const imagePreview = document.getElementById('imagePreview');

document.getElementById('newPostBtn').onclick = () => {
    document.getElementById('modalTitle').textContent = 'Create Post';
    postForm.reset();
    imagePreview.style.display = 'none';
    modal.style.display = 'block';
};

document.querySelector('.close').onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

document.getElementById('sortSelect').onchange = (e) => {
    sortOrder = e.target.value;
    renderPosts();
};

document.getElementById('coverImage').onchange = (e) => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(e.target.files[0]);
    }
};

postForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('postId').value;
    const post = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        coverImage: imagePreview.style.display === 'block' ? imagePreview.src : ''
    };
    
    if (id) {
        posts[posts.findIndex(p => p.id === id)] = { ...posts.find(p => p.id === id), ...post };
    } else {
        posts.push({ id: Date.now().toString(), timestamp: new Date().toISOString(), ...post });
    }
    
    localStorage.setItem('posts', JSON.stringify(posts));
    modal.style.display = 'none';
    renderPosts();
};

function renderPosts() {
    document.getElementById('posts').innerHTML = [...posts].sort((a, b) => 
        sortOrder === 'newest' ? b.id - a.id : a.id - b.id
    ).map(post => `
        <div class="post" onclick="if(!event.target.matches('.btn-edit,.btn-delete'))location.href='post.html?id=${post.id}'">
            <img src="${post.coverImage || 'https://via.placeholder.com/300x200'}" alt="Cover">
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <p class="post-date">${new Date(post.timestamp).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                <div class="post-actions">
                    <button class="btn-edit" onclick="editPost('${post.id}')">Edit</button>
                    <button class="btn-delete" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    document.getElementById('modalTitle').textContent = 'Edit Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    imagePreview.src = post.coverImage;
    imagePreview.style.display = post.coverImage ? 'block' : 'none';
    modal.style.display = 'block';
}

function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

renderPosts();
