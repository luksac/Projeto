// importando a biblioteca
import express from 'express'
import { DatabasePostgree } from './js/database.js'
import cors from 'cors'
import bcrypt from 'bcrypt'


const app = express() // app pega tudo da biblioteca

app.use(express.json()); // verifica o contenty type e converte em json para podermos usar

const corsOptions = {
    origin: 'http://localhost:5500', // Permite apenas requisições de http://localhost:5500
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const database = new DatabasePostgree()

// ---- API

app.get('/', (req,res) => { 
    res.send('OK')
    
}) 

app.get('/restaurants', async (req,res) => {
    const search = req.query.search;
    try {
        const restaurants = await database.list(search)
        console.log("RESTAURANT LIST ",  restaurants);
        return res.status(200).json({
            success : true,
            restaurants : restaurants
        });
    }
    catch {
        res.status(500).json({ error: 'Erro ao listar restaurantes' });
    }
    
}); 






app.get('/detailsRestaurants/:id', async (req,res) => {
    try {
        const restaurantsDetails = await database.listDetails(req.params)
        console.log("RESTAURANT DETALHES LIST ",  restaurantsDetails);
        return res.status(200).json({
            success : true,
            restaurantDetails : restaurantsDetails
        });
    }
    catch {
        res.status(500).json({ error: 'Erro ao listar detalhes restaurantes sem acessar o banco' });
    }
    
});




app.post('/restaurants', async (req, res) => {
    const bodyRestaurants = req.body;
    try {
        await database.create({
            RestauranteID: bodyRestaurants.ID,
            Descricao: bodyRestaurants.Descricao,
            Tipo: bodyRestaurants.Tipo,
            NotaUsuarios: bodyRestaurants.NotaUsuarios,
            Endereco: bodyRestaurants.Endereco,
            Telefone: bodyRestaurants.Telefone,
            FotosRestaurante: bodyRestaurants.FotosRestaurante
        });

        console.log(await database.list()); // Certifique-se de aguardar a função list para obter os resultados
        return res.status(201).send();
    } catch (error) {
        console.error('Erro ao criar restaurante:', error);
        return res.status(500).json({ error: 'Erro ao criar restaurante' });
    }
});


app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID do restaurante a partir dos parâmetros da URL
    const bodyRestaurants = req.body;
    console.log(bodyRestaurants);

    try {
        await database.update({
            RestauranteID: id, // Passa o ID para identificar qual restaurante atualizar
            Descricao: bodyRestaurants.descricao,
            Tipo: bodyRestaurants.tipo,
            NotaUsuarios: bodyRestaurants.notausuarios,
            Endereco: bodyRestaurants.endereco,
            Telefone: bodyRestaurants.telefone,
            FotosRestaurante: bodyRestaurants.fotosrestaurante
        });

        console.log(await database.list()); // Certifique-se de aguardar a função list para obter os resultados
        return res.status(200).send();
    } catch (error) {
        console.error('Erro ao atualizar restaurante:', error);
        return res.status(500).json({ error: 'Erro ao atualizar restaurante' });
    }
});



app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
 

    try {
        // Busca o usuário no banco de dados
        const user = await database.searchLogin(username);
        console.log('usuario crede', user)
        const userPass = user[0];
        if (user) {
            // Verifica se a senha fornecida corresponde à senha criptografada no banco de dados
            const isPasswordValid = await bcrypt.compare(password, userPass.senha);

            if (isPasswordValid) {
                // Senha está correta
                res.json({ success: true });
            } else {
                // Senha incorreta
                res.json({ success: false, message: 'Credenciais inválidas' });
            }
        } else {
            // Usuário não encontrado
            res.json({ success: false, message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro ao tentar fazer login.' });
    }
})



app.post('/register', async (req, res) => {
    const username = req.body.login;
    const password = req.body.senha;
    const nome = req.body.nome;
    const usuarioid = req.body.usuarioid;
    const SALT_ROUNDS = 10;

    console.log(username);

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username e password são obrigatórios.' });
    }

    try {
        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Inserir o novo usuário no banco de dados
        await database.createUser({ nome, usuarioid, username, password: hashedPassword });

        res.status(201).json({ success: true, message: 'Usuário criado com sucesso.' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar usuário.' });
    }
});

app.listen(3333)


