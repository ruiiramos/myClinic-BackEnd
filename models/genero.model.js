module.exports = (sequelize, DataTypes) => {
    const genero = sequelize.define("genero", {
        id_genero: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        genero: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        tableName: 'genero',
        timestamps: false
    });
    return genero;
};