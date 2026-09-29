
export default interface DatabaseClientInterface<Client = unknown> {
    connect(): Client;
    close(): Promise<void>;
}