module.exports = (sequelize, DataTypes) => {
    const medico = sequelize.define("medico", {
        id_medico: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nome_medico: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cedula: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_especialidade: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'especialidade',
                key: 'id_especialidade'
            }
        },
    },
    {
        tableName: 'medico',
        timestamps: false
    }
    )

    return medico
};