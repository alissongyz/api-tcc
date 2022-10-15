import { Connection, createConnection } from "typeorm";


export class MysqlConnector {
    connect(): Promise<any> {
        
        return createConnection()
            .then((connection: Connection) => connection)
            .catch((error: any) => {
                console.error('Erro para gerar a conexao: ', error);
                throw new Error('Erro ao conectar no Banco de Dados');
            });
    }
}