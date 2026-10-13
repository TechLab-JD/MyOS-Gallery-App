# MyOS Gallery App

A simple image gallery module for [MyOS](https://github.com/TechLab-JD/MyOS). Browse folders (albums) and images, and click any image to open it full-screen.

It's a self-contained MyOS app: an `.app-window` HTML fragment plus its own CSS and JS, loaded by MyOS from `data/modules.json`.

## How it finds images

Static hosts like GitHub Pages can't list a directory's contents, so the app reads a committed **`gallery/index.json`** manifest instead of scanning folders at runtime. The manifest maps each folder path to its subfolders and images:

```json
{
  "gallery": { "folders": ["wallpapers"], "images": [] },
  "gallery/wallpapers": { "folders": [], "images": ["sunset.jpg", "galaxy.png"] }
}
```

## Add or change images

1. Drop images into `gallery/` (or a subfolder for an album).
2. Regenerate the manifest:

   ```bash
   python tools/build-manifest.py
   ```

3. Commit the images and the updated `gallery/index.json`.

Supported types: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`.

## Use it in MyOS

As a git submodule under `apps/`, registered in the MyOS `data/modules.json`:

```json
{
  "id": "GalleryApp",
  "name": "Gallery App",
  "icon": "apps/MyOS-Gallery-App/icon.svg",
  "html": "apps/MyOS-Gallery-App/app.html",
  "css":  "apps/MyOS-Gallery-App/app.css",
  "js":   "apps/MyOS-Gallery-App/app.js"
}
```

## License

[MIT](LICENSE)
