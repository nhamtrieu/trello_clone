import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { redirect } from "next/navigation";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
    data: Board;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
    const { orgId } = auth();

    if (!orgId) redirect("/select-org");

    const board = await db.board.findUnique({
        where: {
            id: data.id,
            orgId: orgId,
        },
    });

    return (
        <div className="relative w-full h-14 z-[40] bg-black/50 flex top-14 items-center px-6 gap-x-4 text-white">
            <BoardTitleForm data={data} />
            <div className="ml-auto">
                <BoardOptions id={data.id} />
            </div>
        </div>
    );
};
