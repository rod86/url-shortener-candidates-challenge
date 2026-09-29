import { useActionData, useFormAction, useNavigation, useSubmit, type ActionFunctionArgs } from "react-router";
import ShortLinkForm from "@app/components/short-link/ShortLinkForm";
import ShortLink from "@app/components/short-link/ShortLink";
import ErrorMessage from "@app/components/global/ErrorMessage";
import { createShortLinkHandler } from "@app/modules/short-link/services";
import { InvalidUrlError, ShortLinkCreationError } from "@app/modules/short-link/errors";

const errorMessages = [
    { errorClass: InvalidUrlError, message: "Please enter a valid URL" },
    { errorClass: ShortLinkCreationError, message: "We could not shorten your link, please try again" },
];

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const url = formData.get("url") as string;

    try {
        const { shortLink } = await createShortLinkHandler.handle({ url });
        return { shortLink };
    } catch (error) {
        const handled = errorMessages.find(({ errorClass }) => error instanceof errorClass);
        if (!handled) throw error;
        return { error: handled.message };
    }
}

export default function Home() {
    const submit = useSubmit();
    const formAction = useFormAction();
    const navigation = useNavigation();
    const actionData = useActionData<typeof action>();

    return (
        <main className="flex justify-center px-4 pt-16 sm:pt-24">
            <div className="w-full max-w-160">
                <h1 className="text-4xl font-semibold leading-tight tracking-tighter sm:text-[44px] mb-10">Shorten a long link</h1>

                <ShortLinkForm
                    key={actionData?.shortLink}
                    onSubmit={(url) => submit({ url }, { method: "POST", action: formAction })}
                    isLoading={navigation.state !== "idle"}
                />

                {actionData?.error && <ErrorMessage message={actionData.error} />}

                {actionData?.shortLink && <ShortLink url={actionData.shortLink} />}
            </div>
        </main>
    );
}
