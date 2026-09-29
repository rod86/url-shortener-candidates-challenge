import { useState, type FormEvent } from "react";
import { Form } from "react-router";

type ShortLinkFormProps = {
    onSubmit: (url: string) => void;
    isLoading?: boolean;
};

const ShortLinkForm = ({ onSubmit, isLoading = false }: ShortLinkFormProps) => {
    const [url, setUrl] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(url);
    };

    return (
    <Form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-2.5 mb-5">
        <label htmlFor="long-url" className="text-sm font-medium text-ink-soft">URL</label>
        <div className="flex flex-col gap-3 sm:flex-row">
            <input
                id="long-url"
                name="url"
                type="url"
                required
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/a/very/long/path"
                className="h-13 grow rounded-md border border-field bg-white px-4 text-base text-ink placeholder:text-muted/70
                            outline-none transition focus:ring-4 focus:ring-accent/10
                            aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/10"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="h-13 cursor-pointer rounded-md bg-accent px-6 text-base font-medium text-white transition
                       hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                       disabled:cursor-wait disabled:opacity-70">
                Shorten
            </button>
        </div>
    </Form>
    );
};

export default ShortLinkForm;
