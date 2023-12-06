"use client";
import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/type";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface ListItemProps {
    data: ListWithCards;
    index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const disableEditing = () => setIsEditing(false);
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };
    return (
        <Draggable draggableId={data.id} index={index}>
            {(provider) => {
                return (
                    <li
                        {...provider.draggableProps}
                        ref={provider.innerRef}
                        className=" shrink-0 h-full w-[272px] select-none"
                    >
                        <div
                            {...provider.dragHandleProps}
                            className=" w-full rounded-md bg-[#f1f2f4] shadow-sm pb-2"
                        >
                            <ListHeader onAddCard={enableEditing} data={data} />
                            <Droppable droppableId={data.id} type="card">
                                {(provider) => {
                                    return (
                                        <ol
                                            ref={provider.innerRef}
                                            {...provider.droppableProps}
                                            className={cn(
                                                "mx-1 px-1 py-0.5 flex flex-col gap-y-2"
                                            )}
                                        >
                                            {data.cards.map((card, index) => {
                                                return (
                                                    <CardItem
                                                        key={card.id}
                                                        data={card}
                                                        index={index}
                                                    />
                                                );
                                            })}
                                            {provider.placeholder}
                                        </ol>
                                    );
                                }}
                            </Droppable>

                            <CardForm
                                listId={data.id}
                                ref={textareaRef}
                                isEditing={isEditing}
                                enableEditing={enableEditing}
                                disableEditing={disableEditing}
                            />
                        </div>
                    </li>
                );
            }}
        </Draggable>
    );
};
