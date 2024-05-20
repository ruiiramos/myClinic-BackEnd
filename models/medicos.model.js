module.exports = (sequelize, DataTypes) => {
    const Medico = sequelize.define("Medico", {
        id_Medico: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome_medico: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 45;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'nome_medico' é de ${maxLength} caracteres.`);
                    }
                }
            }
        },
        cedula: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isWithinLength(value) {
                    const maxLength = 4;
        
                    if (value.length > maxLength) {
                        throw new Error(`O comprimento máximo para 'cedula' é de ${maxLength} caracteres.`);
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
        id_Especialidade: {
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

    return Medico
};