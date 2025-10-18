const appBase = window.APP_BASE || './'; // fallback if loader doesn't set it

async function scanGalleryFolder(folderPath = 'gallery') {
  const folders = [];
  const images = [];

  try {
    // Fetch the folder listing from the OS
    const response = await fetch(`${appBase}${folderPath}/`);
    const items = await response.json(); // OS must expose directory JSON

    for (const item of items) {
      if (item.type === 'directory') {
        // Check for a cover image
        const possibleCovers = ['cover.jpg', 'cover.png', 'folder.jpg'];
        const cover = possibleCovers.find(f => items.some(i => i.name === f && i.type === 'file')) || null;

        folders.push({ name: item.name, path: `${folderPath}/${item.name}`, cover });

        // Recursively scan subfolders if needed
        // const sub = await scanGalleryFolder(`${folderPath}/${item.name}`);
        // folders.push(...sub.folders);
        // images.push(...sub.images);
      } else if (item.type === 'file' && /\.(png|jpe?g|gif|webp)$/i.test(item.name)) {
        images.push({ name: item.name, path: `${folderPath}/${item.name}` });
      }
    }
  } catch (err) {
    console.error('Failed to scan gallery folder:', folderPath, err);
  }

  return { folders, images };
}

async function renderGallery(folderPath = 'gallery') {
  const foldersEl = document.getElementById('folders');
  const imagesEl = document.getElementById('images');
  foldersEl.innerHTML = '';
  imagesEl.innerHTML = '';

  const { folders, images } = await scanGalleryFolder(folderPath);

  // Render folders (albums)
  folders.forEach(folder => {
    const el = document.createElement('div');
    el.classList.add('gallery-item');
    const coverSrc = folder.cover
      ? `${appBase}${folder.path}/${folder.cover}`
      : `${appBase}gallery/default-folder.svg`;

    el.innerHTML = `
      <div class="folder-icon">
        <img src="${coverSrc}" alt="${folder.name}">
      </div>
      <div class="label">${folder.name}</div>
    `;
    el.addEventListener('click', () => renderGallery(folder.path)); // navigate into folder
    foldersEl.appendChild(el);
  });

  // Render images in this folder
  images.forEach(img => {
    const el = document.createElement('div');
    el.classList.add('gallery-item');
    el.innerHTML = `
      <img src="${appBase}${img.path}" alt="${img.name}">
      <div class="label">${img.name}</div>
    `;
    imagesEl.appendChild(el);

    // Optional: click to open image in a viewer
    el.addEventListener('click', () => openImageViewer(`${appBase}${img.path}`, img.name));
  });
}

// Optional: simple image viewer overlay
function openImageViewer(src, name) {
  let viewer = document.getElementById('image-viewer');
  if (!viewer) {
    viewer = document.createElement('div');
    viewer.id = 'image-viewer';
    viewer.style = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    `;
    viewer.addEventListener('click', () => viewer.remove());
    document.body.appendChild(viewer);
  }

  viewer.innerHTML = `<img src="${src}" alt="${name}" style="max-width:90%; max-height:90%; border-radius:8px;">`;
}

// Initialize Gallery on DOM load
document.addEventListener('DOMContentLoaded', () => renderGallery('gallery'));
