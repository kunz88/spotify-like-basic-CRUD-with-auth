import { connection } from "../app";
import { TSong,Song } from "../models/Song";

const songs = [
    {
      "title": "Shape of You",
      "text": "The club isn't the best place to find a lover...",
      "duration": 233,
      "pictureUrl": "https://compass-media.vogue.it/photos/641ae5b1ded655b2749bbcc1/2:3/w_2560%2Cc_limit/Ed%2520Sheeran%2520docuserie%2520(2).jpg",
      "musicalGenre": "Pop",
      "artist": "Ed Sheeran"
    },
    {
      "title": "Bohemian Rhapsody",
      "text": "Is this the real life? Is this just fantasy...",
      "duration": 355,
      "pictureUrl": "https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982",
      "musicalGenre": "Rock",
      "artist": "Queen"
    },
    {
      "title": "Hey Jude",
      "text": "Hey Jude, don't make it bad...",
      "duration": 431,
      "pictureUrl": "https://i.scdn.co/image/ab67616100005174001b450ba15d86b0023c2281",
      "musicalGenre": "Rock",
      "artist": "The Beatles"
    },
    {
      "title": "Wonderwall",
      "text": "Today is gonna be the day that they're gonna throw it back to you...",
      "duration": 258,
      "pictureUrl": "https://i.scdn.co/image/ab67616100005174001b450ba15d86b0023c2281",
      "musicalGenre": "Alternative Rock",
      "artist": "Oasis"
    },
    {
      "title": "Billie Jean",
      "text": "She was more like a beauty queen from a movie scene...",
      "duration": 293,
      "pictureUrl": "https://i.scdn.co/image/ab67616100005174001b450ba15d86b0023c2281",
      "musicalGenre": "Pop",
      "artist": "Michael Jackson"
    },

  ];

// funzione che popola il database
( async() => {

    await connection
    await Song.deleteMany({})
    await Song.insertMany(songs)
})()
 