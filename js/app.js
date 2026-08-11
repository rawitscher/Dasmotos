const { getAll, putItem, putMany, deleteItem } = window.ElsewhereDB;

const state = {
  photos: [],
  posts: [],
  pendingAlbumFiles: [],
  pendingPostFiles: [],
};

const els = {
  journalList: document.getElementById("journal-list"),
  journalEmpty: document.getElementById("journal-empty"),
  albumGrid: document.getElementById("album-grid"),
  albumEmpty: document.getElementById("album-empty"),
  photoForm: document.getElementById("photo-form"),
  photoInput: document.getElementById("photo-input"),
  photoCaption: document.getElementById("photo-caption"),
  photoPlace: document.getElementById("photo-place"),
  photoSubmit: document.getElementById("photo-submit"),
  photoPreview: document.getElementById("photo-preview"),
  dropzone: document.querySelector(".dropzone"),
  postForm: document.getElementById("post-form"),
  postTitle: document.getElementById("post-title"),
  postPlace: document.getElementById("post-place"),
  postDate: document.getElementById("post-date"),
  postBody: document.getElementById("post-body"),
  postPhotos: document.getElementById("post-photos"),
  postPhotoPreview: document.getElementById("post-photo-preview"),
  entryDialog: document.getElementById("entry-dialog"),
  entryDialogBody: document.getElementById("entry-dialog-body"),
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function filesToRecords(files, { caption = "", place = "" } = {}) {
  const list = Array.from(files || []);
  return Promise.all(
    list.map(async (file) => ({
      id: uid(),
      dataUrl: await fileToDataUrl(file),
      caption: caption.trim(),
      place: place.trim(),
      createdAt: new Date().toISOString(),
      name: file.name,
    }))
  );
}

function renderPhotoPreview(container, files) {
  if (!files.length) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  container.innerHTML = "";
  files.forEach((file) => {
    const img = document.createElement("img");
    img.alt = file.name || "Selected photo preview";
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);
    container.appendChild(img);
  });
}

function textedPhotos() {
  const moments = window.ElsewhereTrip?.getMoments?.() || [];
  return moments
    .filter((moment) => moment.kind === "photo" && moment.mediaUrl)
    .map((moment) => ({
      id: `trip-${moment.id}`,
      dataUrl: moment.mediaUrl,
      caption: moment.text || "Texted in",
      place: "",
      createdAt: moment.createdAt,
      source: "sms",
      momentId: moment.id,
    }));
}

function renderAlbum() {
  els.albumGrid.innerHTML = "";
  const photos = [...state.photos, ...textedPhotos()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  els.albumEmpty.classList.toggle("hidden", photos.length > 0);

  photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "album-item";
    figure.style.animationDelay = `${Math.min(index, 8) * 40}ms`;

    const img = document.createElement("img");
    img.src = photo.dataUrl;
    img.alt = photo.caption || photo.place || "Travel photo";
    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    const bits = [photo.caption, photo.place].filter(Boolean);
    caption.textContent = bits.join(" · ") || "Untitled frame";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-photo";
    remove.setAttribute("aria-label", "Remove photo");
    remove.textContent = "×";
    remove.addEventListener("click", async () => {
      if (photo.source === "sms" && photo.momentId) {
        await fetch(`/api/moments/${photo.momentId}`, { method: "DELETE" });
        await window.ElsewhereTrip?.refresh?.();
      } else {
        await deleteItem("photos", photo.id);
        state.photos = state.photos.filter((item) => item.id !== photo.id);
      }
      renderAlbum();
    });

    figure.append(img, caption, remove);
    els.albumGrid.appendChild(figure);
  });
}

