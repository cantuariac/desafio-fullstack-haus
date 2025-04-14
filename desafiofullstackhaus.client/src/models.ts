
export enum StatusAcao {
    Aberta,
    EmProgresso,
    Concluida,
    'Em Progresso' = EmProgresso,
    'Concluída' = Concluida,
}

export interface Acao {
    id: number;
    descricao: string;
    responsavel: string;
    prazoConclusao: Date;
    status: StatusAcao;
    hierarquiaId: number;
    causas: number[];
}

export class PlanoAcao {
    abertos: Acao[];
    emProgresso: Acao[];
    concluido: Acao[];
    atrasados: Acao[];
    constructor() {
        this.abertos = [];
        this.emProgresso = [];
        this.concluido = [];
        this.atrasados = [];
    }
}
export class StaticData {
    hierarquias: { [key: number]: string };
    causas: { [key: number]: string };
    constructor() {
        this.causas = {};
        this.hierarquias = {};
    }
}

export abstract class HausAPI {
    private static url = "https://localhost:7050/api";

    public static async fetchStaticData() {
        try {
            const staticData = new StaticData();

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

            console.info(`Haus App: Static data loaded`);
            return staticData;
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }

    public static async fetchAcoesData(q = '', hierarquia = null) {
        try {
            const url = 'https://localhost:7050/api/acoes?' +
                (q == null || q == '' ? '' : `&q=${q}`) +
                (hierarquia == null ? '' : `&hierarquia=${hierarquia}`)
            const response = await fetch(url);
            const data: Acao[] = await response.json();

            for (let i = 0; i < data.length; i++) {
                data[i].prazoConclusao = new Date(data[i].prazoConclusao);
            }

            console.info(`Haus App: Acoes data loaded from ${url}`);
            return data;
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }

    public static async createAcao(acao: object) {
        try {
            const response = await fetch(HausAPI.url + "/acoes", {
                "method": "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify(acao)
            });
            const data = await response.json();
            if (response.ok) {
                console.info(`Haus App: Acao created:${data}`);
            }
            else {
                throw new Error(data.title);
            }

        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }
}
