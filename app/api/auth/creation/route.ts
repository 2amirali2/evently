import { connectToDB } from "@/lib/db"
import User from "@/lib/models/user.model"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    connectToDB()
    const { getUser } = getKindeServerSession()

    const user = await getUser()

    if (!user || user === null || !user.id) {
      // throw new Error("Something went wrong. I'm sorry")
      return null
    }

    let dbUser = await User.findOne({ id: user.id })

    if (!dbUser) {
      dbUser = await User.create({
        id: user.id,
        email: user.email ?? "",
        familyName: user.family_name ?? "",
        givenName: user.given_name ?? "",
        picture: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      })
    }

    return NextResponse.redirect("http://localhost:3000")
  } catch (error: any) {
    throw new Error(`Failed to fetch or create User: ${error.message}`)
  }
}