import { connection } from "../app";
import { TSong,Song } from "../models/Song";

const songs = [
    {
      "title": "Shape of You",
      "text": "The club isn't the best place to find a lover...",
      "duration": 233,
      "pictureUrl": "https://example.com/shape_of_you.jpg",
      "musicalGenre": "Pop",
      "artist": "Ed Sheeran"
    },
    {
      "title": "Bohemian Rhapsody",
      "text": "Is this the real life? Is this just fantasy...",
      "duration": 355,
      "pictureUrl": "https://example.com/bohemian_rhapsody.jpg",
      "musicalGenre": "Rock",
      "artist": "Queen"
    },
    {
      "title": "Hey Jude",
      "text": "Hey Jude, don't make it bad...",
      "duration": 431,
      "pictureUrl": "https://example.com/hey_jude.jpg",
      "musicalGenre": "Rock",
      "artist": "The Beatles"
    },
    {
      "title": "Wonderwall",
      "text": "Today is gonna be the day that they're gonna throw it back to you...",
      "duration": 258,
      "pictureUrl": "https://example.com/wonderwall.jpg",
      "musicalGenre": "Alternative Rock",
      "artist": "Oasis"
    },
    {
      "title": "Billie Jean",
      "text": "She was more like a beauty queen from a movie scene...",
      "duration": 293,
      "pictureUrl": "https://example.com/billie_jean.jpg",
      "musicalGenre": "Pop",
      "artist": "Michael Jackson"
    },
    {
      "title": "Hotel California",
      "text": "On a dark desert highway, cool wind in my hair...",
      "duration": 391,
      "pictureUrl": "https://example.com/hotel_california.jpg",
      "musicalGenre": "Rock",
      "artist": "Eagles"
    },
    {
      "title": "Rolling in the Deep",
      "text": "There's a fire starting in my heart...",
      "duration": 228,
      "pictureUrl": "https://example.com/rolling_in_the_deep.jpg",
      "musicalGenre": "Soul, Blues",
      "artist": "Adele"
    },
    {
      "title": "Smells Like Teen Spirit",
      "text": "Load up on guns, bring your friends...",
      "duration": 301,
      "pictureUrl": "https://example.com/smells_like_teen_spirit.jpg",
      "musicalGenre": "Grunge",
      "artist": "Nirvana"
    },
    {
      "title": "Let It Be",
      "text": "When I find myself in times of trouble...",
      "duration": 243,
      "pictureUrl": "https://example.com/let_it_be.jpg",
      "musicalGenre": "Rock",
      "artist": "The Beatles"
    },
    {
      "title": "Thriller",
      "text": "It's close to midnight and something evil's lurking in the dark...",
      "duration": 357,
      "pictureUrl": "https://example.com/thriller.jpg",
      "musicalGenre": "Pop, Funk, Disco",
      "artist": "Michael Jackson"
    }
  ];

// funzione che popola il database
( async() => {

    await connection
    await Song.deleteMany({})
    await Song.insertMany(songs)
})()
 