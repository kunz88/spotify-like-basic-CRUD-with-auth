import { connection } from "../app";
import { TSong,Song } from "../models/Song";

const songs = [
  {
    "title": "Shape of You",
    "text": "The club isn't the best place to find a lover...",
    "duration": 233,
    "pictureUrl": "https://hips.hearstapps.com/hmg-prod/images/ed-sheeran-GettyImages-494227430_1600.jpg?crop=1xw:1.0xh;center,top&resize=1200:*",
    "musicalGenre": "Pop",
    "artist": "Ed Sheeran",
    "otherSongs": ["Thinking Out Loud", "Castle on the Hill", "Perfect", "Photograph"]
  },
  {
    "title": "Bohemian Rhapsody",
    "text": "Is this the real life? Is this just fantasy...",
    "duration": 355,
    "pictureUrl": "https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982",
    "musicalGenre": "Rock",
    "artist": "Queen",
    "otherSongs": ["We Will Rock You", "Another One Bites the Dust", "Don't Stop Me Now", "Under Pressure"]
  },
  {
    "title": "Hey Jude",
    "text": "Hey Jude, don't make it bad...",
    "duration": 431,
    "pictureUrl": "https://www.thebeatles.com/sites/default/files/styles/responsive_entity_queue_image_tablet/public/2024-02/thumbnail.jpg?itok=6rvHki_a",
    "musicalGenre": "Rock",
    "artist": "The Beatles",
    "otherSongs": ["Let It Be", "Yesterday", "Come Together", "Help!"]
  },
  {
    "title": "Wonderwall",
    "text": "Today is gonna be the day that they're gonna throw it back to you...",
    "duration": 258,
    "pictureUrl": "https://i.scdn.co/image/ab6761610000e5eba572b3112ccbf374488fed58",
    "musicalGenre": "Alternative Rock",
    "artist": "Oasis",
    "otherSongs": ["Don't Look Back in Anger", "Champagne Supernova", "Stop Crying Your Heart Out", "Live Forever"]
  },
  {
    "title": "La mia tipa",
    "text": "She was more like a beauty queen from a movie scene...",
    "duration": 293,
    "pictureUrl": "https://i.scdn.co/image/ab67616100005174001b450ba15d86b0023c2281",
    "musicalGenre": "trap",
    "artist": "Sfera Ebbasta",
    "otherSongs": ["Tran Tran", "Famoso", "Baby", "XNX"]
  }
]
;

// funzione che popola il database
( async() => {

    await connection
    await Song.deleteMany({})
    await Song.insertMany(songs)
})()
 