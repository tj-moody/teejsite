package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Server struct {
	db *Database
}

type VideoUploadRequest struct {
	URL    string `json:"url"`
	Title  string `json:"title"`
	Author string `json:"author"`
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

// Update the POST handler
func (s *Server) goodtubePostHandler(w http.ResponseWriter, r *http.Request) {
	var req VideoUploadRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.URL == "" {
		http.Error(w, "URL is required", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if req.Author == "" {
		http.Error(w, "Author is required", http.StatusBadRequest)
		return
	}

	err = s.db.addVideo(req.URL, req.Title, req.Author)
	if err != nil {
		log.Println("Error adding video:", err)
		http.Error(w, "Failed to add video: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Video added successfully",
	})
}

func (s *Server) goodtubeGetHandler(w http.ResponseWriter, r *http.Request) {
	countStr := r.URL.Query().Get("count")
	pageStr := r.URL.Query().Get("page")

	count, err := strconv.Atoi(countStr)
	if err != nil {
		http.Error(w, "Invalid `count`: "+countStr, http.StatusBadRequest)
	}
	if count <= 0 {
		count = 10
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil {
		http.Error(w, "Invalid `page`: "+pageStr, http.StatusBadRequest)
	}
	if page < 1 {
		page = 1
	}
	videos, err := s.db.getVideos(count, page)
	if err != nil {
		http.Error(w, "Internal database error", http.StatusInternalServerError)
		return
	}

	// videos := VIDEOS
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(videos)

}

func (s *Server) goodtubeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		s.goodtubeGetHandler(w, r)
	} else if r.Method == http.MethodPost {
		s.goodtubePostHandler(w, r)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

func (s *Server) rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Server is running"))
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		log.Println("$PORT not found... defaulting to 8080")
		port = "8080"
	} else {
		log.Println("$PORT found... assigned " + port)
	}
	return port
}
