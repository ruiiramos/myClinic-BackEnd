module.exports = (sequelize, DataTypes) => {
    const sistema_de_saude = sequelize.define("sistema_de_saude", {
        id_sistema_saude: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        sistema_saude: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'sistema_de_saude',
        timestamps: false
    });
    return sistema_de_saude;
};