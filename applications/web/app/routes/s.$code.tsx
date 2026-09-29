import { isRouteErrorResponse, redirect } from "react-router";
import type { Route } from "./+types/s.$code";
import ErrorMessage from "@app/components/global/ErrorMessage";
import { registerClickHandler } from "@app/modules/click/services";
import { ShortLinkNotFoundError } from "@app/modules/click/errors";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const { originalUrl } = await registerClickHandler.handle({
      shortCode: params.code,
      referrer: request.headers.get("referer"),
    });

    return redirect(originalUrl);
  } catch (error) {
    if (error instanceof ShortLinkNotFoundError) {
      throw new Response("Not Found", { status: 404, statusText: "Not Found" });
    }
    throw new Response("Internal Server Error", { status: 500, statusText: "Internal Server Error" });
  }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message =
    isRouteErrorResponse(error) && error.status === 404
      ? "This short link doesn't exist."
      : "Something went wrong. Please try again.";

  return (
    <main className="container mx-auto p-4">
      <ErrorMessage message={message} />
    </main>
  );
}
