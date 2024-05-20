module.exports = (sequelize, DataTypes) => {
    const Consulta = sequelize.define("Consulta", {
        id_Consulta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        precoConsulta: {
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
                        throw new Error(`O comprimento máximo para 'precoConsulta' é de ${maxLength} caracteres.`);
                    }
                }
            },
        },
        id_Medicos: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Medicos',
                key: 'id_Medico'
            }
        },
        id_Pacientes: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Pacientes',
                key: 'id_Paciente'
            }
        },
    },
    {
        timestamps: false
    })

    return Consulta
};