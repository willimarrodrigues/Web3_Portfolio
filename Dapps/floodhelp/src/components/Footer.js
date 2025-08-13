import { useState, useEffect } from "react";

export default function Footer() {

    const [wallet, setWallet] = useState("");

    useEffect(() => {
        setWallet(localStorage.getItem("wallet") || "");
    }, []);

    return (
        <footer className="d-flex flex-wrap align-items-center justify-content-between border-top p-3 m-5">
            <p className="col-4 mb-0 text-body-secondary">
                © 2024 FloodHelp, Inc.
            </p>
            <ul className="nav col-4 justify-content-end">
                {
                    wallet ?
                        <>
                            <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Ajudar</a></li>
                            <li className="nav-item"><a href="/create" className="nav-link px-4 text-body-secondary">Pedir Ajuda</a></li>
                        </>
                        : <></>
                }

            </ul>
        </footer>
    );
}   