const Curso = require('../models/Curso');
const { Op } = require('sequelize');
const Inscricao = require('../models/Inscricao');
const sequelize = require('../../config/database');

const CursoService = {
    async listarCursos(usuarioId, filtro) {
        const whereClause = filtro ? {
            [Op.or]: [
                { nome: { [Op.like]: `%${filtro}%` } },
                { descricao: { [Op.like]: `%${filtro}%` } }
            ]
        } : {};

        const cursos = await Curso.findAll({
            where: whereClause,
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'),
                        'total_inscricoes'
                    ],
                    [
                        sequelize.literal(`(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id AND inscricoes.usuario_id = ${usuarioId} AND inscricoes.data_cancelamento IS NULL)`),
                        'usuario_inscrito'
                    ]
                ]
            }
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            descricao: curso.descricao,
            capa: curso.capa,
            inscricoes: curso.getDataValue('total_inscricoes'),
            inicio: new Date(curso.inicio).toLocaleDateString('pt-BR'),
            inscrito: curso.getDataValue('usuario_inscrito') > 0
        }));
    },

    async listarCursosInscritos(usuarioId) {
        const cursos = await Curso.findAll({
            include: [{
                model: Inscricao,
                where: {
                    usuario_id: usuarioId,
                    data_cancelamento: null
                },
                required: true
            }],
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'),
                        'total_inscricoes'
                    ]
                ]
            }
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            descricao: curso.descricao,
            capa: curso.capa,
            inscricoes: curso.getDataValue('total_inscricoes'),
            inicio: new Date(curso.inicio).toLocaleDateString('pt-BR'),
            inscrito: true
        }));
    }
};

module.exports = CursoService;