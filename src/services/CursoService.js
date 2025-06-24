const Curso = require('../models/Curso');
const { Op } = require('sequelize');
const Inscricao = require('../models/Inscricao');
const sequelize = require('../../config/database');

const CursoService = {
    async listarCursos(usuarioId, filtro) {
        const whereClause = filtro ? {
            [Op.or]: [
                {nome: {[Op.like]: `%${filtro}%`}},
                {descricao: {[Op.like]: `%${filtro}%`}}
            ]
        } : {};

        const cursos = await Curso.findAll({
            where: whereClause,
            include: [
                {
                    model: Inscricao,
                    attributes: []
                }
            ],
            attributes: {
                include:[
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'), 
                        'total_inscricoes'
                    ],
                    [
                        sequelize.literal(`(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id AND inscricoes.usuario_id = ${usuarioId})`),
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
            include:[{
                model: Inscricao,
                where: {
                    usuario_id: usuarioId
                },
                required: true
            }],
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'),
                        'total_inscricoes'
                    ],
                    [
                        sequelize.literal('(Inscricaos.data_cancelamento IS NOT NULL)'),
                        'inscricao_cancelada'
                    ]
                ]
            }
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            descrição: curso.descricao,
            capa: curso.capa,
            inscricoes: curso.getDataValue('total_inscricoes'),
            inicio: new Date(curso.inicio).toLocaleDateString('pt-br'),
            inscricao_cancelada: curso.getDataValue('inscricao_cancelada') > 0,
            inscrito: curso.getDataValue('inscricao_cancelada') === 0
        }))
    }
}

module.exports = CursoService;