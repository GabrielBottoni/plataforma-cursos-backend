const Inscricao = require('../models/Inscricao');
const Curso = require('../models/Curso');
const sequelize = require('../../config/database'); 

const InscricaoService = {
    async inscrever(usuarioId, cursoId) {
        try {
           
            const curso = await Curso.findByPk(cursoId);
            if (!curso) {
                throw { status: 404, mensagem: 'Curso não encontrado!' }; 
            }
            const inscricaoExistente = await Inscricao.findOne({
                where: {
                    usuario_id: usuarioId,
                    curso_id: cursoId
                }
            });

            if (inscricaoExistente) {
                if (inscricaoExistente.data_cancelamento === null) {
                    const error = new Error('Usuário já inscrito neste curso.');
                    
                    error.status = 400; 
                    throw error;
                } else {
                    
                    inscricaoExistente.data_cancelamento = null; 
                    inscricaoExistente.data_inscricao = new Date(); 
                    await inscricaoExistente.save(); 
                    return { mensagem: 'Inscrição reativada com sucesso!' }; 
                }
            } else {
                
                const novaInscricao = await Inscricao.create({
                    usuario_id: usuarioId,
                    curso_id: cursoId,
                    data_inscricao: new Date(),
                    data_cancelamento: null
                });
                return novaInscricao; 
            }
        } catch (error) {
            console.error('Erro no InscricaoService.inscrever:', error); 

            
            if (error.name === 'SequelizeUniqueConstraintError') {
                
                throw { status: 409, mensagem: 'Já existe uma inscrição para este usuário e curso (ativa ou cancelada).' };
            }
            
           
            if (error.status) {
                throw error;
            }
            
            
            throw { status: 400, mensagem: error.mensagem || 'Erro interno do servidor ao inscrever no curso.' };
        }
    },

    
    async cancelar(usuarioId, cursoId) {
        try {
            
            const inscricaoAtiva = await Inscricao.findOne({
                where: {
                    usuario_id: usuarioId,
                    curso_id: cursoId,
                    data_cancelamento: null 
            });

            if (!inscricaoAtiva) {
                throw { status: 404, mensagem: 'Inscrição não encontrada ou já cancelada.' };
            }

            
            inscricaoAtiva.data_cancelamento = new Date(); 
            await inscricaoAtiva.save(); 

            return { mensagem: 'Inscrição cancelada com sucesso!' }; 
        } catch (error) {
            console.error('Erro no InscricaoService.cancelar:', error);
            if (error.status) {
                throw error;
            }
           
            throw { status: 400, mensagem: error.mensagem || 'Erro interno do servidor ao cancelar inscrição.' };
        }
    }
}

module.exports = InscricaoService;