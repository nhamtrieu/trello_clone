"use client";

import { ElementRef, useRef } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "../ui/popover";

import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board/index";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side,
    align,
    sideOffset,
}: FormPopoverProps) => {
    const proModal = useProModal();
    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess(data) {
            console.log(data);
            toast.success("Board created");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError(error) {
            toast.error(error);
            proModal.onOpen();
        },
    });
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;
        console.log(image);
        execute({ title, image });
    };
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                sideOffset={sideOffset}
                side={side}
                align={align}
                className="w-80 pt-3"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose asChild>
                    <Button
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className=" space-y-4">
                        <FormPicker id="image" errors={fieldErrors} />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit clasaName="w-full">Create</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
