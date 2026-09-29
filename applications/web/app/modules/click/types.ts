export type Click = {
    id: string;
    shortCode: string;
    referrer: string | null;
    createdAt: Date;
};

export type RegisteredClick = {
    originalUrl: string;
};
