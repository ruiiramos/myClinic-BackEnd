module.exports = (sequelize, DataTypes) => {
    const Pacientes = sequelize.define("Pacientes", {
        id_Paciente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 50;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'nome' é de ${maxLength} caracteres.`);
                    }
                }
            }
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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 9;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'n_utente' é de ${maxLength} caracteres.`);
                    }
                }
            }
        },
        profissão: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'profissão' é de ${maxLength} caracteres.`);
                    }
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'password' é de ${maxLength} caracteres.`);
                    }
                }
            }
        },
    },
    {
        timestamps: false
    }
    )

    return Pacientes
};