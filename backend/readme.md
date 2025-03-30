# Como funciona o banco de dados
Para iniciar ele, basta rodar o `npm start`,  a estrutura base dele está assim, mas se necessário, podem adicionar novos campos:

![Diagrama ER](src/db/src/diagrama.png)

## Como adicionar uma tabela
Vá no arquivo `src/db/BD_Create.py` e adicione o código SQL de criação dela, seguindo o modelo já existente no arquivo.

## Como realizar a inserção de dados
Vá no arquivo `src/db/mapeamento.py`, sabendo a tabela que quer inserir os dados, adicione um array, como no exemplo abaixo, onde há uma inserção na tabela "Exercícios"

```
exercicios = [
    (1, 'Lateralizar', 12.5, '2025-03-28', 'Completo', 4.5, cpf_paciente),
    (2, 'Afilar', 8.0, '2025-03-28', 'Completo', 3.8, cpf_paciente)
]
```

Depois disso, basta criar um modelo do código de inserção, basta atualizar esse exemplo:

```
cursor.executemany("""
INSERT INTO exercicios_realizados (id_exercicio,            nome_exercicio, duracao_video, data, execucao, nota_execucao, cpf_paciente)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", exercicios)
```

Onde é passado os valores a serem inseridos com "?" e, após a string de inserção de dados em sql, é adicionado a variável criada anteriormente. 