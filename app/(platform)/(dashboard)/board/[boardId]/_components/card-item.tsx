"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
    data: Card;
    index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
    const cardModal = useCardModal();
    return (
        <Draggable draggableId={data.id} index={index}>
            {(provider) => {
                return (
                    <div
                        {...provider.draggableProps}
                        {...provider.dragHandleProps}
                        ref={provider.innerRef}
                        role="button"
                        className="truncate border-2 border-transparent hover:border-black
                       py-2 px-3 text-sm bg-white rounded-sm shadow-sm"
                        onClick={() => cardModal.onOpen(data.id)}
                    >
                        {data.title}
                    </div>
                );
            }}
        </Draggable>
    );
};
