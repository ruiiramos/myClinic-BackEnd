module.exports = (sequelize, DataTypes) => {
    const Exame = sequelize.define("Exame", {
        id_Exame: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomeExame: {
            type: DataTypes.STRING(100),
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
        hora: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                isHour(value) {
                    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
                        throw new Error('A hora deve estar no formato HH:MM.');
                    }
                },
            }
        },
        precoExame: {
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