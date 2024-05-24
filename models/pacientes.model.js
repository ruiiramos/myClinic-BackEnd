module.exports = (sequelize, DataTypes) => {
    const paciente = sequelize.define("paciente", {
        id_paciente: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        data_nascimento: {
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
        n_utente: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        profissao: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_genero: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'genero',
                key: 'id_genero'
            }
        },
        cod_postal: {
            type: DataTypes.INTEGER(10),
            references: {
                model: 'codigo_postal',
                key: 'cod_postal'
            }
        },
        id_sistema_saude: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'sistema_de_saude',
                key: 'id_sistema_saude'
            }
        },
    },
    {
        tableName: 'paciente',
        timestamps: false
    }
    )

    return paciente
};