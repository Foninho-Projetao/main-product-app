import sqlite3
import os

# Conectar ao banco de dados
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

# Inserir um paciente
cpf_paciente = "12345678900"
cursor.execute("""
INSERT OR IGNORE INTO paciente (cpf_fono, nome, cpf)
VALUES ('98765432100', 'Miguel Oliveira', ?)
""", (cpf_paciente,))

# Inserir dois exercícios realizados pelo paciente
exercicios = [
    (1, 'Lateralizar', 12.5, '2025-03-28', 'Completo', 4.5, cpf_paciente),
    (2, 'Afilar', 8.0, '2025-03-28', 'Completo', 3.8, cpf_paciente)
]

cursor.executemany("""
INSERT INTO exercicios_realizados (id_exercicio, nome_exercicio, duracao_video, data, execucao, nota_execucao, cpf_paciente)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", exercicios)

# Salvar as alterações e fechar a conexão
connection.commit()
connection.close()

print("Dados inseridos com sucesso!")