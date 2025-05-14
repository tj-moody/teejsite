// const API_BASE = window.location.hostname === "localhost"
//   ? "http://localhost:8080"
//   : "https://teejsite-production.up.railway.app";

const API_BASE = "https://teejsite-production.up.railway.app";
// const API_BASE = "http://localhost:8080";
async function request(path: string) {
    // TODO: Proper checks for possible different responses
    const address = API_BASE + path;
    console.log(`Fetching from ${address}`)
    const result = await fetch(`${address}`);
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    const response = await result.json();
    return response;
}

async function import_videos() {
    // Video schema:
    // `title`: string
    // `thumbnail_url`: string
    // `video_url`: string
    // `uploader`: string
    const videos = await request("/api/goodtube");
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
