const API_BASE = "http://localhost:8080";

async function import_videos() {
    // Video schema:
    // `title`: string
    // `thumbnail_url`: string
    // `video_url`: string
    // `uploader`: string
    const result = await fetch(`${API_BASE}/api/goodtube`);
    const videos = await result.json();
    const container = document.getElementById("videos");
    if (container === null) {
        return;
    }

    container.innerHTML = "";
    for (const video of videos) {
        const node = document.createElement("a");
        node.href = video.video_url;
        node.target = "_blank"; // Open in new tab
        node.innerHTML = `<img src="${video.thumbnail_url}" alt="${video.title}"/>\n`;
        node.id = "video-card";

        const title = document.createElement("h2");
        title.innerText = video.title;
        title.id = "video-title";

        const info = document.createElement("h3");
        info.innerText = video.uploader;
        info.id = "video-info"


        container.appendChild(node);
        container.appendChild(title);
        container.appendChild(info);
    }
}

import_videos().catch(console.error);
