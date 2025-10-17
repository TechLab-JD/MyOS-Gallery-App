const appBase = new URL('.', import.meta.url);

async function loadGallery() {
  const foldersEl = document.getElementById('folders');
  const imagesEl = document.getElementById('images');
  foldersEl.innerHTML = '';
  imagesEl.innerHTML = '';

  try {
    // Load gallery.json relative to the app folder
    const response = await fetch(new URL('gallery.json', appBase));
    const data = await response.json();

    // Render folders
    data.folders.forEach(folder => {
      const el = document.createElement('div');
      el.classList.add('gallery-item');
      el.innerHTML = `
        <div class="folder-icon">
          <img src="${folder.preview ? new URL('gallery/' + folder.preview, appBase) : new URL('gallery/default-folder.png', appBase)}" alt="${folder.name}">
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
        <img src="${new URL('gallery/' + img.path, appBase)}" alt="${img.name}">
        <div class="label">${img.name}</div>
      `;
      imagesEl.appendChild(el);
    });

  } catch (err) {
    console.error('Gallery load failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);