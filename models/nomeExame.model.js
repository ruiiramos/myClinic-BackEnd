module.exports = (sequelize, DataTypes) => {
    const nome_exame = sequelize.define("nome_exame", {
        nome_exame: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        preco_exame: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    }, {
        tableName: 'nome_exame',
        timestamps: false
    });
    return nome_exame;
};