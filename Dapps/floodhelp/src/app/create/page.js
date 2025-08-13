"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { openRequest } from "@/services/Web3Service";

export default function Home() {

    const [request, setRequest] = useState({
        title: "",
        description: "",
        contact: "",
        goal: 0
    });

    useEffect(() => {
        const wallet = localStorage.getItem("wallet");
        if (!wallet) window.location.href = "/";

    }, []);

    function onInputChange(e) {
        setRequest(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    function btnSaveClick() {
        if (!request.title || !request.description || !request.contact) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (request.goal < 0) {
            alert("A meta não pode ser negativa.");
            return;
        }

        openRequest(request)
            .then(() => {
                alert("Pedido enviado com sucesso!");
                window.location.href = "/";
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao enviar o pedido. Por favor, tente novamente.");
            });
    }

    return (
        <>
            <Header />

            <div className="container">
                <div className="ps-5">
                    <div className="row my-3">
                        <p className="lead">Preencha todos os campos abaixo para nos dizer o que precisa</p>
                    </div>

                    <div className="col-7">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="title" maxLength={150} value={request.title} onChange={onInputChange} />
                            <label htmlFor="title">Resumo do que precisa:</label>
                        </div>
                    </div>

                    <div className="col-7">
                        <div className="form-floating mb-3">
                            <textarea className="form-control" id="description" style={{ height: 100 }} value={request.description} onChange={onInputChange} />
                            <label htmlFor="description">Descreva em detalhes o que precisa e onde você está (para entregas presenciais):</label>
                        </div>
                    </div>

                    <div className="col-7">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="contact" maxLength={150} value={request.contact} onChange={onInputChange} />
                            <label htmlFor="contact">Contato (telefone ou e-mail):</label>
                        </div>
                    </div>

                    <div className="col-7">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="goal" value={request.goal} onChange={onInputChange} />
                            <label htmlFor="goal">Meta em BNB (deixe em branco caso não deseje receber doações em cripto):</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1 mb-3">
                            <a href="/" className="btn btn-outline-dark col-12 p-3">Voltar</a>
                        </div>
                        <div className="col-6 mb-3 p-0">
                            <button className="btn btn-dark col-12 p-3" onClick={btnSaveClick}>Enviar Pedido</button>
                        </div>
                    </div>

                </div>

                <Footer />
            </div>
        </>
    );
}
