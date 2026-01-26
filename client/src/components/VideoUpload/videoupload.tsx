import { useState } from "react";
import styles from "./videoupload.module.css";

type VideoUploadProps = {
    apiSource: string;
    onVideoAdded: () => void;
};

const VideoUpload = ({ apiSource, onVideoAdded }: VideoUploadProps) => {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            alert("Please enter a YouTube URL");
            return;
        }

        if (!title.trim()) {
            alert("Please enter a video title");
            return;
        }

        if (!author.trim()) {
            alert("Please enter an author name");
            return;
        }

        setIsSubmitting(true);

        // TODO: Make db connection global state with <Context> or react-query
        const baseUrl =
            apiSource === "local"
                ? "http://localhost:8080/"
                : "https://your-railway-url/";

        try {
            const response = await fetch(baseUrl + "api/goodtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, title, author }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    errorData || `HTTP error! status: ${response.status}`,
                );
            }

            alert("Video added successfully!");
            setUrl("");
            setTitle("");
            setAuthor("");
            onVideoAdded(); // Reload the video list
        } catch (error) {
            console.error("Error adding video:", error);
            alert(`Failed to add video: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.upload_container}>
            <h2>Add YouTube Video</h2>
            <form onSubmit={handleSubmit} className={styles.upload_form}>
                <div className={styles.form_group}>
                    <label htmlFor="url">YouTube URL *</label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="title">Video Title *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title"
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="author">Author/Channel *</label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author or channel name"
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submit_button}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Video"}
                </button>
            </form>
        </div>
    );
};

export default VideoUpload;
