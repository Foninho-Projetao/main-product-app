const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbPath = path.resolve(__dirname, "../../database.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    }
});
 
const getExercisesById = (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            nome_exercicio, 
            repeticoes,
            texto_descritivo,
            video_exemplo
        FROM exercicios
        WHERE exercicios.id = ?
    `;

    db.get(query, [id], (err, exercise) => {
            if (err) {
                console.error("Erro ao buscar exercício:", err.message);
                return res.status(500).json({ error: "Erro ao buscar exercício." });
            }
            if (!exercise) {
                return res.status(404).json({ error: "Exercício não encontrado." });
            }

            return res.status(200).json({
                success: true,
                data: exercise
            });
        });
}

module.exports = { getExercisesById };