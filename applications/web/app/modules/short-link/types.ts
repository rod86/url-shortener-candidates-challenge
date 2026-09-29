export type CreateShortCodeRequest = {
    id: string;
    url: string;
    createdAt: Date;
};

export type CreateShortCodeResponse = {
    shortCode: string;
};
