import { Schema, model } from "mongoose";

export type TUser = {
    name: string;
    email: string;
    avatar?: string;
    password: string;
    confirmedUuid?: string;// attributo per la conferma , servirà per conservare l'uuid da utilizzare per la conferma della mail
    confirmedMail: boolean;// di default false, diventerà true non appena l'utente confermerà la mail
};

const userSchema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },// l'email sarà univoca all'interno dal database
    password: { type: String, required: true },
    confirmedMail: { type: Boolean, default: false },
    confirmedUuid: String,
    avatar: String,
});

export const User = model<TUser>("User", userSchema);


[
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "P@ssw0rd123",
        "avatar": "https://example.com/avatar1.jpg"
    },
    {
        "name": "Alice Smith",
        "email": "alice.smith@example.com",
        "password": "Secret123!",
        "avatar": "https://example.com/avatar2.jpg"
    },
    {
        "name": "Michael Johnson",
        "email": "michael.johnson@example.com",
        "password": "MyP@ssw0rd",
        "avatar": "https://example.com/avatar3.jpg"
    },
    {
        "name": "Emily Brown",
        "email": "emily.brown@example.com",
        "password": "Brownie456",
        "avatar": "https://example.com/avatar4.jpg"
    },
    {
        "name": "Daniel Wilson",
        "email": "daniel.wilson@example.com",
        "password": "W1ls0nD@n",
        "avatar": "https://example.com/avatar5.jpg"
    },
    {
        "name": "Sophia Lee",
        "email": "sophia.lee@example.com",
        "password": "P@ssw0rd!",
        "avatar": "https://example.com/avatar6.jpg"
    },
    {
        "name": "James Anderson",
        "email": "james.anderson@example.com",
        "password": "Anderson123",
        "avatar": "https://example.com/avatar7.jpg"
    },
    {
        "name": "Olivia Martinez",
        "email": "olivia.martinez@example.com",
        "password": "Martinez@321",
        "avatar": "https://example.com/avatar8.jpg"
    },
    {
        "name": "Liam Taylor",
        "email": "liam.taylor@example.com",
        "password": "Tayl0rL1@m",
        "avatar": "https://example.com/avatar9.jpg"
    },
    {
        "name": "Emma Brown",
        "email": "emma.brown@example.com",
        "password": "BrownEmma789",
        "avatar": "https://example.com/avatar10.jpg"
    }
]
