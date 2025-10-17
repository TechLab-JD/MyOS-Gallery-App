async function loadGallery() {
  const foldersEl = document.getElementById('folders');
  const imagesEl = document.getElementById('images');
  foldersEl.innerHTML = '';
  imagesEl.innerHTML = '';

  try {
    const response = await fetch('./gallery.json');
    const data = await response.json();

    // Render folders
    data.folders.forEach(folder => {
      const el = document.createElement('div');
      el.classList.add('gallery-item');
      el.innerHTML = `
        <div class="folder-icon">
          <img src="./gallery/${folder.preview || 'default-folder.png'}" alt="${folder.name}">
        </div>
        <div class="label">${folder.name}</div>
      `;
      el.addEventListener('click', () => openFolder(folder.name));
      foldersEl.appendChild(el);
    });

    // Render images
    data.images.forEach(img => {
      const el = document.createElement('div');
      el.classList.add('gallery-item');
      el.innerHTML = `
        <img src="./gallery/${img.path}" alt="${img.name}">
        <div class="label">${img.name}</div>
      `;
      imagesEl.appendChild(el);
    });

  } catch (err) {
    console.error('Gallery load failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
