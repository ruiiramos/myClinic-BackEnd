module.exports = (sequelize, DataTypes) => {
    const exame = sequelize.define("exame", {
        id_exame: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nome_exame: {
            type: DataTypes.STRING,
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
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                isHour(value) {
                    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
                        throw new Error('A hora deve estar no formato HH:MM.');
                    }
                },
            }
        },
        preco_exame: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        id_consulta: {
            type: DataTypes.INTEGER,
            references: {
                model: 'consulta',
                key: 'id_consulta'
            }
        },
        id_especialidade: {
            type: DataTypes.INTEGER,
            references: {
                model: 'especialidade',
                key: 'id_especialidade'
            }
        },
        id_nome_exame: {
            type: DataTypes.INTEGER,
            references: {
                model: 'nome_exame',
                key: 'id_exame'
            }
        },
    },
    {
        tableName: 'exame',
        timestamps: false
    }
    )

    return exame
};