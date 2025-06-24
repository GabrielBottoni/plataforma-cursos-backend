const UsuarioService = require('../services/UsuarioService');

const UsuarioController = {
    async cadastrar(req, res) {
        try {
            const resultado = await UsuarioService.cadastrar(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    },

    async listarUsuarios(req, res) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    },

    async login(req, res){ 
        try {
            const token = await UsuarioService.login(req.body);

            res.cookie('token', token, {
                httpOnly: true,
            });

            res.status(200).json(token);
        } catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    }
}

module.exports = UsuarioController;