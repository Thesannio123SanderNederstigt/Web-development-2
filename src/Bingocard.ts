import { type cardItem } from "./cardItem";

export interface Bingocard
{
    id: string
    userId: string
    score: number
    size: number
    creationDate: string
    lastAccessedOn: string

    items: cardItem[]
}