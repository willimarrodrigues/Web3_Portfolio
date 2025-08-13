'use client';

import { doLogin } from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { useState, useEffect } from "react";

export default function Header() {

  const [wallet, setWallet] = useState("");

  useEffect(() => {
    setWallet(localStorage.getItem("wallet") || "");
  }, []);

  function btnLoginClick() {
    doLogin()
      .then(wallet => {
        console.log("Logged in with account:", wallet);
        setWallet(wallet);
        window.location.reload();
      })
      .catch(error => {
        console.error("Login failed:", error.message);
        alert(error.message); // Show error message to the user
        setWallet("");
      });
  }

  function btnLogoutClick() {
    localStorage.removeItem("wallet");
    setWallet("");
    window.location.href = "/";
  }

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          <a href="/" className="justify-content-start" style={{ textDecoration: 'none' }}>
            <h1 className="fw-bold text-light">FloodHelp</h1>
          </a>
          <div className="text-end col-9">
            {
              wallet ?
                (
                  <>
                    <button type="button" className="btn btn-outline-light me-2" onClick={btnLogoutClick} >
                      <img src={generateAvatarURL(wallet)} width="20" height="20" className="rounded-circle me-2" />
                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                    </button>

                    <a href="/create" className="btn btn-warning">Pedir ajuda</a>
                  </>
                )

                :
                <button type="button" className="btn btn-outline-light me-2" onClick={btnLoginClick} >
                  <img src="/metamask.png" width="24" height="24" className="me-3" />
                  Entrar
                </button>
            }
          </div>
        </div>
      </div>
    </header>
  );
}
