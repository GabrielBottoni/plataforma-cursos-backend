const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Usuario = require("./Usuario");
const Curso = require("./Curso");

const Inscricao = sequelize.define("Inscricao", {
    data_cancelamento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    data_inscricao: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: "inscricoes",
    timestamps: false,
});

Usuario.hasMany(Inscricao, { foreignKey: "usuario_id" });
Inscricao.belongsTo(Usuario, { foreignKey: "usuario_id" });

Curso.hasMany(Inscricao, { foreignKey: "curso_id" });
Inscricao.belongsTo(Curso, { foreignKey: "curso_id" });

module.exports = Inscricao;