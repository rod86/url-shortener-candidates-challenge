import {Link} from "react-router";
import logo from "@app/assets/img/logo.svg";

const Header = () => (
    <header className="flex h-18 items-center px-6 sm:px-12">
        <Link to="/" className="inline-flex">
            <img src={logo} alt="URL Shortener" width="151" height="28" className="h-7 w-auto"/>
        </Link>
    </header>
);

export default Header;