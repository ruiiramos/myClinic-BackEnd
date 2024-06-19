module.exports = (sequelize, DataTypes) => {
    const exame = sequelize.define("exame", {
        id_exame: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isValidDate(value) {
                    const dateOnly = value.toISOString().split('T')[0];

                    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
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
        nome_exame: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'nome_exame',
                key: 'nome_exame'
            }
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
    },
    {
        tableName: 'exame',
        timestamps: false
    }
    )

    return exame
};