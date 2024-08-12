import { randomUUID } from "node:crypto";
import sql from './db.js'
import bcrypt from 'bcrypt'

export class DatabasePostgree {

    

    //#restaurants = new Map()

    async create(restaurant) {
        const { Descricao, Tipo, NotaUsuarios, Endereco, Telefone, FotosRestaurante } = restaurant;
    
        try {
            await sql`
                INSERT INTO Restaurante (Descricao, Tipo, NotaUsuarios, Endereco, Telefone, FotosRestaurante)
                VALUES (${Descricao}, ${Tipo}, ${NotaUsuarios}, ${Endereco}, ${Telefone}, ${FotosRestaurante})
            `.then(() => {
                console.log('Dados inseridos na tabela restaurante');
              });
        } catch (error) {
            console.error('Erro ao inserir na tabela restaurante:', error);
            throw error; // Repassa o erro para que o chamador possa tratá-lo
        }
    }

    async list(search) {
        let query;
        
        try {
            if (search) {
                query = await sql`
                SELECT r.*
                FROM Restaurante r
                LEFT JOIN DetalhesRestaurante d ON r.RestauranteID = d.RestauranteID
                WHERE r.Descricao ILIKE ${`%${search}%`}
                OR d.DescricaoPratos ILIKE ${`%${search}%`}
                GROUP BY r.RestauranteID
            `;
                console.log('Consulta com parâmetro:', query);
            } else {
                query = await sql`SELECT * FROM Restaurante`;
                console.log('Consulta sem parâmetro:', query);
            }
    
            return query;
    
        } catch (error) {
            console.error('Erro ao listar restaurantes:', error);
            throw error; // Repassa o erro para que o chamador possa tratá-lo
        }
    }
    
    
    
    
        

    async searchLogin(username) {
        try {
            const query = await sql`SELECT * FROM Usuario WHERE login = ${username}`;
            console.log('retorno query' + query)
            return query; 
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }


    async listDetails(params) {
        try {
            const idString = params.id;
            const id = parseInt(idString, 10);
            console.log('VALOR DO ID', id);
    
            // Realiza um INNER JOIN entre as tabelas Restaurante e DetalhesRestaurante
            const query = await sql`
                SELECT 
                    r.RestauranteID,
                    r.Descricao as RestauranteDescricao,
                    r.NotaUsuarios,
                    r.Endereco,
                    r.Telefone,
                    r.FotosRestaurante,
                    d.DetalheID,
                    d.DescricaoPratos,
                    d.Precos,
                    d.FotosPratos
                FROM DetalhesRestaurante d
                INNER JOIN Restaurante r ON d.RestauranteID = r.RestauranteID
                WHERE d.RestauranteID = ${id}`;
            // Verifica se a consulta retornou algum resultado
            return query;
    
        } catch (error) {
            console.error('Erro ao listar restaurantes:', error);
            throw error; // Repassa o erro para que o chamador possa tratá-lo
        }
    }
    

    async update(restaurant) {
        console.log('UPDATE ', restaurant);
        const { RestauranteID, Descricao, Tipo, NotaUsuarios, Endereco, Telefone, FotosRestaurante } = restaurant;
        
        try {
            await sql`
                UPDATE Restaurante
                SET 
                    Descricao = ${Descricao}, 
                    Tipo = ${Tipo}, 
                    NotaUsuarios = ${NotaUsuarios}, 
                    Endereco = ${Endereco}, 
                    Telefone = ${Telefone}, 
                    FotosRestaurante = ${FotosRestaurante}
                WHERE RestauranteID = ${RestauranteID}
            `.then(() => {
                console.log('Dados atualizados na tabela restaurante');
            });
        } catch (error) {
            console.error('Erro ao atualizar na tabela restaurante:', error);
            throw error; // Repassa o erro para que o chamador possa tratá-lo
        }
    }
    
    async createUser({ usuarioid, nome, username, password }) {
        try {
            // Inserir o usuário no banco de dados com a senha já criptografada
            const query = await sql`
                INSERT INTO Usuario (usuarioid, nome, login, senha)
                VALUES (${usuarioid}, ${nome}, ${username}, ${password})
                RETURNING usuarioid, login
            `;           
            if (result.rowCount === 1) {
                return { success: true, message: 'Usuário criado com sucesso.' };
            } else {
                return { success: false, message: 'Nenhum usuário foi inserido.' };
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error; // Repassa o erro para que o chamador possa tratá-lo
        }
    }

    
}