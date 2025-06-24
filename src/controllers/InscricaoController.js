const InscricaoService = require('../services/InscricaoService');

const InscricaoController = {
    async inscrever(req, res) {
        try {
            const usuarioId = req.user.id;
            const cursoId = req.params.idCurso;

            await InscricaoService.inscrever(usuarioId, cursoId);
            res.status(200).json({ mensagem: 'Inscricão realizada com sucesso' });
        } catch (error) {
            res.status(error.status || 400).json({
                mensagem: error.mensagem || error.message || 'Erro ao realizar inscrição'
            });
        }
    },

    async cancelar(req, res) {
        try {
            const usuarioId = req.user.id;
            const cursoId = req.params.idCurso;

            await InscricaoService.cancelar(usuarioId, cursoId);
            res.status(200).json({ mensagem: 'Inscrição cancelada com sucesso!' });
        } catch (error) {
            res.status(error.status || 400).json({ mensagem: error.mensagem || error.message || 'Erro desconhecido' });
        }
    }
}

module.exports = InscricaoController;