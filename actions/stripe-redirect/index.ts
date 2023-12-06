"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const handle = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const user = await currentUser();
    if (!userId || !orgId || !user) {
        return {
            error: "Unauthorized",
        };
    }

    const settingsUrl = absoluteUrl(`/organization/${orgId}`);

    let url = "";
    try {
        const orgSubcription = await db.orgSubscription.findUnique({
            where: {
                orgId,
            },
        });
        if (orgSubcription && orgSubcription.stripeCustomerId) {
            const stripeSesstion = await stripe.billingPortal.sessions.create({
                customer: orgSubcription.stripeCustomerId,
                return_url: settingsUrl,
            });
            url = stripeSesstion.url;
        } else {
            const stripeSesstion = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "Tasktift Pro",
                                description: "Unlimited boards and more!",
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month",
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    orgId,
                },
            });
            url = stripeSesstion.url || "";
        }
    } catch (error) {
        return {
            error: "Something went wrong. Please try again later.",
        };
    }
    revalidatePath(`/organization/${orgId}`);
    return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handle);
