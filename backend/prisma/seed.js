const { PrismaClient } = require("../generated/prisma/index");

const prisma = new PrismaClient();

async function main() {
  // Inserir ou atualizar o paciente
  const cpfPaciente = "12345678900";
  const diaConsulta = 2;
  const status = "emAcompanhamento";
  const horarioConsulta = "14:30";
  const avatarUrl = "https://avatars.githubusercontent.com/u/55458349?v=4";

  await prisma.paciente.upsert({
    where: { cpf: cpfPaciente },
    update: {
      dia_consulta: diaConsulta,
      status: status,
      horario_consulta: horarioConsulta,
      avatar_url: avatarUrl,
    },
    create: {
      cpf_fono: "98765432100",
      nome: "Miguel Oliveira",
      cpf: cpfPaciente,
      dia_consulta: diaConsulta,
      status: status,
      horario_consulta: horarioConsulta,
      avatar_url: avatarUrl,
      email: "miguel@gmail.com",
      senha: "123456"
    },
  });

  // Inserir exercícios na tabela Exercicios
  const exerciciosC = [
    {
      nome_exercicio: "Lateralizar",
      repeticoes: 10,
      texto_descritivo: "Movimentar a língua da esquerda para a direita lentamente.",
      video_exemplo: "https://www.youtube.com/watch?v=video1",
      cpf_fono: "98765432100",
      cpf_paciente: "12345678900",
      data_execucao: new Date("2025-04-04"),
    },
    {
      nome_exercicio: "Afilar Língua",
      repeticoes: 8,
      texto_descritivo: "Afilar a língua por 5 segundos, depois relaxar.",
      video_exemplo: "https://www.youtube.com/watch?v=video2",
      cpf_fono: "98765432100",
      cpf_paciente: "12345678900",
      data_execucao: new Date("2025-04-04"),
    }
  ];

  for (const exercicio of exerciciosC) {
    await prisma.exercicios.create({ data: exercicio });
  }


  // Inserir uma dúvida
  const dataHora = new Date("2025-03-29T16:07:10-03:00").toString();
  const mensagem = "Como melhorar minha execução nos exercícios?";

  await prisma.duvidas.create({
    data: {
      cpf_paciente: cpfPaciente,
      data_hora: dataHora,
      mensagem: mensagem,
    },
  });

  // Inserir 5 pacientes e 3 dúvidas para cada um
  const pacientes = [
    {
      cpf: "11111111111",
      nome: "João Silva",
      dia_consulta: 1,
      status: "emAcompanhamento",
      horario_consulta: "09:00",
      avatar_url: "",
      email: "joao@gmail.com",
      senha: "123456"
    },
    {
      cpf: "22222222222",
      nome: "Maria Santos",
      dia_consulta: 2,
      status: "emAvaliacao",
      horario_consulta: "10:30",
      avatar_url: "",
      email: "maria@gmail.com",
      senha: "123456"
    },
    {
      cpf: "33333333333",
      nome: "Carlos Lima",
      dia_consulta: 3,
      status: "concluido",
      horario_consulta: "11:45",
      avatar_url: "",
      email: "carlos@gmail.com",
      senha: "123456"
    },
    {
      cpf: "44444444444",
      nome: "Ana Costa",
      dia_consulta: 4,
      status: "emAcompanhamento",
      horario_consulta: "13:15",
      avatar_url: "",
      email: "ana@gmail.com",
      senha: "123456"
    },
    {
      cpf: "55555555555",
      nome: "Pedro Almeida",
      dia_consulta: 5,
      status: "emAvaliacao",
      horario_consulta: "15:00",
      avatar_url: "",
      email: "pedro@gmail.com",
      senha: "123456"
    },
  ];

  for (const paciente of pacientes) {
    await prisma.paciente.upsert({
      where: { cpf: paciente.cpf },
      update: {
        dia_consulta: paciente.dia_consulta,
        status: paciente.status,
        horario_consulta: paciente.horario_consulta,
        avatar_url: paciente.avatar_url,
        email: paciente.email,
        senha: paciente.senha
      },
      create: {
        cpf_fono: "98765432100",
        nome: paciente.nome,
        cpf: paciente.cpf,
        dia_consulta: paciente.dia_consulta,
        status: paciente.status,
        horario_consulta: paciente.horario_consulta,
        avatar_url: paciente.avatar_url,
        email: paciente.email,
        senha: paciente.senha
      },
    });

    const fonos = [
      {
        cpf: "98765432100",
        nome: "Julia Santos",
        crfa: "CRFa 4-4258",
        email: "julia@gmail.com",
        senha: "123456"
      },
      {
        cpf: "98765432101",
        nome: "Ana Almeida",
        crfa: "CRFa 4-4258",
        email: "ana@gmail.com",
        senha: "123456"
      },
      {
        cpf: "98765432102",
        nome: "Pedro Oliveira",
        crfa: "CRFa 4-4258",
        email: "pedro@gmail.com",
        senha: "123456"
      }
    ]

    for (const fono of fonos) {
      await prisma.fono.upsert({
        where: { cpf: fono.cpf },
        update: {
          email: fono.email,
          senha: fono.senha
        },
        create: {
          cpf: fono.cpf,
          nome: fono.nome,
          crfa: fono.crfa,
          email: fono.email,
          senha: fono.senha
        },
      });
    }

    const duvidas = [
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T10:00:00").toString(),
        mensagem: `Dúvida 1 do paciente ${paciente.nome}`,
      },
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T11:00:00").toString(),
        mensagem: `Dúvida 2 do paciente ${paciente.nome}`,
      },
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T12:00:00").toString(),
        mensagem: `Dúvida 3 do paciente ${paciente.nome}`,
      },
    ];

    for (const duvida of duvidas) {
      await prisma.duvidas.create({ data: duvida });
    }
  }

  // Inserir dois exercícios realizados pelo paciente
  const exercicios = [
    {
      id_exercicio: 1,
      nome_exercicio: "Lateralizar",
      duracao_video: 12.5,
      data: new Date("2025-03-28").toString(),
      execucao: "Completo",
      nota_execucao: 4.5,
      cpf_paciente: cpfPaciente,
    },
    {
      id_exercicio: 2,
      nome_exercicio: "Afilar",
      duracao_video: 8.0,
      data: new Date("2025-03-28").toString(),
      execucao: "Completo",
      nota_execucao: 3.8,
      cpf_paciente: cpfPaciente,
    },
  ];

  for (const exercicio of exercicios) {
    await prisma.exerciciosRealizados.create({ data: exercicio });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
