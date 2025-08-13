import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import Web3 from "web3";
import { closeRequest, donate } from "@/services/Web3Service";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function Request({ data }) {

    function btnCloseRequest() {
        if (!window.confirm("Tem certeza que deseja fechar este pedido?")) return;

        closeRequest(data.id)
            .then(() => {
                alert("Pedido fechado com sucesso!");
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao fechar o pedido: " + err.message);
            });
    }

    function btnDonate() {
        const donationInBNB = prompt("Quanto você deseja doar em BNB?", "0.01");
        if (!donationInBNB || isNaN(donationInBNB) || parseFloat(donationInBNB) <= 0) {
            alert("Por favor, insira um valor válido para a doação.");
            return;
        }

        donate(data.id, donationInBNB)
            .then(() => {
                alert("Doação realizada com sucesso!");
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao realizar a doação: " + err.message);
            });
    }

    return (
        <>
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3">
                <img src={generateAvatarURL(data.author)} width="32" height="32" className="rounded-circle" />

                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="mb-0">{data.title} &rsaquo;&rsaquo; Contato {data.contact} </h6>
                            </div>
                            <div className="col-2">
                                <div className="text-end">
                                    {
                                        localStorage.getItem("wallet") === data.author.toLowerCase()
                                            ? <button type="button" className="btn btn-danger btn-sm" onClick={btnCloseRequest}>Fechar</button>
                                            : <button type="button" className="btn btn-success btn-sm" onClick={btnDonate}>&#36; Ajudar</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <p className="mb-0 me-5 pe-5 opacity-75">{data.description}</p>
                        <div className="row">
                            <div className="col">
                                <span className="me-1 opacity-75">Meta:</span>
                                <span className="opacity-50">
                                    {
                                        data.balance && data.balance > 0
                                            ? "BNB " + Web3.utils.fromWei(data.balance, "ether") + " obtidos de " + Web3.utils.fromWei(data.goal, "ether")
                                            : "BNB " + Web3.utils.fromWei(data.goal, "ether")
                                    }
                                </span>
                            </div>
                            <div className="col text-end">
                                <small className="opacity-50 text-nowrap">Criado {formatDistance(new Date(Number(data.timestamp) * 1000), new Date(), { addSuffix: true, locale: ptBR })}</small>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}