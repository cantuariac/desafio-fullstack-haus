import { useEffect, useState } from 'react';
import './App.css';

enum StatusAcao {
    Aberto,
    EmProgresso,
    Concluida,
    'Em Progresso' = EmProgresso,
    'Concluída' = Concluida,
}

interface Acao {
    id: number;
    descricao: string;
    responsavel: string;
    prazoConclusao: string;
    status: StatusAcao;
    hierarquiaId: number;
    causas: number[];
}
interface StaticData {
    hierarquias: { [key: number]: string };
    causas: { [key: number]: string };
}

function App() {
    const [acoes, setAcoes] = useState<Acao[]>();
    const [staticData, setStaticData] = useState<StaticData>();

    useEffect(() => {
        loadStaticData();
    }, []);
    useEffect(() => {
        loadAcoesData();
    }, []);

    const contents = acoes === undefined
        ? <p><em>Carregando dados...</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Prazo de Conclusão</th>
                    <th>Status</th>
                    <th>Hierarquia de controle</th>
                    <th>Causas</th>
                </tr>
            </thead>
            <tbody>
                {acoes.map(acao =>
                    <tr key={acao.id}>
                        <td>{acao.descricao}</td>
                        <td>{acao.responsavel}</td>
                        <td>{acao.prazoConclusao}</td>
                        <td>{StatusAcao[acao.status]}</td>
                        <td>{staticData?.hierarquias[acao.hierarquiaId]}</td>
                        <td>{acao.causas}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Plano de ação</h1>
            <input id="search_input"></input>
            {contents}
        </div>
    );

    async function loadStaticData() {
        try {
            const staticData: StaticData = {
                hierarquias: {}, causas: {}
            };

            let data: { id: number, nome: string }[];
            let response = await fetch('https://localhost:7050/api/values/causas');

            data = await response.json();
            for (let i = 0; i < data.length; i++) {
                staticData.causas[data[i]["id"]] = data[i]["nome"];
            }

            response = await fetch('https://localhost:7050/api/values/hierarquias');
            data = await response.json();
            for (let i = 0; i < data.length; i++) {
                staticData.hierarquias[data[i]["id"]] = data[i]["nome"];
            }

            setStaticData(staticData);
            console.info(`Haus App: Static data loaded`);
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }
    async function loadAcoesData() {
        try {
            const response = await fetch('https://localhost:7050/api/acoes');
            const data: Acao[] = await response.json();
            setAcoes(data);
            console.info(`Haus App: Acoes data loaded`);
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }
}

export default App;