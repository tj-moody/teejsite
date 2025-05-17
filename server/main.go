package main

import (
	"log"
	"net/http"
)

func main() {
	db, err := initDB()
	if err != nil {
		log.Fatal("Failed to open DB: ", err)
	}
	defer db.close()

	server := Server{db}

	http.HandleFunc("/", handleWithCors(server.rootHandler))
	http.HandleFunc("/api/goodtube", handleWithCors(server.goodtubeHandler))

	port := getPort()
	log.Println("Server running at http://0.0.0.0:" + port)
	err = http.ListenAndServe("0.0.0.0:"+port, nil)
	if err != nil {
		log.Fatalf("Server failed: %s", err)
	}
}
