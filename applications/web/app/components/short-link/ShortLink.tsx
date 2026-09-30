import { useEffect, useState } from "react";
import checkIcon from "@app/assets/img/check.svg";
import copyIcon from "@app/assets/img/copy.svg";

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
                            <img src={checkIcon} alt="Check Icon" aria-hidden="true" className="size-4"/>
                            <span role="status" className="text-green-600">Copied</span>
                        </>
                    ) : (
                        <>
                            <img src={copyIcon} alt="Copy Icon" aria-hidden="true" className="size-4"/>
                            <span id="copy-label" role="status">Copy</span>
                        </>
                    )}
                </button>
            </div>
        </section>
    );
};

export default ShortLink;
