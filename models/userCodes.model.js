module.exports = (sequelize, DataTypes) => {
    const user_codes = sequelize.define("user_codes", {
        id_user: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'utilizador',
                key: 'id_user'
            }
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'user_codes',
        timestamps: false
    });

    return user_codes;
};