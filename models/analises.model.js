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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'resultado' é de ${maxLength} caracteres.`);
                    }
                }
            },
        },
        precoAnalises: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidDecimal(value) {
                    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                        throw new Error('O preço deve ser um número decimal válido com até duas casas decimais.');
                    }
                },
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'resultado' é de ${maxLength} caracteres.`);
                    }
                }
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