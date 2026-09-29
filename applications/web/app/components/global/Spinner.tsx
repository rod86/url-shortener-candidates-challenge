import spinner from "@app/assets/img/spinner.svg";

const Spinner = () => (
    <div className="flex items-center justify-center w-full py-4">
        <img src={spinner} alt="Loading" width="24" height="24" className="size-10"/>
    </div>
);

export default Spinner;
