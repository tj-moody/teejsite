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

var VIDEOS = []Video{// {{{
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
}// }}}

func initDB() (*Database, error) {
	dbURL := os.Getenv("DB_URL")
	if dbURL == "none" {
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

func (d *Database) close() {
	d.conn.Close()
}
