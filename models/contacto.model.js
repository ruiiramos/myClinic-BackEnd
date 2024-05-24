module.exports = (sequelize, DataTypes) => {
    const contacto = sequelize.define("contacto", {
        id_contacto: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        contacto: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        id_paciente: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'paciente',
                key: 'id_paciente'
            }
        },
    }, {
        tableName: 'contacto',
        timestamps: false
    });
    return contacto;
};