module.exports = (sequelize, DataTypes) => {
    const medicamento = sequelize.define("medicamento", {
        id_medicamento: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nome_medicamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'medicamento',
        timestamps: false
    });
    return medicamento;
};