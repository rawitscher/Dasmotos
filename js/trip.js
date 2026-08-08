(() => {
  const els = {
    tripName: document.getElementById("trip-name"),
    tripPhone: document.getElementById("trip-phone"),
    tripHelp: document.getElementById("trip-help"),
    tripTips: document.getElementById("trip-tips"),
    momentList: document.getElementById("moment-list"),
    momentEmpty: document.getElementById("moment-empty"),
    demoPanel: document.getElementById("demo-panel"),
    demoForm: document.getElementById("demo-form"),
    demoBody: document.getElementById("demo-body"),
    demoMedia: document.getElementById("demo-media"),
  };

  const state = {
    online: false,
    moments: [],
    trip: null,
    status: null,
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatWhen(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function kindLabel(kind) {
    if (kind === "photo") return "Photo";
    if (kind === "voice") return "Voice memo";
    if (kind === "video") return "Video";
    return "Note";
  }

  function formatPhoneDisplay(value) {
    if (!value) return "Number not set yet";
    const digits = String(value).replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return value;
  }

  async function api(path, options) {
    const response = await fetch(path, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed (${response.status})`);
    }
    const type = response.headers.get("content-type") || "";
    if (type.includes("application/json")) return response.json();
    return response.text();
  }

  function renderStatus() {
    if (!state.online) {
      els.tripName.textContent = "Trip inbox offline";
      els.tripPhone.textContent = "Start the server";
      els.tripHelp.textContent =
        "Run npm start inside /server, then refresh. Demo texting works even before Twilio is connected.";
      els.tripTips.innerHTML = "";
      els.demoPanel.hidden = true;
      return;
    }

    const status = state.status || {};
    const trip = state.trip || status.trip || {};
    els.tripName.textContent = trip.name || "Current trip";
    els.tripPhone.textContent = status.twilioConfigured
      ? formatPhoneDisplay(status.phoneNumber)
      : "Add your Twilio number";
    els.tripHelp.textContent = status.twilioConfigured
      ? "Text a photo or voice memo to this number (SMS/MMS — green bubble on iPhone)."
      : "Twilio isn’t connected yet. Use the demo form below, or add keys in server/.env.";

    els.tripTips.innerHTML = (status.tips || [])
      .map((tip) => `<li>${escapeHtml(tip)}</li>`)
      .join("");

    els.demoPanel.hidden = false;
  }

  function renderMoments() {
    els.momentList.innerHTML = "";
    const moments = state.moments || [];
    els.momentEmpty.classList.toggle("hidden", moments.length > 0);

    moments.forEach((moment, index) => {
      const article = document.createElement("article");
      article.className = "moment";
      article.style.animationDelay = `${Math.min(index, 8) * 40}ms`;

      const top = document.createElement("div");
      top.className = "moment-top";
      top.innerHTML = `
        <span class="moment-kind">${escapeHtml(kindLabel(moment.kind))}</span>
        <span class="moment-time">${escapeHtml(formatWhen(moment.createdAt))}</span>
      `;
      article.appendChild(top);

      if (moment.text) {
        const text = document.createElement("p");
        text.className = "moment-text";
        text.textContent = moment.text;
        article.appendChild(text);
      }

      if (moment.kind === "photo" && moment.mediaUrl) {
        const img = document.createElement("img");
        img.className = "moment-photo";
        img.src = moment.mediaUrl;
        img.alt = moment.text || "Texted-in travel photo";
        img.loading = "lazy";
        article.appendChild(img);
      }

      if (moment.kind === "voice" && moment.mediaUrl) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = moment.mediaUrl;
        article.appendChild(audio);
      }

      if (moment.kind === "video" && moment.mediaUrl) {
        const video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";
        video.src = moment.mediaUrl;
        video.className = "moment-photo";
        article.appendChild(video);
      }

      const actions = document.createElement("div");
      actions.className = "moment-actions";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn danger";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => {
        await api(`/api/moments/${moment.id}`, { method: "DELETE" });
        state.moments = state.moments.filter((item) => item.id !== moment.id);
        renderMoments();
        window.dispatchEvent(new CustomEvent("elsewhere:trip-updated"));
      });
      actions.appendChild(remove);
      article.appendChild(actions);

      els.momentList.appendChild(article);
    });
  }

  async function refresh() {
    try {
      const [status, tripState] = await Promise.all([
        api("/api/status"),
        api("/api/trip"),
      ]);
      state.online = true;
      state.status = status;
      state.trip = tripState.trip;
      state.moments = tripState.moments || [];
      renderStatus();
      renderMoments();
      window.dispatchEvent(
        new CustomEvent("elsewhere:trip-updated", { detail: { moments: state.moments } })
      );
    } catch (_error) {
      state.online = false;
      state.moments = [];
      renderStatus();
      renderMoments();
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function bindDemo() {
    els.demoForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const body = els.demoBody.value.trim();
      const file = els.demoMedia.files?.[0];
      const media = [];

      if (file) {
        media.push({
          dataUrl: await fileToDataUrl(file),
          contentType: file.type,
          filename: file.name,
        });
      }

      if (!body && !media.length) return;

      await api("/api/demo/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, media }),
      });

      els.demoForm.reset();
      await refresh();
    });
  }

  window.ElsewhereTrip = {
    refresh,
    getMoments: () => state.moments,
    isOnline: () => state.online,
  };

  bindDemo();
  refresh();
  setInterval(refresh, 8000);
})();
