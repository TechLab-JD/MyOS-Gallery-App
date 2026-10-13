// MyOS Gallery App
// Reads a committed gallery/index.json manifest (static hosts like GitHub Pages
// can't list directory contents), so the gallery works anywhere. Regenerate the
// manifest with tools/build-manifest.py after adding or removing images.

// Locate this app's own folder from the module URL — robust even when several
// apps load at once (a shared global like window.APP_BASE can get clobbered).
const appBase = new URL('.', import.meta.url).href;
let manifestPromise = null;

function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(`${appBase}gallery/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.error('Gallery: could not load gallery/index.json', err);
        return {};
      });
  }
  return manifestPromise;
}

async function renderGallery(folderPath = 'gallery') {
  const foldersEl = document.getElementById('folders');
  const imagesEl = document.getElementById('images');
  if (!foldersEl || !imagesEl) return;
  foldersEl.replaceChildren();
  imagesEl.replaceChildren();

  const manifest = await loadManifest();

  if (!manifest || Object.keys(manifest).length === 0) {
    const msg = document.createElement('p');
    msg.className = 'label';
    msg.textContent = 'No gallery manifest found. Run tools/build-manifest.py to create gallery/index.json.';
    imagesEl.appendChild(msg);
    return;
  }

  const node = manifest[folderPath] || { folders: [], images: [] };

  // "Back" card when viewing a subfolder
  if (folderPath !== 'gallery') {
    const parent = folderPath.split('/').slice(0, -1).join('/') || 'gallery';
    foldersEl.appendChild(makeFolderCard('Back', null, () => renderGallery(parent)));
  }

  (node.folders || []).forEach((name) => {
    const path = `${folderPath}/${name}`;
    foldersEl.appendChild(
      makeFolderCard(name, `${appBase}gallery/default-folder.svg`, () => renderGallery(path))
    );
  });

  (node.images || []).forEach((name) => {
    const src = `${appBase}${folderPath}/${name}`;
    imagesEl.appendChild(makeImageCard(name, src, () => openImageViewer(src, name)));
  });
}

// --- Card builders (DOM APIs only — names are never treated as HTML) ---

function makeFolderCard(label, iconSrc, onClick) {
  const el = document.createElement('div');
  el.className = 'gallery-item';

  const icon = document.createElement('div');
  icon.className = 'folder-icon';
  if (iconSrc) {
    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = label;
    icon.appendChild(img);
  } else {
    icon.textContent = '←'; // left arrow for "Back"
  }

  const labelEl = document.createElement('div');
  labelEl.className = 'label';
  labelEl.textContent = label;

  el.append(icon, labelEl);
  el.addEventListener('click', onClick);
  return el;
}

function makeImageCard(name, src, onClick) {
  const el = document.createElement('div');
  el.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = src;
  img.alt = name;
  img.loading = 'lazy';

  const labelEl = document.createElement('div');
  labelEl.className = 'label';
  labelEl.textContent = name;

  el.append(img, labelEl);
  el.addEventListener('click', onClick);
  return el;
}

function openImageViewer(src, name) {
  let viewer = document.getElementById('image-viewer');
  if (!viewer) {
    viewer = document.createElement('div');
    viewer.id = 'image-viewer';
    viewer.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;' +
      'align-items:center;justify-content:center;z-index:1000;cursor:pointer;';
    viewer.addEventListener('click', () => viewer.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' && document.getElementById('image-viewer')) viewer.remove();
    });
    document.body.appendChild(viewer);
  }
  viewer.replaceChildren();
  const img = document.createElement('img');
  img.src = src;
  img.alt = name;
  img.style.cssText = 'max-width:90%;max-height:90%;border-radius:8px;';
  viewer.appendChild(img);
}

// The MyOS loader injects this script AFTER DOMContentLoaded has already fired,
// so run immediately rather than waiting for an event that will never come.
renderGallery('gallery');
