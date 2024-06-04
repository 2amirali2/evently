import { connectToDB } from "../db"
import User from "../models/user.model"


export async function fetchUser(userId: string) {
    try {
        connectToDB()

        return await User.findOne({ id: userId }) 
    } catch (error: any) {
        throw new Error(`Faild to fetch user: ${error.message}`)
    }
}