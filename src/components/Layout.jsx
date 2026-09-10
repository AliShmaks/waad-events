import {Outlet} from "react-router-dom";import Header from "./Header";import Footer from "./Footer";import ScrollToTop from "./ScrollToTop";import WhatsAppFloat from "./WhatsAppFloat";
export default function Layout(){return <><ScrollToTop/><Header/><Outlet/><Footer/><WhatsAppFloat/></>}
