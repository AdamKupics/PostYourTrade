// Load posts from localStorage

function loadPosts() {
  const savedPosts = localStorage.getItem('pytPosts');
  const posts = savedPosts ? JSON.parse(savedPosts) : [];
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#8b949e;margin-top:40px;">No signals yet — post the first one!</p>';
    return;
  }
  posts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <div class="post-header">
        <div class="avatar">👤</div>
        <div class="post-info">
          <strong>${p.username || 'Anonymous Trader'}</strong><br>
          <small>${new Date(p.timestamp).toLocaleString()}</small>
        </div>
      </div>
      <p>${p.comment}</p>
      ${p.imageURL ? `<img src="${p.imageURL}" alt="trade signal">` : ''}
    `;
    container.appendChild(div);
  });
}
loadPosts();

// Post Signal (save to localStorage)
document.getElementById('postForm').addEventListener('submit', e => {
  e.preventDefault();
  const comment = document.getElementById('commentInput').value.trim();
  const file = document.getElementById('imageInput').files[0];
  if (!comment) return;

  const reader = new FileReader();
  reader.onload = () => {
    const savedPosts = localStorage.getItem('pytPosts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];

    const newPost = {
      username: 'Anonymous Trader',
      comment,
      imageURL: file ? reader.result : null,
      timestamp: new Date().toISOString()
    };

    posts.unshift(newPost); // Add to top
    localStorage.setItem('pytPosts', JSON.stringify(posts));

    document.getElementById('postForm').reset();
    loadPosts();
  };

  if (file) reader.readAsDataURL(file);
  else {
    const savedPosts = localStorage.getItem('pytPosts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];

    posts.unshift({
      username: 'Anonymous Trader',
      comment,
      imageURL: null,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('pytPosts', JSON.stringify(posts));
    document.getElementById('postForm').reset();
    loadPosts();
  }
});