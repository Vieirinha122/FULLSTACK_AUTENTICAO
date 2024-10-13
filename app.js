require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors');


const app = express();

app.use(cors());

// Utilizado para que o express consiga ler um json 
app.use(express.json())

// Models
const User = require('./model/User')

app.get('/', (req, res) => 
    res.status(200).json({msg: 'Essa igreja é bronca'})
)

app.get("/user/:id", verificarToken, async (req, res) => {

    const id = req.params.id

    // Ver se o usuário já existe
    const user = await User.findById(id, '-senha')

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    res.status(200).json({user})
})

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
        
    } catch (error) {
        res.status(400).json({msg: 'Token Inválido'}) 
    }
}


// 
app.post('/auth/register', async(req, res) => {
    
    const {name, email, senha, confirmpassword} = req.body

    if(!name) {
        return res.status(422).json({msg: 'Nome é obrigatório!'})
    }
    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    if(senha !== confirmpassword) {
        return res.status(422).json({msg: 'As senhas não conferem!'})
         
    }

    // Ver se o usuário já existe
    const userExists = await User.findOne({ email: email})

    if (userExists) {
        return res.status(422).json({msg: 'Utilize outro email!'})
    }

    // Criando senha
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(senha, salt)

    // Criando usuário
    const user = new User ({
        name, email, senha:passwordHash,
    })
    try {
        await user.save()

        res.status(201).json({msg: 'Usuário criado com sucesso! '})
    } catch(error) {
        console.log(error)
        
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})

// Login User
app.post("/auth/login", async (req, res) => {
    const {email, senha} = req.body 

    // Validar informações do usuário
    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email: email})

    if (!user) {
        return res.status(422).json({msg: 'Usuário não encontrado!'})
    }

    // Verificar se a senha está igual
    const verificarSenha = await bcrypt.compare(senha, user.senha)

    if(!verificarSenha) {
        return res.status(422).json({msg: 'Senha inválida!'})
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, 
        secret,
    )

        res.status(200).json({msg: "Autenticação feita com sucesso", token})
        
    } catch (error) {
        console.log(error)
        
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }

})

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@jwt.mb9wv.mongodb.net/?retryWrites=true&w=majority&appName=JWT`)
    .then(() => {
        app.listen(3000)
        console.log('Conectado ao banco')
    })
    .catch((err) => console.log(err))
