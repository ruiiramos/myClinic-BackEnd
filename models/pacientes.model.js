module.exports = (sequelize, DataTypes) => {
    const Pacientes = sequelize.define("Pacientes", {
        id_Paciente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        dataNascimento: {
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
        n_Utente: {
            type: DataTypes.STRING(9),
            allowNull: false,
        },
        profissão: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    },
    {
        timestamps: false
    }
    )

    return Pacientes
};