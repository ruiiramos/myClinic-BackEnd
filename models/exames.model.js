module.exports = (sequelize, DataTypes) => {
    const Exame = sequelize.define("Exame", {
        id_Exame: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomeExame: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 100;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'nomeExame' é de ${maxLength} caracteres.`);
                    }
                }
            },
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
        hora: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isHour(value) {
                    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
                        throw new Error('A hora deve estar no formato HH:MM.');
                    }
                },
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'hora' é de ${maxLength} caracteres.`);
                    }
                }
            }
        },
        precoExame: {
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
                        throw new Error(`O comprimento máximo para 'precoExame' é de ${maxLength} caracteres.`);
                    }
                }
            },
        },
        id_Consultas: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Consulta',
                key: 'id_Consulta'
            }
        },
        id_Especialidades: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Especialidade',
                key: 'id_Especialidade'
            }
        },
    },
    {
        timestamps: false
    }
    )

    return Exame
};