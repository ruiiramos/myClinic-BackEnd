module.exports = (sequelize, DataTypes) => {
    const user_tokens = sequelize.define("user_tokens", {
        id_user: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'utilizador',
                key: 'id_user'
            }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'user_tokens',
        timestamps: false
    });

    return user_tokens;
};