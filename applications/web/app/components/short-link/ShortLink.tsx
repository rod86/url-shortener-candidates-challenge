import { useEffect, useState } from "react";

const COPIED_FEEDBACK_MS = 2000;

type ShortLinkProps = {
    url: string;
};

const ShortLink = ({ url }: ShortLinkProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
        return () => clearTimeout(timeout);
    }, [copied]);

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
    };

    return (
        <section
            id="result"
            aria-labelledby="result-label"
            className="flex flex-col gap-3.5 rounded-md border border-line bg-white p-6 mt-10">
            <h2 id="result-label" className="text-sm font-medium uppercase tracking-wider text-muted mb-3">
                Your short link
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    id="short-url"
                    href={url}
                    target="_blank"
                    className="flex h-13 grow items-center truncate rounded-md bg-accent-soft px-4 font-mono font-medium text-accent hover:text-accent-hover">
                    {url}
                </a>
                <button
                    id="copy-btn"
                    name="copy"
                    type="button"
                    onClick={copy}
                    className="flex h-13 min-w-28 cursor-pointer items-center justify-center gap-2 rounded-md border border-field bg-white px-4.5 text-[15px] font-medium text-ink transition hover:bg-canvas">

                    {copied ? (
                        <>
                            <svg className="size-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                            <span role="status" className="text-green-600">Copied</span>
                        </>
                    ) : (
                        <>
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            <span id="copy-label" role="status">Copy</span>
                        </>
                    )}
                </button>
            </div>
        </section>
    );
};

export default ShortLink;