function excerpt(text, max = 140) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function renderJournal() {
  els.journalList.innerHTML = "";
  const posts = [...state.posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt)
  );

  els.journalEmpty.classList.toggle("hidden", posts.length > 0);

  posts.forEach((post, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "entry";
    button.style.animationDelay = `${Math.min(index, 8) * 45}ms`;
    button.addEventListener("click", () => openEntry(post.id));

    const meta = document.createElement("div");
    meta.className = "entry-meta";
    meta.innerHTML = `<span>${formatDate(post.date)}</span>${
      post.place ? `<span>${escapeHtml(post.place)}</span>` : ""
    }`;

    const title = document.createElement("h3");
    title.className = "entry-title";
    title.textContent = post.title;

    const body = document.createElement("p");
    body.className = "entry-excerpt";
    body.textContent = excerpt(post.body);

    button.append(meta, title, body);

    if (post.photos?.length) {
      const thumbs = document.createElement("div");
      thumbs.className = "entry-thumbs";
      post.photos.slice(0, 3).forEach((photo) => {
        const img = document.createElement("img");
        img.src = photo.dataUrl;
        img.alt = "";
        thumbs.appendChild(img);
      });
      button.appendChild(thumbs);
    }

    els.journalList.appendChild(button);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function openEntry(id) {
  const post = state.posts.find((item) => item.id === id);
  if (!post) return;

  const photos = (post.photos || [])
    .map(
      (photo) =>
        `<img src="${photo.dataUrl}" alt="${escapeHtml(photo.caption || post.title)}">`
    )
    .join("");

  els.entryDialogBody.innerHTML = `
    <div class="entry-meta">
      <span>${formatDate(post.date)}</span>
      ${post.place ? `<span>${escapeHtml(post.place)}</span>` : ""}
    </div>
    <h2>${escapeHtml(post.title)}</h2>
    <p class="story">${escapeHtml(post.body)}</p>
    ${photos ? `<div class="story-photos">${photos}</div>` : ""}
  `;

  const actions = els.entryDialog.querySelector(".dialog-actions");
  let deleteBtn = actions.querySelector(".danger");
  if (!deleteBtn) {
    deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn danger";
    deleteBtn.textContent = "Delete entry";
    actions.prepend(deleteBtn);
  }

  deleteBtn.onclick = async () => {
    await deleteItem("posts", post.id);
    state.posts = state.posts.filter((item) => item.id !== post.id);
    els.entryDialog.close();
    renderJournal();
  };

  els.entryDialog.showModal();
}

function setPendingAlbumFiles(files) {
  state.pendingAlbumFiles = Array.from(files || []).filter((file) =>
    file.type.startsWith("image/")
  );
  els.photoSubmit.disabled = state.pendingAlbumFiles.length === 0;
  renderPhotoPreview(els.photoPreview, state.pendingAlbumFiles);
}

function setPendingPostFiles(files) {
  state.pendingPostFiles = Array.from(files || []).filter((file) =>
    file.type.startsWith("image/")
  );
  renderPhotoPreview(els.postPhotoPreview, state.pendingPostFiles);
}

function bindEvents() {
  els.photoInput.addEventListener("change", () => {
    setPendingAlbumFiles(els.photoInput.files);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.remove("is-dragging");
    });
  });

  els.dropzone.addEventListener("drop", (event) => {
    const files = event.dataTransfer?.files;
    if (files?.length) {
      setPendingAlbumFiles(files);
    }
  });

  els.photoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.pendingAlbumFiles.length) return;

    const records = await filesToRecords(state.pendingAlbumFiles, {
      caption: els.photoCaption.value,
      place: els.photoPlace.value,
    });

    await putMany("photos", records);
    state.photos.push(...records);
    state.pendingAlbumFiles = [];
    els.photoForm.reset();
    els.photoSubmit.disabled = true;
    renderPhotoPreview(els.photoPreview, []);
    renderAlbum();
  });

  els.postPhotos.addEventListener("change", () => {
    setPendingPostFiles(els.postPhotos.files);
  });

  els.postForm.addEventListener("reset", () => {
    state.pendingPostFiles = [];
    renderPhotoPreview(els.postPhotoPreview, []);
  });

  els.postForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const photos = await filesToRecords(state.pendingPostFiles);
    const post = {
      id: uid(),
      title: els.postTitle.value.trim(),
      place: els.postPlace.value.trim(),
      date: els.postDate.value,
      body: els.postBody.value.trim(),
      photos,
      createdAt: new Date().toISOString(),
    };

    await putItem("posts", post);
    state.posts.push(post);

    if (photos.length) {
      const albumCopies = photos.map((photo) => ({
        ...photo,
        id: uid(),
        caption: post.title,
        place: post.place,
      }));
      await putMany("photos", albumCopies);
      state.photos.push(...albumCopies);
      renderAlbum();
    }

    els.postForm.reset();
    state.pendingPostFiles = [];
    renderPhotoPreview(els.postPhotoPreview, []);
    renderJournal();
    document.getElementById("journal").scrollIntoView({ behavior: "smooth" });
  });
}

async function init() {
  const today = new Date().toISOString().slice(0, 10);
  els.postDate.value = today;

  const [photos, posts] = await Promise.all([getAll("photos"), getAll("posts")]);
  state.photos = photos;
  state.posts = posts;

  bindEvents();
  renderAlbum();
  renderJournal();

  window.addEventListener("elsewhere:trip-updated", () => {
    renderAlbum();
  });
}

init().catch((error) => {
  console.error("Elsewhere failed to start", error);
});
