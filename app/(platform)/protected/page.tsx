"use client";

import { UserButton, useAuth } from "@clerk/nextjs";

const ProtectedPage = () => {
    const user = useAuth();
    return (
        <div>
            <UserButton afterSignOutUrl="/" />
        </div>
    );
};
export default ProtectedPage;
