module.exports = (sequelize, DataTypes) => {
    const prescricao = sequelize.define("prescricao", {
        id_prescricao: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        id_consulta: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'consulta',
                key: 'id_consulta'
            }
        },
    }, {
        tableName: 'prescricao',
        timestamps: false
    });
    return prescricao;
};