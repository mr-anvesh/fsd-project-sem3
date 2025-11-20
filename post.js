const posts = JSON.parse(localStorage.getItem('posts')) || [];
const post = posts.find(p => p.id === new URLSearchParams(window.location.search).get('id'));

document.getElementById('postDetail').innerHTML = post ? `
    <img src="${post.coverImage || 'https://via.placeholder.com/800x400'}" alt="Cover" class="post-detail-img">
    <h1>${post.title}</h1>
    <p class="post-detail-content">${post.content}</p>
    <p class="post-detail-date">${new Date(post.timestamp).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
` : '<p>Post not found</p>';
