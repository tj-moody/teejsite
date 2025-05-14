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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token")

	w.Header().Set("Vary", "Origin")
	w.Header().Set("Vary", "Access-Control-Request-Method")
	w.Header().Set("Vary", "Access-Control-Request-Headers")
}

func handleWithCors(handler func(w http.ResponseWriter, r *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		log.Println("Request", r.Method, r.URL.Path, r.Header)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		handler(w, r)

	}
}

func HandleVideos(w http.ResponseWriter, r *http.Request) {
	videos := VIDEOS
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(videos)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Server is running"))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Println("$PORT not found... defaulting to 8080")
		port = "8080"
	} else {
		log.Println("$PORT found... assigned " + port)
	}

	http.HandleFunc("/", handleWithCors(rootHandler))
	http.HandleFunc("/api/goodtube", handleWithCors(HandleVideos))

	server := &http.Server{
		Addr:    ":" + port, // Will bind to all interfaces by default
		Handler: nil,        // Using default mux
	}

	log.Println("Server running at http://0.0.0.0:" + port)
	err := server.ListenAndServe()
	if err != nil {
		log.Fatalf("Server failed: %s", err)
	}
}
