module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define("admin", {
        codigo: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'admin',
        timestamps: false
    });
    return admin;
};