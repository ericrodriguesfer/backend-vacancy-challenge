# Desafio Back-end Júnior/Pleno - Solicitaram que não informasse o nome da empresa

## Descrição

Este projeto é a minha proposta de solução a um desafio de uma empresa que solicitou para que não divulgasse seu nome, desafio esse proposto por eles em uma vaga de Desenvolvedor(a) Back-end Júnior/Pleno, onde o desafio em sua descrição consiste basicamente em criar/implementar uma api, para gerenciamento de rotas, esse gerenciamento de rotas se dá por meio de [Grafos](https://pt.wikipedia.org/wiki/Teoria_dos_grafos), caso queira entender melhor o desafio em si, [leia aqui](https://github.com/brasilcap/developer-java) a descrição fornecida para o desafio (essa descrição é uma descrição pública de um desafio contida no github da [brasilcap](https://github.com/brasilcap/)), a descrição do desafio em si, era um recorte desta do brasilcap, onde os *endpoints* que foram recortados para o desafio foi: 
* Salvar um grafo.
* Recuperar um grafo.
* Encontrar todas as rotas disponíveis dado um bairro de origem e outro de destino em um grafo salvo anteriormente.
* Determinar a distância mínima entre dois bairros em um grafo salvo.

Na mesma é descrito quais *endpoints* o Back-end/API precisa ter, e quais são os *Request payloads* e *Response payloads* envolvidos nesses dados *endpoints*. Mas, basicamente o desafio consiste em receber como entrada em uma rota um grafo direcionado, salvar o mesmo no banco de dados, uma outra rota apenas para buscar por um grafo em específico por o id do mesmo, um terceira rota para dado um grafo salvo anteriormente, sobre ele buscarmos todas as possíveis rotas entre dois pontos do grafo baseado em um limite de paradas ou não, e uma quarta e última rota que semelhante a terceira, se baseia em um grafo cadastrado anteriormente no banco de dados, e baseado nesse grafo, se busca a menor rota possível entre dois pontos desse dado grafo.

## Tecnologias utilizadas no projeto
* NodeJs
* ExpressJs
* NestJs
* TypeORM
* Docker e docker-compose
* PostgreSQL
* Swagger
* Graphology
* Class Transformer e Class Validator
* Typescript
* Entre outros

## Arquitetura

Para a implementação do projeto utilizei Nodejs em conjunto com o framewok Nestjs, TypeORM como ORM para o banco de dados, no qual utilizei para persistir os dados o PostgreSQL, todo o projeto foi implementado utilizando Typescript.

A arquitetura do projeto está basicamente focada dentro da pasta *src*, a baixo segue a estrutura de pastas do projeto bem como a organização dos arquivos do mesmo:

```
src
 -- app        // Pasta que contem toda a configuração geral da aplicação Nestjs, desde de conexão com banco de dados, configurações de funções que serão utilizadas globalmente pelo projeto, conexão entre os módulos da aplicação com as entidades da mesma.
 -- modules    // Pasta que contem todos os módulos da aplicação, que neste domínio é Laboratório, Exame...
 -- shared     // Pasta que contem todos os arquivos que são compartilhados por toda a aplicação, como middlewares (que nesse projeto não há nenhum implementado por mim) assim como também as migrations do banco de dados, que são os arquivos que gerenciam as versões do banco de dados.
 -- swagger    // Pasta que contem as configurações de inicialização do Swagger para documentação da API. 
 main.ts       // Arquivo principal de um projeto Nestjs, é por ele que é iniciado a execução de um projeto.
```

Analisando a pasta *src/app* em específico:
```
app
 -- contract                          // Pasta que contem os contratos das implementações, basicamente são as interfaces do projeto.
    - IResponseDefaultRoute.ts        // Contrato/Interface que define como deve ser o tipo de uma saida padrão para esse módulo.
 -- controllers                       // Pasta que contem os controllers deste módulo, basicamente os controladores são os resposáveis por receber a requisição HTTP e repassar os dados da mesma para os devidos serviços e aguardar o retorno desses serviços para expor a resposta ao requisitante.
    - app.controller.ts               // Controlador desde módulo, esse controlador basicamente expõe uma saída padrão da api que exibe uma mensagem de boas vindas.
 -- providers                         // Pasta que contem os provedores de funcionalidades globais do projeto, como implementações genéricas que são utilizadas por mais de um local ou módulo no projeto.
   -- SearchTowns                     // Pasta que contem o provedor de funcionalidade referente a busca pelas cidades repassadas, para ver se as mesmas realmente existem no grafo.
     -- contracts                     // Pasta que contem os arquivos de contratos do dado provedor.
      - ISearchTowns.ts               // Arquivo de contrato/interface que define como deve se seguir o fluxo de implementação desta funcionalidade/provedor.
     -- implementations               // Pasque que contem os arquivos de implementação real do provedor/funcionalidade.
      - SearchTownsImplementations.ts // Arquivo que implementa o contrato que está um nível a cima no nível de pastas, e baseado nesse contrato executa seus algoritmos/códigos para prover a funcionalidade deste provedor sempre dentro do contrato definido antes.
   -- SetupGraph                      // Pasta que contem um outro provedor de funcionalidade, neste caso é o de configuração/inicialização do grafo, a organização deste segue o mesmo padrão do provedor anteriormente explicado.
 -- services                          // Pasta que contem todos os serviços do módulo, que é basicamente onde os dados que vieram pela requisição HTTP, são processados e aplicados sobre as regras de negócio do domínio, e o retorno do processamento é retorno ao controlador que o requisitou e retorna ao requisitante da ação.
    - app.service.ts                  // Serviço deste módulo, esse serviço basicamente ele retorna uma mensagem de boas vindas, mensagem essa que é retorna pelo controlador deste módulo, que foi apresentado anteriormente.
 app.module.ts                        // Arquivo de configuração deste módulo, que no caso é o módulo principal da aplição, no dado arquivo é configurado e lincado os demais módulos da aplicação, bem como todas as entidades da aplição e demais configurações de serviços e/ou bibliotecas que irão ser utilizados por todo o restande a aplicação.
```
Analisando a pasta *src/modules* em específico:
```
modules
 -- distance   // Pasta de contem tudo sobre o módulo de Distância, basicamente, tudo neste módulo é referente a funcionalidade de busca de caminho mínimo entre dois vértices de um grafo.
 -- graph      // Pasta de contem tudo sobre o módulo de Grafos, desde a definição da entidade que modela uma tabela no banco de dados e é gerenciada pelo ORM, incluindo os controllers, services, dtos responsáveis pelo funcionamento do módulo, e mais algum coisa/implementação que seja necessária para o funcionamento deste módulo, é neste módulo onde é feita a parte básica do CRUD do Grafo, neste caso criação e recuperação de um grafo já cadastrado anteriormente.
 -- routes     // Pasta de contem tudo sobre o módulo de Rotas, basicamente, tudo neste módulo é referente a funcionalidade de busca de caminhos entre dois vértices de um grafo dado um número máximo de paradas ou não.
```
De forma estrutural todas os módulos possuem estruturas semelhantes em termo de organização e estrutura de pastas, a diferença é que cada módulo trata das regras de negócio de sua entidade, no máximo de uma outra entidade correlata ou relacionada a sua própria. 
Abaixo irei exemplificar a estrutura geral de qualquer um dos módulos:
```
nome-do-modulo
  -- dto                                     // Pasta que contem todas as definições das DTOs (Data Transfer Object) do projeto, podendo ser as DTOs contratos/interfaces ou classes propriamente ditas, com foco em tipar um dado, seja o mesmo de entrada ou saída.
     - exampleDTO.ts                         // Arquivos Typescript que definide uma DTO dentro do dado módulo, definição essa sendo feita com classes, caso fosse utilizada uma interface para isso, teria que ser nomenclaturado como IExampleDTO.ts, para exemplificar que é um arquivo de contrado guiado a interface.
  -- infra                                   // Pasta responsável por abrigar a parte de infraestrutura do módulo. Onde contém as definições do traceamento das requisições HTTP assim como a parte de configuração das entidades do módulo, que são gerenciadas pelo ORM e modelam alguma tabela do banco de dados (preferencialmente).
   -- contracts                              // Pasta responsável por abrigar os contratos/interfaces referentes a infraestrutura do módulo, como por exemplo um contrato de uma response de um ou mais endpoints providos por esse dado módulo. OBS: Essa pasta é opcional, nem todos os módulos conterão a mesma, pois nem todos necessitam da existência de contratos mais rígidos.
       - IContractExample.ts                 // Arquivo Typescropt que define uma interface/contrato para este módulo.
   -- http                                   // Pasta responsável por abrigar as implementações que gerenciam as requisições HTTP, nesse caso, os Controllers do módulo.
       - example.controller.ts               // Controllador do módulo, responsável por receber as requisições HTTP e as endereçar para o seu divido serviço e retornar ao requisitante o resultado da operação do serviço. Pode havar mais de um Controller dentro do mesmo módulo.
    -- typeorm                               // Pasta que contém todas as definições relacionadas ao banco de dados, nesse nosso caso, do nosso ORM.
     -- entities                             // Pasta que contem as definições das entidades do módulo que são gerenciadas pelo ORM. Pode haver mais de uma entidade por módulo.
       - Example.ts                          // Classe que contem a criação da entidade, que é controlada pelo ORM como um modelo de uma tabela do banco de dados.
  -- providers                               // Pasta que contem os provedores de funcionalidades globais do módulo, como implementações genéricas que são utilizadas por mais de um local no módulo, ou uma implementação de uma regra de negócio que pode sofrer alterações posteriores, como por exemplo: uma funcionalidade atrelada a uma tecnologia/biblioteca X por exemplo, que posteriormente poderá ser alterada, a mesma já pensada para isolar partes da regra de negócio guiadas a contratos, para já proteger o projeto das famosas variações protegidas, que mesmo que a regra de negócio seja alterada, o contrato de implementação é o mesmo, assim no restante do código do projeto não haverá reflexo algum. OBS: Essa pasta é opcional, nem todos os módulos conterão a mesma, pois nem todos necessitam da existência de provedores mais customizados de dadas funcionalidades ou regras de negócio.
    -- ExampleProvider                       // Pasta que contem um provedor de funcionalidade.
      -- contracts                           // Pasta que contem o contrato/interface deste dado provedor de funcinalidade.
        - IContractExample.ts                // Arquivo Typescript de contrato/interface desde dado proveedor.
      -- implementations                     // Pasta que contem a implementação desde dado provedor de funcionalidade.
        - IContractExampleImplementations.ts // Arquivo que segue o contrato definido por este dado provedor, e implementa a dada regra de negócio guiada ao contrato que foi previamente definido.
  -- services                                // Pasta que armazena todos os serviços da aplicação, que gerenciam os dados coletados pelo controlador da requisição HTTP, aplicada as regras de negócio sobre os mesmos, realizam suas operaçãoes no banco de dados e realizam o retorno do resultado da operação para o Controller que devolve para o requisitante.
     - example.service.ts                    // Arquivo que exemplifica um serviço da aplicação, basicamente um serviço executa uma única tarefa, exemplo: Cadastro de usuário no banco de dados, executando e aplicando as regras de negócios sobre os dados que foram repassados para a requisição, executando as operações devidas no banco de dados, e dando o retorno dessa ação para o controlador que por sua vez devolve ao requisitante.
  nome-do-modulo.module.ts                   // Arquivo que configura tudo que tem/é utilizado no módulo, como os serviços, controladores do módulo, bem como as entidades com as quais o mesmo irá trabalhar. Bem como as definições de quais de suas funcionalidades outros módulos da aplicação podem ou não utilizar.
```
Por fim, iremos dar uma olhada na pasta *shared*, que é onde contem os arquivos compartilhados da aplicação, em *src/shared*:
```
shared
 -- http            // Pasta que contem todos os compartilhados do projeto, geralmente sendo os mesmo, os middlewares da aplicação, como um middlewares de autenticação, que intercepta toda requisição que necessita de login e válida se o requisitante está logado com algum tipo de token, caso sim ele libera o acesso a requisição, caso não ele rejeita e exemplifica a causa da rejeição.
   -- middlewares   // Pasta que contem todos os middlewares da aplicação, neste projeto em específico não há nenhum.
 -- infra           // Pasta que contem todas as configurações de infraestrutura globais da aplicação.
   -- typeorm       // Pasta que contem as configurações globais do ORM da aplicação.
     -- migrations  // Pasta que armanzena todas as migrações de banco de dados criadas na aplicação para o gerenciamento e versionamento do banco de dados.
```
Como informando anteriormente no inicio desta documentação, a pasta swagger é basicamente destinada as configurações do swagger na aplicação.

Exemplificando o padrão de acesso aos dados da aplicação:

```
Requisição HTTP -> Controller -> Service -> Repository -> Entity
```

## Requisitos para executar o projeto
* Ter o Node instalado em sua máquina.
* Ter o gerenciador de pacotes Yarn ou NPM instalado em sua máquina.
* Ter o Git instalado em sua máquina.
* Ter o Docker instalado em sua máquina.
* Ter o docker-compose instalado em sua máquina.

## Como executar o projeto

Primeiro faça um clone do projeto para sua máquina, assim escolha um local em seu computador que acha adequado para tal, e siga os passos/comandos a baixo em um terminal de sua preferência, executando um por vez, uma após o final da execução do outro:
```bash
git clone https://github.com/ericrodriguesfer/backend-vacancy-challenge.git

cd backend-vacancy-challenge

# Use um desses três comandos a baixo, ambos fazem a mesma coisa
yarn         # Opção 01
npm i        # Opção 02
npm install  # Opção 03
```

Com isso terá clonado o projeto em sua máquina e instalado todas as dependências necessárias para ele funcionar.
Agora iremos configurar a parte de infraestrutura do projeto, mas fica tranquilo que estamos utilizando Docker, e isso irá simplificar seu trabalho. 

Para título de simplificação da execução deste projeto em sua máquina, eu subi o projeto para o git com o arquivo *.env*, é nele que contem todas as variáveis de ambiente que o projeto necessita para executar. Portanto, recomendo que não altere os valores presentes no mesmo caso não tenha a devida certeza do que está fazendo.

Para executar o projeto, execute o seguinte comando:

```bash
docker-compose up -d
```
Após isso, o Docker irá executar os passos definidos e configurados para o projeto, e uma primeira execução esse processo pode demorar um pouco, mas a partir de uma segunda vez, esse processo é rápido, quando tudo der certo e for concluído em seu terminal aparecerá o seguinte:

```bash
Creating network "backend-vacancy-challenge_backendvacancy" with driver "bridge"
Creating database-backend-vacancy ... done
Creating backend-vacancy-challenge-api ... done
```
Já estamos quase nos aproximando do momento de executar o projeto. Como último passo de configuração, em seu terminal digite o comando que listarei a baixo, esse comando irá na pasta que guarda as migrações, e irá às executar para criar as tabelas que modelam as entidades do projeto no banco de dados:

```bash
# Existes algumas formas de rodar o comando, irei listas algumas, use a que preferir
yarn typeorm migration:run         # Opção 01
npm run typeorm migration:run      # Opção 02
npx typeorm migration:run          # Opção 03
```

Após isso você já pode realizar a utilização e exploração do projeto, caso tenha seguido todo o passo a passo como segueri, a aplicação estará rodando na seguinte url em sua máquina: http://localhost:8080, caso deseje acessar a documentação da api que foi feita com Swagger, acesse a seguinte url em sua máquina: http://localhost:8080/docs.

Caso queira testar/realizar as requisições/explorar o projeto por alguma ferramenta dedicada para depurar e executar apis/back-end, no link que segue a frente, disponibilizo para download o arquivo de exportação do Insomonia, [[arquivo insomnia clique aqui]](https://www.mediafire.com/file/g2obcd5m5ngo1tm/Insomnia_2022-04-30.json/file), basta fazer o download deste arquivo e ir em seu Insomnia e importar esse arquivo que será criado uma coleção sem sua workspace e dentro dela terá todas as requisições que podem ser feitas ao projeto, bem como suas urls, headers, params e bodys definidos e previamente preenchidos.

## Documentação de Requisições

<img src="https://i.ibb.co/99nx55s/grafo-teste.png" alt="Grafo explorado nos exemplos de requisições abaixo"/>

Esta figura é a representação do grafo que será explorado logo abaixo nos exemplos e explicações das requisições.

### Salvar Grafo

Esse endpoint é responsável por receber um grafo direcionado e salvá-lo no banco de dados.
* Endpoint: `http://localhost:8080/graph`
* HTTP Method: POST
* HTTP Success Response Code: CREATED (201)
* Contract:
  * Request payload

```json
{​
  "data": [
    {
      "source": "A", "target": "B", "distance": 3
    },
    {
      "source": "A", "target": "C", "distance": 1
    },
    {
      "source": "A", "target": "D", "distance": 2
    },
		{
      "source": "A", "target": "E", "distance": 8
    },
		{
      "source": "B", "target": "C", "distance": 3
    },
		{
      "source": "E", "target": "D", "distance": 3
    },
		{
      "source": "D", "target": "B", "distance": 6
    }​​
  ]
}​
```
  * Response payload
```json
{
  "id": 1,
  "data": [
    {
      "source": "A",
      "target": "B",
      "distance": 3
    },
    {
      "source": "A",
      "target": "C",
      "distance": 1
    },
    {
      "source": "A",
      "target": "D",
      "distance": 2
    },
    {
      "source": "A",
      "target": "E",
      "distance": 8
    },
    {
      "source": "B",
      "target": "C",
      "distance": 3
    },
    {
      "source": "E",
      "target": "D",
      "distance": 3
    },
    {
      "source": "D",
      "target": "B",
      "distance": 6
    }
  ]
}​
```
### Recuperar Grafo
Esse endpoint deverá retornar um grafo previamente salvo no banco de dados. Se o grafo não existe, deverá retornar HTTP NOT FOUND.
* Endpoint: `http://localhost:8080/graph/<graphId>`
* Exemplo da requisição: `http://localhost:8080/graph/1`
* HTTP Method: GET
* HTTP Success Response Code: OK (200)
* HTTP Error Response Code: NOT FOUND (404)
* Contract:
  * Request payload: none
  * Response payload

```json
{
  "id": 1,
  "data": [
    {
      "source": "A",
      "target": "B",
      "distance": 3
    },
    {
      "source": "A",
      "target": "C",
      "distance": 1
    },
    {
      "source": "A",
      "target": "D",
      "distance": 2
    },
    {
      "source": "A",
      "target": "E",
      "distance": 8
    },
    {
      "source": "B",
      "target": "C",
      "distance": 3
    },
    {
      "source": "E",
      "target": "D",
      "distance": 3
    },
    {
      "source": "D",
      "target": "B",
      "distance": 6
    }
  ]
}​
```

### Encontrar todas rotas disponíveis dada uma cidade de origem e outra de destino em um grafo salvo anteriormente
Utilizando um grafo salvo anteriormente, esse endpoint deverá calcular todas as rotas disponíveis de uma cidade origem para outra de destino, dado um número máximo de paradas. Se não existirem rotas possíveis, o resultado deverá ser uma lista vazia. Se o parâmetro "maxStops" não for definido, você deverá listar todas as rotas possíveis. Se o grafo não existir, deverá retornar HTTP NOT FOUND.
Exemplo: No grafo (AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7), as possíveis rotas de A para C com máximo de 3 paradas seriam: ["ABC", "ADC", "AEBC"]. Mas caso seja repassado nos parâmetros alguma cidade que não está contida no grafo solicitado, será retornado um HTTP CONFLICT.
* Endpoint: `http://localhost:8080/routes/<graphId>/from/<town1>/to/<town2>?maxStops=<maxStops>`
* Exemplo da requisição: `http://localhost:8080/routes/1/from/A/to/C`
* HTTP Method: POST
* HTTP Success Response Code: OK (200)
* HTTP Error Response Code: NOT FOUND (404)
* HTTP Error Response Code: CONFLICT (409)
* Contract:
  * Grafo salvo anteriormente sem número de paradas definido
  * Request payload: none
  * Response payload
```json
{
  "routes": [
    {
      "route": "AEDBC",
      "stops": 4
    },
    {
      "route": "ADBC",
      "stops": 3
    },
    {
      "route": "AC",
      "stops": 1
    },
    {
      "route": "ABC",
      "stops": 2
    }
  ]
}​
```
* Mesma requisição da anterior, ainda no mesmo grafo definido anteriormente, mas dessa vez com um número máximo de paradas definido com o valor de duas paradas.
* Exemplo da requisição: `http://localhost:8080/routes/1/from/A/to/C?maxStops=2`
```json
{
  "routes": [
    {
      "route": "AC",
      "stops": 1
    },
    {
      "route": "ABC",
      "stops": 2
    }
  ]
}
```
### Determinar a distância mínima entre duas cidades em um grafo salvo

Utilizando um grafo salvo anteriormente, esse endpoint deverá determinar a rota cuja distância seja a mínima possível entre duas cidades. Se as cidades de origem e destino forem iguais, o resultado deverá ser zero. Se não exitir rota possível entre as duas cidades, então o resultado deverá ser -1. Se o grafo não existir, deverá retornar HTTP NOT FOUND. Mas caso seja repassado nos parâmetros alguma cidade que não está contida no grafo solicitado, será retornado um HTTP CONFLICT.
* Endpoint: `http://localhost:8080/distance/<graphId>/from/<town1>/to/<town2>`
* Exemplo da requisição: `http://localhost:8080/distance/1/from/A/to/C`
* HTTP Method: POST
* HTTP Success Response Code: OK (200)
* HTTP Error Response Code: NOT FOUND (404)
* HTTP Error Response Code: CONFLICT (409)
* Contract:
  * Grafo salvo anteriormente
  * Request payload: none
  * Response payload
```json
{
  "distance": 1,
  "path": [
    "A",
    "C"
  ]
}
```
* Mesma requisição da anterior, ainda no mesmo grafo definido anteriormente, mas dessa vez com umas das cidades diferentes.
* Exemplo da requisição: `http://localhost:8080/distance/1/from/E/to/C`
```json
{
  "distance": 12,
  "path": [
    "E",
    "D",
    "B",
    "C"
  ]
}
```
* Mesma requisição da anterior, ainda no mesmo grafo definido anteriormente, mas dessa vez com rota nula entre as cidades.
* Exemplo da requisição: `http://localhost:8080/distance/1/from/E/to/A`
```json
{
  "distance": -1,
  "path": []
}
```
## Execução dos testes unitários

Os casos de testes unitários foram implementados para os locais da aplicação onde são executadas e tratadas as regras de negócios do domínio, que nesta aplicação como foi definido pela arquitetura da mesma, esse tipo de execução e tratamento ocorre nos *services* de cada módulo/*module*, assim os testes unitários foram implementados para todos os *services* do projeto.

Em seu terminal, digite o seguinte comando:
```bash
# Existes algumas formas de rodar o comando, irei listas algumas, use a que preferir
yarn test         # Opção 01
npm run test      # Opção 02
npm test          # Opção 03
```

Caso tudo dê certo, você irá receber a seguinte/ou semelhante saída em seu terminal:
```bash
yarn run v1.22.17
$ jest
PASS  test/unit/graph/CreateGraph.spec.ts
PASS  test/unit/graph/GetGraph.spec.ts
PASS  test/unit/distance/GetMinDistanceGraph.spec.ts
PASS  test/unit/routes/SearchRoutes.spec.ts

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        5.142 s, estimated 6 s
Ran all test suites.
Done in 5.74s.
```

Caso queira ver a implementação dos testes unitários, na raiz do projeto, há uma pasta chamada *test*, e dentro da mesma a divisão entre os testes, nesse caso, como estamos tratando dos testes unitários, os mesmos estão dentro da pasta *unit*, e dentro da mesma, temos uma pasta dedicada a cada módulo/*module* existente na aplicação, e dentro de cada uma, há uma pasta chamada *mocks*, onde dentro da mesma a todas as configuraçoes de mocks necessárias para a realização dos testes do dado módulo/*module*, e junto com a pasta de *mocks*, há os arquivos de caso de testes implementados para cada *service* presente no dado módulo/*module*.

Veja abaixo um exemplo de como está organizado os testes:
```
-- descricao                        // Pasta que contem o README com a descrição do desafio.
-- src                              // Pasta raiz do projeto.
-- test                             // Pasta destinada a implementação dos testes do projeto.
   -- unit                          // Pasta destinada a implementação dos testes unitários do projeto.
     -- module-name                 // Pasta referente a um módulo do projeto.
       -- mocks                     // Pasta que contêm os mocks referentes aos testes do dado módulo do projeto.
         - ExampleServiceMock.ts    // Arquivo que contêm todos os mocks necessários para a execução dos testes de um service do dado módulo.
       - ExampleTest.spec.ts        // Arquivo que contem a implementação de todos os casos de teste para um servico do dado módulo.
```

## Observação
 
Caso queira parar a execução do projeto, digite o seguinte comando em seu terminal:
```bash
docker-compose down
```

Que caso tudo dê certo, será lhe mostrado uma saída semelhante a essa:
```bash
Stopping backend-vacancy-challenge-api ... done
Stopping database-backend-vacancy      ... done
Removing backend-vacancy-challenge-api ... done
Removing database-backend-vacancy      ... done
Removing network backend-vacancy-challenge_backendvacancy
```
E o Docker terá desligado seus containers e consequentemente parado a execução do projeto.

## CASO QUEIRA SABER MAIS SOBRE O PROJETO

Pode entrar em contato comigo pelo seguinte email: ericdesenvolvedor7@gmail.com