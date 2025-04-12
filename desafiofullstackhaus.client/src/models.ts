
export enum StatusAcao {
    Aberto,
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
    constructor() {
        this.abertos = [];
        this.emProgresso = [];
        this.concluido = [];
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
    public static async fetchStaticData() {
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

            console.info(`Haus App: Static data loaded`);
            return staticData;
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }
    public static async fetchAcoesData(q='') {
        try {
            const response = await fetch('https://localhost:7050/api/acoes' + (q == null ? '' : `?q=${q}`));
            const data: Acao[] = await response.json();
            const plano = new PlanoAcao();
            for (let i = 0; i < data.length; i++) {
                data[i].prazoConclusao = new Date(data[i].prazoConclusao);
                if (data[i].status == 0) {
                    plano.abertos.push(data[i]);
                } else if (data[i].status == 1) {
                    plano.emProgresso.push(data[i]);
                } else if (data[i].status == 2) {
                    plano.concluido.push(data[i]);
                }
            }
            console.info(`Haus App: Acoes data loaded`);
            return plano;
        } catch (error) {
            console.error(`Haus App: ${error}`);
        }
    }
}
