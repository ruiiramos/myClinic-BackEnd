module.exports = (sequelize, DataTypes) => {
    const medicamento_prescricao = sequelize.define("medicamento_prescricao", {
        id_medicamento_prescricao: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        dosagem: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        instrucoes: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        id_prescricao: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'prescricao',
                key: 'id_prescricao'
            }
        },
        id_medicamento: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'medicamento',
                key: 'id_medicamento'
            }
        },
    }, {
        tableName: 'medicamento_prescricao',
        timestamps: false
    });
    return medicamento_prescricao;
};