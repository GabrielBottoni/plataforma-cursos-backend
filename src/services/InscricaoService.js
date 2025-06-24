const Inscricao = require('../models/Inscricao');
const Curso = require('../models/Curso');
const sequelize = require('../../config/database'); // Se ainda precisar para queries diretas, senão pode remover

const InscricaoService = {
    async inscrever(usuarioId, cursoId) {
        try {
            // 1. Verificar se o curso existe
            const curso = await Curso.findByPk(cursoId);
            if (!curso) {
                // Mensagem com "mensagem" minúsculo para consistência com o catch do controller
                throw { status: 404, mensagem: 'Curso não encontrado!' }; 
            }

            // 2. Procurar por QUALQUER inscrição anterior para este usuário e curso (ativa OU cancelada)
            const inscricaoExistente = await Inscricao.findOne({
                where: {
                    usuario_id: usuarioId,
                    curso_id: cursoId
                }
            });

            if (inscricaoExistente) {
                // Se já existe uma inscrição (ativa ou cancelada)
                if (inscricaoExistente.data_cancelamento === null) {
                    // Inscrição ATIVA: Não permite nova inscrição
                    const error = new Error('Usuário já inscrito neste curso.');
                    // Mensagem com  minúsculo para consistência com o catch do controller
                    error.status = 400; 
                    throw error;
                } else {
                    // Inscrição CANCELADA: Reativar a inscrição existente
                    inscricaoExistente.data_cancelamento = null; // Remove a data de cancelamento
                    inscricaoExistente.data_inscricao = new Date(); // Opcional: atualiza a data de inscrição para a reativação
                    await inscricaoExistente.save(); // Salva as alterações no banco de dados
                    return { mensagem: 'Inscrição reativada com sucesso!' }; // Retorna uma mensagem de sucesso para reativação
                }
            } else {
                // Se não há inscrição existente (nem ativa, nem cancelada), cria uma nova
                const novaInscricao = await Inscricao.create({
                    usuario_id: usuarioId,
                    curso_id: cursoId,
                    data_inscricao: new Date(),
                    data_cancelamento: null
                });
                return novaInscricao; // Retorna a nova inscrição criada
            }
        } catch (error) {
            console.error('Erro no InscricaoService.inscrever:', error); // MUITO IMPORTANTE para ver o erro real!

            // Tratamento de erro para UNIQUE constraint violation
            if (error.name === 'SequelizeUniqueConstraintError') {
                // Este erro só deveria ocorrer se a lógica acima falhar ou se houver outra Unique Constraint
                // (ex: se não tiver o data_cancelamento IS NULL na consulta inicial, o que corrigimos)
                throw { status: 409, mensagem: 'Já existe uma inscrição para este usuário e curso (ativa ou cancelada).' };
            }
            
            // Re-lança erros que já possuem um 'status' definido (como o 404 do curso não encontrado)
            if (error.status) {
                throw error;
            }
            
            // Para outros erros inesperados (ex: problemas de conexão com DB, erros de validação genéricos)
            // Use 500 para erros internos do servidor.
            throw { status: 400, mensagem: error.mensagem || 'Erro interno do servidor ao inscrever no curso.' };
        }
    },

    // A função cancelar parece estar OK, mas vou refatorar para usar o modelo,
    // o que é mais consistente e robusto com Sequelize.
    async cancelar(usuarioId, cursoId) {
        try {
            // Encontrar a inscrição ativa usando o modelo (melhor que sequelize.query)
            const inscricaoAtiva = await Inscricao.findOne({
                where: {
                    usuario_id: usuarioId,
                    curso_id: cursoId,
                    data_cancelamento: null // Apenas cancela inscrições ATIVAS
                }
            });

            if (!inscricaoAtiva) {
                throw { status: 404, mensagem: 'Inscrição não encontrada ou já cancelada.' };
            }

            // Atualizar a inscrição para marcar como cancelada
            inscricaoAtiva.data_cancelamento = new Date(); // Define a data e hora do cancelamento
            await inscricaoAtiva.save(); // Salva as alterações no banco

            return { mensagem: 'Inscrição cancelada com sucesso!' }; // Retorna uma mensagem de sucesso
        } catch (error) {
            console.error('Erro no InscricaoService.cancelar:', error);
            if (error.status) {
                throw error;
            }
            // Mude para 500 para erros internos não específicos
            throw { status: 400, mensagem: error.mensagem || 'Erro interno do servidor ao cancelar inscrição.' };
        }
    }
}

module.exports = InscricaoService;