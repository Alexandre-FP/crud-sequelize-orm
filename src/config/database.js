module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "root",
  database: "estudosNode",
  define: {
    timestamp: true, // cria duas colunas: createdAt e updatedAt
    underscored: true,
    underscoredAll: true,
  },
};
