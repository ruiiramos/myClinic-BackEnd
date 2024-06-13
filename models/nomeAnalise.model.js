module.exports = (sequelize, DataTypes) => {
    const nome_analise = sequelize.define("nome_analise", {
        id_analise: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            references: {
                model: 'analise',
                key: 'id_analise'
            }
        },
        nome_analise: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preco_analise: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'nome_analise',
        timestamps: false
    });
    return nome_analise;
};