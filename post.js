const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

const posts = JSON.parse(localStorage.getItem('posts')) || [];
const post = posts.find(p => p.id === postId);

const postDetail = document.getElementById('postDetail');

if (post) {
    postDetail.innerHTML = `
        ${post.coverImage ? `<img src="${post.coverImage}" alt="Cover" class="post-detail-img">` : '<img src="https://via.placeholder.com/800x400" alt="Cover" class="post-detail-img">'}
        <h1>${post.title}</h1>
        <p class="post-detail-content">${post.content}</p>
        <p class="post-date">${post.date || 'No date'}</p>
    `;
} else {
    postDetail.innerHTML = '<p>Post not found</p>';
}
