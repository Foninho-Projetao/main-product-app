const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();

// Criar novo exercício
const createExercise = async (req, res) => {
  const {
    nome_exercicio,
    repeticoes,
    texto_descritivo,
    video_exemplo,
    cpf_fono,
    cpf_paciente,
    data_execucao,
  } = req.body;

  if (
    !nome_exercicio ||
    !repeticoes ||
    !texto_descritivo ||
    !cpf_fono ||
    !cpf_paciente ||
    !data_execucao
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const novoExercicio = await prisma.exercicios.create({
      data: {
        nome_exercicio,
        repeticoes: Number(repeticoes),
        texto_descritivo,
        video_exemplo,
        cpf_fono,
        cpf_paciente,
        data_execucao: new Date(data_execucao),
      },
    });

    res
      .status(201)
      .json({ message: "Exercício criado com sucesso.", id: novoExercicio.id });
  } catch (err) {
    console.error("Erro ao criar exercício:", err.message);
    res.status(500).json({ error: "Erro ao criar exercício." });
  }
};

// Listar todos os exercícios
const getAllExercises = async (req, res) => {
  try {
    const exercicios = await prisma.exercicios.findMany();

    if (exercicios.length === 0) {
      return res.status(404).json({ message: "Nenhum exercício encontrado." });
    }

    res.json(exercicios);
  } catch (err) {
    console.error("Erro ao buscar exercícios:", err.message);
    res.status(500).json({ error: "Erro ao buscar exercícios." });
  }
};

// Listar exercícios por CPF do paciente
const getExercisesByCpf = async (req, res) => {
  const cpf = req.params.cpf;

  try {
    const exercicios = await prisma.exercicios.findMany({
      where: {
        cpf_paciente: cpf,
      },
    });

    if (exercicios.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum exercício encontrado para este CPF." });
    }

    res.json(exercicios);
  } catch (err) {
    console.error("Erro ao buscar exercícios por CPF:", err.message);
    res.status(500).json({ error: "Erro ao buscar exercícios." });
  }
};

module.exports = {
  createExercise,
  getAllExercises,
  getExercisesByCpf,
};
