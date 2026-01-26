package main

import (
	"database/sql"
	"errors"
	_ "github.com/lib/pq"
	"log"
	"os"
)

type Database struct {
	conn *sql.DB
}

type Video struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Views  int    `json:"views"`
	URL    string `json:"url"`
}

var VIDEOS = []Video{ // {{{
	{
		ID:     0,
		Title:  "Classic - MKTO",
		URL:    "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Author: "user1",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Let Down - Radiohead",
		URL:    "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Author: "user2",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Classic - MKTO",
		URL:    "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Author: "user1",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Let Down - Radiohead",
		URL:    "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Author: "user2",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Classic - MKTO",
		URL:    "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Author: "user1",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Let Down - Radiohead",
		URL:    "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Author: "user2",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Classic - MKTO",
		URL:    "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Author: "user1",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Let Down - Radiohead",
		URL:    "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Author: "user2",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Classic - MKTO",
		URL:    "https://www.youtube.com/watch?v=4Ba_qTPA4Ds",
		Author: "user1",
		Views:  0,
	},
	{
		ID:     0,
		Title:  "Let Down - Radiohead",
		URL:    "https://www.youtube.com/watch?v=ZVgHPSyEIqk",
		Author: "user2",
		Views:  0,
	},
} // }}}

func initDB() (*Database, error) {
	dbURL := os.Getenv("DB_URL")
	if dbURL == "none" {
		log.Println("In no-DB cloud environment, using dummy DB")
		return nil, nil
	}
	if dbURL == "" {
		return nil, errors.New("DB_URL not set in environment")
	}
	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}

	err = conn.Ping()
	if err != nil {
		return nil, err
	}

	return &Database{conn}, nil
}

// REQUIRES:
// `page_number` >= 1
// `page_size` >= 1
func (d *Database) getVideos(page_size int, page_number int) ([]Video, error) {
	env := os.Getenv("ENV")
	if env != "local" {
		log.Println("Database not accessible in this environment")
		return VIDEOS, nil
	}
	offset := (page_number - 1) * page_size
	rows, err := d.conn.Query(
		"SELECT id, title, author, views, url FROM videos ORDER BY id DESC LIMIT $1 OFFSET $2",
		page_size, offset,
	)
	if err != nil {
		log.Println("Failed to fetch videos from db: ", err)
		return nil, err
	}
	defer rows.Close()

	var videos []Video
	for rows.Next() {
		var v Video
		if err := rows.Scan(&v.ID, &v.Title, &v.Author, &v.Views, &v.URL); err != nil {
			return nil, err
		}
		videos = append(videos, v)
	}
	return videos, nil
}

func (d *Database) addVideo(url string, title string, author string) error {
	if !isValidYouTubeURL(url) {
		return errors.New("invalid YouTube URL")
	}

	if title == "" {
		return errors.New("title cannot be empty")
	}

	if author == "" {
		return errors.New("author cannot be empty")
	}

	var exists bool
	err := d.conn.QueryRow("SELECT EXISTS(SELECT 1 FROM videos WHERE url = $1)", url).Scan(&exists)
	if err != nil {
		log.Println("Error checking for existing video:", err)
		return err
	}

	if exists {
		return errors.New("video already exists in database")
	}

	_, err = d.conn.Exec(
		"INSERT INTO videos (title, author, views, url) VALUES ($1, $2, $3, $4)",
		title,
		author,
		0, // TODO: Update views
		url,
	)

	if err != nil {
		log.Println("Error inserting video:", err)
		return err
	}

	log.Println("Successfully added video:", title, "by", author)
	return nil
}

func isValidYouTubeURL(url string) bool {
	return len(url) > 0 && ((len(url) > 23 && url[:24] == "https://www.youtube.com/") ||
		(len(url) > 19 && url[:20] == "http://www.youtube.com/") ||
		(len(url) > 16 && url[:17] == "https://youtu.be/") ||
		(len(url) > 15 && url[:16] == "http://youtu.be/"))
}

func extractYouTubeID(url string) string {
	if len(url) > 17 && url[:17] == "https://youtu.be/" {
		videoID := url[17:]
		if idx := indexOf(videoID, '?'); idx != -1 {
			videoID = videoID[:idx]
		}
		return videoID
	}
	if len(url) > 16 && url[:16] == "http://youtu.be/" {
		videoID := url[16:]
		if idx := indexOf(videoID, '?'); idx != -1 {
			videoID = videoID[:idx]
		}
		return videoID
	}

	vIndex := indexOfStr(url, "v=")
	if vIndex == -1 {
		return ""
	}

	videoID := url[vIndex+2:]
	if idx := indexOf(videoID, '&'); idx != -1 {
		videoID = videoID[:idx]
	}

	return videoID
}

func indexOf(s string, char byte) int {
	for i := 0; i < len(s); i++ {
		if s[i] == char {
			return i
		}
	}
	return -1
}

func indexOfStr(s string, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

func (d *Database) close() {
	d.conn.Close()
}
