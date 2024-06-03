module.exports = (sequelize, DataTypes) => {
    const especialidade = sequelize.define("especialidade", {
        id_especialidade: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        especialidade: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        tableName: 'especialidade',
        timestamps: false
    });
    return especialidade;
};