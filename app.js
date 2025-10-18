const appBase = window.APP_BASE;

async function loadGallery() {
  const foldersEl = document.getElementById('folders');
  const imagesEl = document.getElementById('images');
  foldersEl.innerHTML = '';
  imagesEl.innerHTML = '';

  try {
    // Fetch folder contents dynamically
    const galleryResponse = await fetch(`${appBase}gallery/`);
    const files = await galleryResponse.json(); // assuming your OS exposes directory listing

    const folders = files.filter(f => f.type === 'directory');
    const images = files.filter(f => f.type === 'file' && /\.(png|jpe?g|gif|webp)$/i.test(f.name));

    // Render folders
    folders.forEach(folder => {
      const el = document.createElement('div');
      el.classList.add('gallery-item');
      const coverPath = folder.cover ? folder.cover : 'default-folder.svg';
      el.innerHTML = `
        <div class="folder-icon">
          <img src="${appBase}gallery/${folder.name}/${coverPath}" alt="${folder.name}">
        </div>
        <div class="label">${folder.name}</div>
      `;
      el.addEventListener('click', () => openFolder(folder.name));
      foldersEl.appendChild(el);
    });

    // Render images
    images.forEach(img => {
      const el = document.createElement('div');
      el.classList.add('gallery-item');
      el.innerHTML = `
        <img src="${appBase}gallery/${img.name}" alt="${img.name}">
        <div class="label">${img.name}</div>
      `;
      imagesEl.appendChild(el);
    });

  } catch (err) {
    // fallback message if gallery can't be scanned
    foldersEl.innerHTML = '<p>Gallery folder not found or empty.</p>';
    console.error('Gallery load failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
