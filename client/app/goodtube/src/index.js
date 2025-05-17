"use strict";
// const API_BASE = window.location.hostname === "localhost"
//   ? "http://localhost:8080"
//   : "https://teejsite-production.up.railway.app";
const LOCAL_API_BASE = "http://localhost:8080";
const CLOUD_API_BASE = "https://teejsite-production.up.railway.app";
let api_base = CLOUD_API_BASE;
// const API_BASE = "http://localhost:8080";
async function request(path) {
    // TODO: Proper checks for possible different responses
    const address = api_base + path;
    console.log(`Fetching from ${address}`);
    const result = await fetch(`${address}`);
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    const response = await result.json();
    return response;
}
const PLACEHOLDER_THUMBNAIL_URL = "https://placehold.co/600x400";
async function import_videos() {
    // Video schema:
    // `title`: string
    // `thumbnail_url`: string
    // `video_url`: string
    // `uploader`: string
    const page = 1;
    const count = 10;
    const result = request(`/api/goodtube?page=${page}&count=${count}`);
    if (result === null) {
        console.error("Request to " + api_base + "/api/goodtube failed");
        return null;
    }
    const videos = await result;
    const container = document.getElementById("videos");
    if (container === null) {
        console.error("Failed to access videos container from index.html");
        return null;
    }
    container.innerHTML = "";
    for (const video of videos) {
        const node = document.createElement("a");
        node.href = video.video_url;
        node.target = "_blank"; // Open in new tab
        node.innerHTML = `<img src="${PLACEHOLDER_THUMBNAIL_URL}" alt="${video.title}"/>\n`;
        node.id = "video-card";
        const title = document.createElement("h2");
        title.innerText = video.title;
        title.id = "video-title";
        const info = document.createElement("h3");
        info.innerText = video.uploader;
        info.id = "video-info";
        container.appendChild(node);
        container.appendChild(title);
        container.appendChild(info);
    }
    const api_debug = document.getElementById("api-debug");
    if (api_debug) {
        api_debug.innerText = "Text from: " + api_base;
    }
}
async function select_api() {
    const selectElement = document.getElementById("select-api");
    const selected_api = selectElement.options[selectElement.selectedIndex];
    if (selected_api.value === "local") {
        api_base = LOCAL_API_BASE;
    }
    else if (selected_api.value === "cloud") {
        api_base = CLOUD_API_BASE;
    }
    else {
        console.error("Invalid API option");
    }
    const result = await import_videos();
    if (result !== null) {
        console.log("Successfully fetched videos from " + selected_api.value);
    }
}
import_videos().catch(console.error);
