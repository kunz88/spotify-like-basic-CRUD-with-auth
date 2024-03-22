import { Schema, model } from "mongoose";
// creo il tipo per lo schema
export type TSong = {
    title: string;
    text: string;
    duration: number;
    pictureUrl: string;
    musicalGenre: string;
    artist: string;
    otherSongs:string[];
};
const songSchema = new Schema<TSong>({
    title: { type: String, required: true, unique:true },
    text: { type: String },
    duration: { type: Number, required: true },
    pictureUrl: String,
    musicalGenre: String,
    artist: { type: String, required: true },
    otherSongs:Array
});
export const Song = model<TSong>("Song", songSchema);