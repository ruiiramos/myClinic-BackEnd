module.exports = (sequelize, DataTypes) => {
    const Analise = sequelize.define("Analise", {
        id_Analise: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
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
        resultado: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        precoAnalises: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                isValidDecimal(value) {
                    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                        throw new Error('O preço deve ser um número decimal válido com até duas casas decimais.');
                    }
                },
            },
        },
        id_Consulta: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Consulta',
                key: 'id_Consulta'
            }
        },
    },{
        timestamps: false
    }
    )

    return Analise
};