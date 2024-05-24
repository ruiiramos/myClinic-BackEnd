module.exports = (sequelize, DataTypes) => {
    const nome_exame = sequelize.define("nome_exame", {
        id_exame: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        nome_exame: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preco_exame: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'nome_exame',
        timestamps: false
    });
    return nome_exame;
};