import { useState, useEffect } from "react";
import Header from "../components/Header/header";
import DebugApi from "../components/DebugApi/debugapi";

type Video = {
    ID: string;
    title: string;
    author: string;
    views: string;
    URL: string;
};

const PLACEHOLDER_THUMBNAIL_URL = "https://placehold.co/600x400";
const Goodtube = () => {
    const [apiSource, setApiSource] = useState("local");
    const [displayApiSource, setDisplayApiSource] = useState(apiSource);
    const [videos, setVideos] = useState<Video[]>([]);

    const loadVideos = async () => {
        const url =
            apiSource === "local"
                ? "http://localhost:8080/"
                : "https://your-railway-url/";

        const data = await fetch(url + "api/goodtube" + "?page=1&count=10")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => {
                console.error(`Error fetching videos at ${apiSource}: `, error);
                alert(`Error fetching videos at ${apiSource}`);
                return null;
            });
        if (data == null) {
            return;
        }
        setDisplayApiSource(apiSource);
        setVideos(data);
    };

    useEffect(() => {
        loadVideos();
    }, [apiSource]);

    return (
        <>
            <Header />
            <DebugApi
                apiSource={apiSource}
                setApiSource={setApiSource}
                displayApiSource={displayApiSource}
            />
            <div>Text from: {displayApiSource}</div>
            <div>
                {videos.map((video) => (
                    <>
                        <img
                            src={PLACEHOLDER_THUMBNAIL_URL}
                            alt={video.title}
                        />
                        <div key={video.ID}>
                            <h3>{video.title}</h3>
                            <p>
                                {video.author} — {video.views} views
                            </p>
                            <a
                                href={video.URL}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Watch
                            </a>
                        </div>
                    </>
                ))}
            </div>
        </>
    );
};

export default Goodtube;
