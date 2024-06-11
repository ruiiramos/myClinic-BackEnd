module.exports = (sequelize, DataTypes) => {
    const utilizador = sequelize.define("utilizador", {
        id_user: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Must be a valid email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidPassword(val) {
                    if (val.length < 8) {
                        throw new Error("A senha deve ter pelo menos 8 caracteres");
                    }
                    if (!/\d/.test(val)) {
                        throw new Error("A senha deve conter pelo menos um número");
                    }
                    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(val)) {
                        throw new Error("A senha deve conter pelo menos um caracter especial");
                    }
                }
            }
        },
        data_nascimento: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isValidDate(value) {
                    if (!value) {
                        return;
                    }

                    const dateOnly = value.toISOString().split('T')[0];

                    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
                        throw new Error('A data deve estar no formato YYYY-MM-DD.');
                    }
                }
            }
        },
        n_utente: {
            type: DataTypes.STRING(9),
            allowNull: true,
        },
        cedula: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
        },
        tipo: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['medico', 'paciente', 'admin'],
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        contacto: {
            type: DataTypes.STRING(9),
            allowNull: true,
        },
        imagem: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        cod_postal: {
            type: DataTypes.STRING(10),
            allowNull: true,
            references: {
                model: 'codigo_postal',
                key: 'cod_postal'
            }
        },
        id_genero: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'genero',
                key: 'id_genero'
            }
        },
        id_sistema_saude: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'sistema_de_saude',
                key: 'id_sistema_saude'
            }
        },
        id_especialidade: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'especialidade',
                key: 'id_especialidade'
            }
        },
    },
    {
        tableName: 'utilizador',
        timestamps: false
    }
    )

    return utilizador
};