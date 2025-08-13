"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getOpenRequests } from "@/services/Web3Service";
import Request from "@/components/Request";
import { set } from "date-fns";

export default function Home() {

  const [requests, setRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [lastId, setLastId] = useState(0);

  useEffect(() => {
    loadRequests(lastId);
  }, [lastId]);

  async function loadRequests(lastId) {
    try {
      const result = await getOpenRequests(lastId);

      setLoaded(result && result.length > 0);

      if (lastId === 0) {
        setRequests(result);
      } else {
        setRequests(prevRequests => [...prevRequests, ...result]);
      }

    } catch (error) {
      console.error("Error loading requests:", error);
      alert(error.message || "Failed to load requests");
    }
  }

  function btnLoadMoreClick() {
    const id = requests[requests.length - 1].id;
    console.log("Loading more requests after ID:", id);
    setLastId(Number(id));
  }

  return (
    <>
      <Header />

      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">Ajude as vítimas de enchentes e demais desastres naturais do Brasil</p>
        </div>

        <div className="p-4 mx-5">
          <div className="list-group">
            {
              !requests || !requests.length ?
                <>Conecte sua carteira MetaMask no botão "Entrar" para pedir ajuda.</>
                : requests.map(rq => <Request key={rq.id} data={rq} />)
            }
          </div>

          {
            requests && loaded && requests.length % 5 === 0
              ? (
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-outline-dark btn-lg" onClick={btnLoadMoreClick}>Mais Resultados</button>
                </div>
              )
              : <></>
          }
        </div>

        <Footer />
      </div>
    </>
  );
}
