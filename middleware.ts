import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            // Only allow if role is admin
            return token?.role === "admin";
        },
    },
});

export const config = {
    matcher: ["/admin/:path*"],
};
