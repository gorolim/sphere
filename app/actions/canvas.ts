"use server";

import { prisma as db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const isAdmin = async () => {
    const { userId } = await auth();
    if (!userId) return false;
    
    const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
    });
    
    return dbUser?.role === "admin";
};

export async function getCanvasBoards() {
    if (!(await isAdmin())) return { error: "Unauthorized" };

    try {
        const boards = await db.canvasBoard.findMany({
            select: {
                id: true,
                title: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" }
        });
        return { data: boards };
    } catch (e) {
        console.error("Failed to fetch canvas boards", e);
        return { error: "Failed to fetch boards" };
    }
}

export async function getCanvasState(id: string) {
    if (!(await isAdmin())) return { error: "Unauthorized" };

    try {
        const board = await db.canvasBoard.findUnique({
            where: { id }
        });
        if (!board) return { error: "Board not found" };
        
        return { data: board.state };
    } catch (e) {
        console.error("Failed to fetch canvas state", e);
        return { error: "Failed to fetch state" };
    }
}

export async function createCanvasBoard(title: string = "Untitled Canvas") {
    if (!(await isAdmin())) return { error: "Unauthorized" };

    try {
        const newBoard = await db.canvasBoard.create({
            data: {
                title,
                state: {} // Empty JSON object to start
            }
        });
        return { data: newBoard };
    } catch (e) {
        console.error("Failed to create canvas board", e);
        return { error: "Failed to create board" };
    }
}

export async function updateCanvasBoard(id: string, title?: string, state?: any) {
    if (!(await isAdmin())) return { error: "Unauthorized" };

    try {
        const data: any = {};
        if (title !== undefined) data.title = title;
        if (state !== undefined) data.state = state;

        const updatedBoard = await db.canvasBoard.update({
            where: { id },
            data
        });
        return { success: true };
    } catch (e) {
        console.error("Failed to update canvas board", e);
        return { error: "Failed to update board" };
    }
}

export async function deleteCanvasBoard(id: string) {
    if (!(await isAdmin())) return { error: "Unauthorized" };

    try {
        await db.canvasBoard.delete({
            where: { id }
        });
        return { success: true };
    } catch (e) {
        console.error("Failed to delete canvas board", e);
        return { error: "Failed to delete board" };
    }
}
