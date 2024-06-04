"use server"

import { connectToDB } from "../db"
import Category from "../models/category.model"

export async function createCategory({ categoryName }: { categoryName: string }) {
    try {
        connectToDB()

        const newCategory = await Category.create({
            name: categoryName
        })
        return JSON.parse(JSON.stringify(newCategory));
    } catch (error: any) {
        throw new Error(`Faild to create category: ${error.message}`)
    }
}

export async function getAllCategories() {
    try {
        connectToDB()

        const categories = await Category.find()

        return JSON.parse(JSON.stringify(categories));

    } catch (error: any) {
        throw new Error(`Faild to fetch categories: ${error.message}`)
    }
}