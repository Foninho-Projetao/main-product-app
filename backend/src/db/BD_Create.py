import sqlite3
import os 


# Conectar (ou criar) o banco de dados
connection = sqlite3.connect("database.db")

# Criar um cursor para executar comandos SQL
cursor = connection.cursor()

# Criar a tabela "paciente"
cursor.execute("""
CREATE TABLE IF NOT EXISTS paciente (
    cpf_fono TEXT NOT NULL,
    nome TEXT NOT NULL,
    cpf TEXT PRIMARY KEY,
    feedback TEXT NOT NULL DEFAULT ''
)
""")

# Criar a tabela "exercicios_realizados"
cursor.execute("""
CREATE TABLE IF NOT EXISTS exercicios_realizados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_exercicio INTEGER NOT NULL,
    nome_exercicio TEXT NOT NULL,
    duracao_video REAL NOT NULL,
    data TEXT NOT NULL,
    execucao TEXT NOT NULL,
    nota_execucao REAL NOT NULL,
    cpf_paciente TEXT NOT NULL,
    FOREIGN KEY (cpf_paciente) REFERENCES paciente (cpf)
)
""")

cursor.execute("""
CREATE TABLE fono (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
)
""")  


cursor.execute("""
CREATE TABLE exercicios (
    id SERIAL PRIMARY KEY,
    nome_exercicio VARCHAR(255) NOT NULL,
    repeticoes INT NOT NULL,
    texto_descritivo TEXT NOT NULL,
    video_exemplo VARCHAR(255),
    cpf_fono VARCHAR(14) NOT NULL,
    cpf_paciente VARCHAR(14) NOT NULL,
    data_execucao DATE NOT NULL,
    FOREIGN KEY (cpf_fono) REFERENCES Fono(cpf) ON DELETE CASCADE,
    FOREIGN KEY (cpf_paciente) REFERENCES Paciente(cpf) ON DELETE CASCADE
)""")



# Salvar as alterações e fechar a conexão
connection.commit()
connection.close()

print("Banco de dados criado com sucesso!")