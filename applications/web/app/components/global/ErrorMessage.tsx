type ErrorMessageProps = {
    message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <div
        role="alert"
        className="rounded-md border border-danger-line bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
        {message}
    </div>
);

export default ErrorMessage;
