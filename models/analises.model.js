module.exports = (sequelize, DataTypes) => {
    const analise = sequelize.define("analise", {
        id_analise: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        resultado: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        preco_analise: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isValidDate(value) {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        throw new Error('A data deve estar no formato YYYY-MM-DD.');
                    }
                }
            }
        },
        id_consulta: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'consulta',
                key: 'id_consulta'
            }
        },
    },{
        tableName: 'analise',
        timestamps: false
    }
    )

    return analise
};