import { type Bingocard } from "./Bingocard";
import { type Sportsclub } from "./Sportsclub";

export interface User
{
    id: string
    username: string
    password: string
    email: string
    isAdmin: boolean
    isPremium: boolean
    cardsAmount: number
    sharedCardsAmount: number

    bingocards: Bingocard[]
    sportsclubs: Sportsclub[]
}