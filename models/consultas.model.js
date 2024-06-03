module.exports = (sequelize, DataTypes) => {
    const consulta = sequelize.define("consulta", {
        id_consulta: {
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
        preco_consulta: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        id_medico: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'medico',
                key: 'id_medico'
            }
        },
        id_paciente: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'paciente',
                key: 'id_paciente'
            }
        },
    },
    {
        tableName: 'consulta',
        timestamps: false
    })

    return consulta
};