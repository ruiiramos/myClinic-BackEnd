module.exports = (sequelize, DataTypes) => {
    const codigo_postal = sequelize.define("codigo_postal", {
        cod_postal: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
        },
        localidade: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'codigo_postal',
        timestamps: false
    });
    return codigo_postal;
};