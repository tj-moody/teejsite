package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Video struct {
	Title        string `json:"title"`
	ThumbnailURL string `json:"thumbnail_url"`
	VideoURL     string `json:"video_url"`
	Uploader     string `json:"uploader"`
}

var VIDEOS = []Video{
	{
		Title:        "Classic - MKTO",
		ThumbnailURL: "https://placehold.co/600x400",
		VideoURL:     "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Uploader:     "user1",
	},
	{
		Title:        "Let Down - Radiohead",
		ThumbnailURL: "https://placehold.co/600x400",
		VideoURL:     "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Uploader:     "user2",
	},
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // or specific domain for security
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func HandleVideos(w http.ResponseWriter, r *http.Request) {
	videos := VIDEOS
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videos)
}

func handleWithCors(handler func(w http.ResponseWriter, r *http.Request)) {
	http.HandleFunc("/api/goodtube", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request", r.Method, r.URL.Path, r.Header)
		enableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		handler(w, r)

	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback
	}
	handleWithCors(HandleVideos)
	log.Println("Server running at http://localhost:" + port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}
