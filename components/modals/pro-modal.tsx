"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
    const proModal = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onClick = () => {
        execute({});
    };

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent className=" max-w-md p-0 overflow-hidden">
                <div className="flex items-center justify-center aspect-video relative">
                    <Image
                        src="/hero.svg"
                        alt="Hero"
                        className=" object-cover"
                        fill
                    />
                </div>
                <div className="p-6 text-neutral-700 mx-auto space-y-6">
                    <h2 className="font-semibold text-xl">
                        Update to Tasktify Pro Today!
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600">
                        Explore the best of Tasktify
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited board</li>
                            <li>Advanced checklists</li>
                            <li>Admin and security features</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <Button
                        className="w-full"
                        variant={"primary"}
                        disabled={isLoading}
                        onClick={onClick}
                    >
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
