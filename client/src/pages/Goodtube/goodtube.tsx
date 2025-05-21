import { useState, useEffect } from "react";
import Header from "../../components/Header/header";
import DebugApi from "../../components/DebugApi/debugapi";
import VideoPane from "../../components/VideoPane/videopane";
import styles from "./goodtube.module.css";

export type Video = {
    id: string;
    title: string;
    author: string;
    views: string;
    url: string;
};

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
            <div className={styles.video_grid}>
                {videos.map((video) => (
                    <VideoPane key={video.id} video={video} />
                ))}
            </div>
        </>
    );
};

export default Goodtube;
