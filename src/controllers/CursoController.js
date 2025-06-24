const CursoService = require('../services/CursoService');

const CursoController = {
    async listarCursos(req, res) {
        try {
            const filtro = req.query.filtro || null;
            const usuarioId = req.user.id;
            const cursos = await CursoService.listarCursos(usuarioId, filtro);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(400).json({ message: "Erro ao buscar cursos: " + error});
        }
    },

    async listarCursosInscritos(req, res) {


        try {
            const usuarioLogado = req.user.id;
            const usuarioSolicitante = req.params.idUsuario;

            if (usuarioLogado != usuarioSolicitante) {
                return res.status(403).json({ mensagem: 'Acesso negado.' });
            }

            const cursos = await CursoService.listarCursosInscritos(usuarioLogado);
            return res.status(200).json(cursos);
        } catch (error) { 
            res.status(error.status || 400).json({ mensagem: "Erro ao listar cursos." + error.message });
        }
    }
}

module.exports = CursoController; 