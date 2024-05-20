module.exports = (sequelize, DataTypes) => {
    const Especialidade = sequelize.define("Especialidade", {
        id_Especialidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        Especialidade: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        tableName: 'Especialidade',
        timestamps: false
    });
    return Especialidade;
};