const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Usuario = require('../models/Usuario');


const UsuarioService = {
    async cadastrar({ nome, email, senha, nascimento }) {
        const usuarioExistente = await Usuario.findOne({ 
            where: { email } 
        });
        if (usuarioExistente) {
            throw new Error('Usuário já cadastrado com este email.');
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const nascimentoDate = moment(nascimento, ['DD-MM-YYYY', 'DD/MM/YYYY'], true);
        if (!nascimentoDate.isValid()) {
            throw new Error('Data de nascimento inválida. Use o formato DD-MM-YYYY.');
        }

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            nascimento: nascimentoDate.format('YYYY-MM-DD')
        });

        const returnUsuario = {
            nome: usuario.nome,
            email: usuario.email,
            nascimento: nascimentoFormatado.format('DD-MM-YYYY')
        };
        
        return returnUsuario;
          

    },

    async listarUsuarios() {
        const usuarios = await Usuario.findAll();
        return usuarios;
    },

    async login({ email, senha }) {
        const usuario = await Usuario.findOne({ 
            where: { email } 
        })

        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('Senha incorreta.');
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email }, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h'}
        );

        return token;
    }
}

module.exports = UsuarioService;