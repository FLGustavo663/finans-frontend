// Simulação da extração de dados do quiz de referência.
// Adicionando campo 'explanation' a cada pergunta.
// MODIFICADO: Adicionado sistema de histórico completo do quiz
// MODIFICADO: Ajustado IDs dos elementos DOM para corresponder ao quiz.html
// CORRIGIDO: Erro de FieldValue.serverTimestamp() com arrayUnion
// INTEGRAÇÃO: Adicionada integração com API do Gemini 2.5 Flash

const quizData = {
    "orcamento": {
        title: "Orçamento Pessoal",
        iconClass: "fas fa-wallet",
        questions: [
            {
                question: "Qual é a regra financeira conhecida como 50/30/20?",
                options: [
                    "50% para moradia, 30% para alimentação e 20% para transporte",
                    "50% para necessidades, 30% para desejos e 20% para poupança",
                    "50% para gastos fixos, 30% para gastos variáveis e 20% para emergências",
                    "50% para investimentos, 30% para gastos e 20% para doações"
                ],
                answer: "50% para necessidades, 30% para desejos e 20% para poupança",
                explanation: "A regra 50/30/20 sugere que 50% da renda seja destinada para necessidades básicas (moradia, alimentação, transporte, saúde), 30% para desejos (lazer, viagens, restaurantes) e 20% para poupança e investimentos. É uma forma simples de organizar o orçamento mensal."
            },
            {
                question: "O que é considerado um gasto essencial (necessidade)?",
                options: [
                    "Assinatura de streaming",
                    "Aluguel ou financiamento da casa",
                    "Viagem de férias",
                    "Jantar em restaurante"
                ],
                answer: "Aluguel ou financiamento da casa",
                explanation: "Gastos essenciais ou necessidades são aqueles indispensáveis para viver, como moradia, alimentação básica, transporte para o trabalho, saúde e contas de consumo (água, luz)."
            },
            {
                question: "Qual a importância de criar uma reserva de emergência?",
                options: [
                    "Para comprar itens de luxo",
                    "Para cobrir gastos inesperados sem se endividar",
                    "Para investir na bolsa de valores",
                    "Não tem importância"
                ],
                answer: "Para cobrir gastos inesperados sem se endividar",
                explanation: "A reserva de emergência funciona como um colchão de segurança financeiro para imprevistos (perda de emprego, problemas de saúde, reparos urgentes), evitando que você precise se endividar ou comprometer seus investimentos."
            },
            {
                question: "O que significa 'custo de oportunidade'?",
                options: [
                    "O custo total de um produto",
                    "O valor que você deixa de ganhar ao escolher uma opção em vez de outra",
                    "Uma promoção especial",
                    "O custo de manutenção de um investimento"
                ],
                answer: "O valor que você deixa de ganhar ao escolher uma opção em vez de outra",
                explanation: "Custo de oportunidade é o benefício que se perde ao escolher uma alternativa em detrimento de outra. Por exemplo, o custo de oportunidade de gastar dinheiro hoje é não poder investi-lo para o futuro."
            },
            {
                question: "Qual ferramenta pode ajudar a controlar os gastos mensais?",
                options: [
                    "Redes sociais",
                    "Planilha de orçamento ou aplicativo de finanças",
                    "Caderno de receitas",
                    "Extrato bancário apenas"
                ],
                answer: "Planilha de orçamento ou aplicativo de finanças",
                explanation: "Planilhas e aplicativos de finanças são ferramentas eficazes para registrar receitas e despesas, categorizar gastos, visualizar para onde o dinheiro está indo e identificar oportunidades de economia."
            },
            {
                question: "Por que é importante definir metas financeiras?",
                options: [
                    "Para ter um direcionamento e motivação para poupar e investir",
                    "Apenas para ter algo para conversar com amigos",
                    "Para impressionar o gerente do banco",
                    "Não é importante"
                ],
                answer: "Para ter um direcionamento e motivação para poupar e investir",
                explanation: "Metas financeiras claras (comprar uma casa, aposentadoria, viagem) dão propósito ao ato de poupar e investir, ajudando a manter o foco e a disciplina no longo prazo."
            },
            {
                question: "O que são 'gastos fantasmas'?",
                options: [
                    "Contas de luz e água",
                    "Grandes compras planejadas",
                    "Pequenos gastos frequentes que passam despercebidos",
                    "Investimentos de alto risco"
                ],
                answer: "Pequenos gastos frequentes que passam despercebidos",
                explanation: "Gastos fantasmas são aquelas pequenas despesas do dia a dia (cafezinho, lanche, taxas pequenas) que, isoladamente, parecem insignificantes, mas somadas ao longo do mês podem consumir uma parte considerável do orçamento."
            },
            {
                question: "Qual a diferença entre salário bruto e salário líquido?",
                options: [
                    "Não há diferença",
                    "Bruto é o valor total, líquido é o valor após descontos (impostos, etc.)",
                    "Líquido é o valor total, bruto é o valor após descontos",
                    "Salário bruto é pago semanalmente, líquido mensalmente"
                ],
                answer: "Bruto é o valor total, líquido é o valor após descontos (impostos, etc.)",
                explanation: "Salário bruto é o valor total registrado em contrato, antes de qualquer desconto. Salário líquido é o valor que efetivamente cai na conta do trabalhador, após a dedução de impostos (IRRF, INSS) e outros descontos (vale-transporte, plano de saúde, etc.)."
            },
            {
                question: "O que fazer antes de realizar uma compra por impulso?",
                options: [
                    "Comprar imediatamente",
                    "Pesquisar preços em outras lojas",
                    "Refletir se a compra é realmente necessária e se cabe no orçamento",
                    "Pedir emprestado para comprar"
                ],
                answer: "Refletir se a compra é realmente necessária e se cabe no orçamento",
                explanation: "Compras por impulso podem desequilibrar o orçamento. Antes de comprar algo não planejado, questione a real necessidade, espere um tempo (24h, por exemplo) e verifique se o gasto cabe no seu planejamento financeiro."
            },
            {
                question: "Qual o primeiro passo para sair das dívidas?",
                options: [
                    "Ignorar as cobranças",
                    "Fazer novas dívidas para pagar as antigas",
                    "Organizar todas as dívidas e entender o valor total devido",
                    "Esperar a dívida prescrever"
                ],
                answer: "Organizar todas as dívidas e entender o valor total devido",
                explanation: "O primeiro passo para resolver o endividamento é ter clareza da situação. Liste todas as dívidas, credores, valores devidos, taxas de juros e prazos para poder traçar uma estratégia de quitação."
            }
        ]
    },
    "investimentos": {
        title: "Investimentos",
        iconClass: "fas fa-chart-line",
        questions: [
            {
                question: "O que é Renda Fixa?",
                options: [
                    "Investimento em ações de empresas",
                    "Modalidade onde a forma de cálculo do rendimento é definida no momento da aplicação",
                    "Investimento em imóveis",
                    "Compra e venda de moedas estrangeiras"
                ],
                answer: "Modalidade onde a forma de cálculo do rendimento é definida no momento da aplicação",
                explanation: "Na Renda Fixa, o investidor 'empresta' dinheiro para um emissor (governo, banco, empresa) e já sabe, no momento da aplicação, qual será a regra de remuneração (prefixada, pós-fixada ou híbrida). Exemplos: Tesouro Direto, CDB, LCI/LCA."
            },
            {
                question: "Qual o principal risco do investimento em ações (Renda Variável)?",
                options: [
                    "Não ter liquidez",
                    "Rendimento baixo garantido",
                    "Volatilidade do mercado e possibilidade de perda do capital",
                    "Taxas de administração elevadas"
                ],
                answer: "Volatilidade do mercado e possibilidade de perda do capital",
                explanation: "A Renda Variável, como ações, não possui garantia de rentabilidade. Os preços oscilam (volatilidade) conforme o mercado, podendo gerar lucros ou prejuízos, inclusive a perda do valor investido."
            },
            {
                question: "O que significa diversificação de investimentos?",
                options: [
                    "Investir todo o dinheiro em um único ativo",
                    "Distribuir o dinheiro em diferentes tipos de investimentos para reduzir riscos",
                    "Investir apenas em moeda estrangeira",
                    "Aplicar somente na poupança"
                ],
                answer: "Distribuir o dinheiro em diferentes tipos de investimentos para reduzir riscos",
                explanation: "Diversificar é a estratégia de não colocar 'todos os ovos na mesma cesta'. Ao distribuir seus recursos em diferentes classes de ativos (renda fixa, variável, multimercado, etc.), você dilui os riscos, pois eventuais perdas em um investimento podem ser compensadas por ganhos em outros."
            },
            {
                question: "O que é Tesouro Direto?",
                options: [
                    "Um fundo de investimento privado",
                    "Um programa do governo federal para venda de títulos públicos a pessoas físicas",
                    "Uma corretora de valores",
                    "Um tipo de ação"
                ],
                answer: "Um programa do governo federal para venda de títulos públicos a pessoas físicas",
                explanation: "Tesouro Direto é uma plataforma online onde o governo vende títulos de sua dívida diretamente para investidores. É considerado um dos investimentos mais seguros do país, pois é garantido pelo Tesouro Nacional."
            },
            {
                question: "Qual a função da taxa SELIC na economia?",
                options: [
                    "Definir o preço do dólar",
                    "Controlar a inflação e servir de referência para outras taxas de juros",
                    "Medir o crescimento do PIB",
                    "Regular o mercado de ações"
                ],
                answer: "Controlar a inflação e servir de referência para outras taxas de juros",
                explanation: "A SELIC é a taxa básica de juros da economia brasileira, definida pelo Banco Central. Ela influencia todas as outras taxas de juros (empréstimos, financiamentos, investimentos) e é usada como ferramenta para controlar a inflação."
            },
            {
                question: "O que são dividendos?",
                options: [
                    "Taxa cobrada pela corretora",
                    "Parte do lucro de uma empresa distribuída aos seus acionistas",
                    "Imposto sobre investimento",
                    "Rendimento da poupança"
                ],
                answer: "Parte do lucro de uma empresa distribuída aos seus acionistas",
                explanation: "Dividendos são uma parcela do lucro líquido de uma empresa que é paga aos seus acionistas como forma de remuneração pelo investimento feito nas ações da companhia."
            },
            {
                question: "O que é liquidez em um investimento?",
                options: [
                    "A rentabilidade do investimento",
                    "O risco de perder dinheiro",
                    "A facilidade e rapidez com que o investimento pode ser convertido em dinheiro",
                    "O prazo de vencimento do investimento"
                ],
                answer: "A facilidade e rapidez com que o investimento pode ser convertido em dinheiro",
                explanation: "Liquidez mede a velocidade com que você consegue resgatar um investimento e transformá-lo em dinheiro na sua conta, sem perda significativa de valor. Investimentos com alta liquidez podem ser resgatados rapidamente (ex: poupança, Tesouro Selic)."
            },
            {
                question: "Qual o papel de uma corretora de valores?",
                options: [
                    "Emprestar dinheiro",
                    "Gerenciar contas bancárias",
                    "Intermediar a compra e venda de ativos financeiros entre investidores e o mercado",
                    "Emitir títulos públicos"
                ],
                answer: "Intermediar a compra e venda de ativos financeiros entre investidores e o mercado",
                explanation: "Corretoras são instituições financeiras que conectam os investidores ao mercado, permitindo a compra e venda de ações, títulos públicos, fundos de investimento e outros ativos. Elas oferecem a plataforma e executam as ordens."
            },
            {
                question: "O que é o FGC (Fundo Garantidor de Créditos)?",
                options: [
                    "Um tipo de investimento",
                    "Uma entidade que garante certos tipos de depósitos e investimentos em caso de falência da instituição financeira",
                    "Um imposto sobre transações financeiras",
                    "Um índice da bolsa de valores"
                ],
                answer: "Uma entidade que garante certos tipos de depósitos e investimentos em caso de falência da instituição financeira",
                explanation: "O FGC é uma entidade privada, sem fins lucrativos, que protege o dinheiro de correntistas e investidores em caso de problemas com bancos ou financeiras. Ele garante a devolução de até R$ 250 mil por CPF e por instituição (com um teto global)."
            },
            {
                question: "Investir em CDB (Certificado de Depósito Bancário) é considerado Renda Fixa ou Variável?",
                options: [
                    "Renda Variável",
                    "Depende do banco",
                    "Renda Fixa",
                    "Nenhuma das opções"
                ],
                answer: "Renda Fixa",
                explanation: "CDB é um título de Renda Fixa emitido por bancos para captar recursos. Ao investir em CDB, você está emprestado dinheiro ao banco em troca de uma remuneração definida no momento da aplicação (prefixada, pós-fixada ou híbrida)."
            }
        ]
    },
    "dividas": {
        title: "Gestão de Dívidas",
        iconClass: "fas fa-credit-card",
        questions: [
            {
                question: "Qual o primeiro passo para organizar e quitar dívidas?",
                options: [
                    "Pegar mais empréstimos",
                    "Listar todas as dívidas, com valores, taxas de juros e prazos",
                    "Ignorar as cobranças",
                    "Mudar de número de telefone"
                ],
                answer: "Listar todas as dívidas, com valores, taxas de juros e prazos",
                explanation: "O diagnóstico é fundamental. Saber exatamente para quem você deve, quanto deve, quais as taxas de juros e os prazos de cada dívida permite criar um plano de ação eficaz para a quitação."
            },
            {
                question: "O que são juros compostos e por que são importantes no contexto de dívidas?",
                options: [
                    "Juros que incidem apenas sobre o valor principal",
                    "Juros que incidem sobre o valor principal mais os juros acumulados anteriormente",
                    "Juros cobrados apenas uma vez",
                    "Juros que diminuem com o tempo"
                ],
                answer: "Juros que incidem sobre o valor principal mais os juros acumulados anteriormente",
                explanation: "Os juros compostos são 'juros sobre juros'. Quando você não paga uma dívida, os juros são adicionados ao valor principal, e no próximo período, os juros incidem sobre esse novo montante. Isso faz com que dívidas cresçam exponencialmente se não forem pagas."
            },
            {
                question: "Qual estratégia é recomendada para quitar múltiplas dívidas?",
                options: [
                    "Pagar o mínimo em todas",
                    "Focar nas dívidas de maior valor primeiro",
                    "Priorizar as dívidas com maiores taxas de juros",
                    "Ignorar as dívidas menores"
                ],
                answer: "Priorizar as dívidas com maiores taxas de juros",
                explanation: "A estratégia da 'avalanche de dívidas' recomenda pagar o mínimo em todas as dívidas e direcionar o dinheiro extra para quitar primeiro as dívidas com maiores taxas de juros. Isso minimiza o valor total pago em juros ao longo do tempo."
            },
            {
                question: "O que é o CET (Custo Efetivo Total) em um empréstimo?",
                options: [
                    "Apenas a taxa de juros",
                    "O valor total a ser pago",
                    "A taxa que inclui juros, tarifas, impostos e todos os custos do empréstimo",
                    "O valor das parcelas mensais"
                ],
                answer: "A taxa que inclui juros, tarifas, impostos e todos os custos do empréstimo",
                explanation: "O CET representa o custo real de um empréstimo, incluindo não apenas os juros, mas também tarifas, seguros, impostos e outros encargos. É a melhor forma de comparar diferentes ofertas de crédito."
            },
            {
                question: "O que é a portabilidade de dívidas?",
                options: [
                    "Transferir uma dívida para outra pessoa",
                    "Transferir uma dívida de uma instituição financeira para outra, geralmente com melhores condições",
                    "Parcelar uma dívida",
                    "Perdão da dívida"
                ],
                answer: "Transferir uma dívida de uma instituição financeira para outra, geralmente com melhores condições",
                explanation: "A portabilidade permite transferir uma dívida para outra instituição que ofereça melhores condições (juros menores, prazos mais adequados). É um direito do consumidor e pode gerar economia significativa."
            },
            {
                question: "O que é o nome 'sujo' ou negativado?",
                options: [
                    "Ter muitas contas bancárias",
                    "Estar com o nome registrado em órgãos de proteção ao crédito por dívidas em atraso",
                    "Ter investimentos de alto risco",
                    "Não ter cartão de crédito"
                ],
                answer: "Estar com o nome registrado em órgãos de proteção ao crédito por dívidas em atraso",
                explanation: "Quando você atrasa o pagamento de uma dívida, o credor pode incluir seu nome em órgãos como SPC e Serasa. Isso dificulta a obtenção de crédito e pode resultar em juros mais altos em futuras negociações."
            },
            {
                question: "Qual a diferença entre renegociação e refinanciamento de dívidas?",
                options: [
                    "São a mesma coisa",
                    "Renegociação é alterar condições da dívida atual; Refinanciamento é contrair nova dívida para quitar a anterior",
                    "Renegociação é para pessoas físicas; Refinanciamento para empresas",
                    "Renegociação é mais cara que refinanciamento"
                ],
                answer: "Renegociação é alterar condições da dívida atual; Refinanciamento é contrair nova dívida para quitar a anterior",
                explanation: "Na renegociação, você negocia diretamente com o credor atual para alterar prazos, juros ou valores. No refinanciamento, você contrata um novo empréstimo (geralmente com condições melhores) para quitar a dívida anterior."
            },
            {
                question: "O que é o rotativo do cartão de crédito?",
                options: [
                    "Um tipo de investimento",
                    "O valor que você pode gastar no cartão",
                    "O financiamento automático quando você não paga a fatura integral",
                    "A anuidade do cartão"
                ],
                answer: "O financiamento automático quando você não paga a fatura integral",
                explanation: "O rotativo é uma modalidade de crédito que entra automaticamente quando você paga menos que o valor total da fatura. Tem juros muito altos e deve ser evitado. É melhor parcelar a fatura ou buscar outras formas de crédito."
            },
            {
                question: "Qual a importância de negociar dívidas em atraso?",
                options: [
                    "Não é importante, é melhor esperar",
                    "Permite obter descontos, melhores condições e evitar que a dívida cresça ainda mais",
                    "Só serve para empresas",
                    "É uma perda de tempo"
                ],
                answer: "Permite obter descontos, melhores condições e evitar que a dívida cresça ainda mais",
                explanation: "Credores frequentemente oferecem descontos significativos para quitar dívidas em atraso, pois preferem receber algo a nada. Negociar rapidamente evita que juros e multas façam a dívida crescer descontroladamente."
            },
            {
                question: "O que é prescrição de dívidas?",
                options: [
                    "Quando a dívida é perdoada automaticamente",
                    "O fim do prazo legal para que o credor cobre judicialmente uma dívida",
                    "Quando você muda de endereço",
                    "O parcelamento automático da dívida"
                ],
                answer: "O fim do prazo legal para que o credor cobre judicialmente uma dívida",
                explanation: "A prescrição é o prazo limite para que o credor entre com ação judicial para cobrar uma dívida. Após esse prazo (que varia conforme o tipo de dívida), o débito não pode mais ser cobrado judicialmente, embora ainda exista do ponto de vista moral."
            }
        ]
    },
    "planejamento": {
        title: "Planejamento Financeiro",
        iconClass: "fas fa-calendar-alt",
        questions: [
            {
                question: "O que é um planejamento financeiro?",
                options: [
                    "Apenas um orçamento mensal",
                    "Um processo contínuo de gerenciamento do dinheiro para atingir objetivos de vida",
                    "Uma planilha de gastos",
                    "Um investimento específico"
                ],
                answer: "Um processo contínuo de gerenciamento do dinheiro para atingir objetivos de vida",
                explanation: "O planejamento financeiro é mais amplo que um simples orçamento. É um processo estruturado que analisa sua situação atual, define objetivos de curto, médio e longo prazo, e estabelece estratégias para alcançá-los, considerando receitas, despesas, investimentos e proteção patrimonial."
            },
            {
                question: "Qual a importância de definir objetivos financeiros?",
                options: [
                    "Não é importante, o importante é economizar",
                    "Serve apenas para motivação psicológica",
                    "Dá direção ao seu dinheiro e ajuda a priorizar decisões financeiras",
                    "É importante apenas para pessoas ricas"
                ],
                answer: "Dá direção ao seu dinheiro e ajuda a priorizar decisões financeiras",
                explanation: "Objetivos claros (ex: comprar casa, aposentadoria, viagem) dão propósito às suas decisões financeiras, ajudam a priorizar onde alocar recursos limitados e servem como métrica para avaliar seu progresso financeiro."
            },
            {
                question: "O que é um objetivo financeiro SMART?",
                options: [
                    "Um objetivo muito difícil de alcançar",
                    "Um objetivo que é Específico, Mensurável, Atingível, Relevante e Temporal",
                    "Um objetivo relacionado apenas a investimentos",
                    "Um objetivo definido por um aplicativo"
                ],
                answer: "Um objetivo que é Específico, Mensurável, Atingível, Relevante e Temporal",
                explanation: "SMART é um acrônimo para objetivos bem definidos: Específico (claro e detalhado), Mensurável (quantificável), Atingível (realista), Relevante (importante para você) e Temporal (com prazo definido). Ex: 'Economizar R$ 10.000 para entrada de um apartamento em 2 anos'."
            },
            {
                question: "Por que é importante ter uma reserva de emergência?",
                options: [
                    "Para gastar em viagens",
                    "Para proteger seu planejamento financeiro de imprevistos",
                    "Apenas para pessoas com filhos",
                    "Para comprar ações na bolsa"
                ],
                answer: "Para proteger seu planejamento financeiro de imprevistos",
                explanation: "A reserva de emergência é um colchão financeiro que protege seus objetivos e investimentos de imprevistos (desemprego, doença, reparos urgentes). Sem ela, você pode ser forçado a se endividar ou resgatar investimentos em momentos desfavoráveis."
            },
            {
                question: "Qual o valor ideal para uma reserva de emergência?",
                options: [
                    "1 salário",
                    "3 a 6 meses de gastos essenciais",
                    "10% da renda mensal",
                    "R$ 1.000"
                ],
                answer: "3 a 6 meses de gastos essenciais",
                explanation: "O valor ideal varia conforme a estabilidade da renda e responsabilidades. Para funcionários CLT, 3-6 meses de gastos essenciais é adequado. Para autônomos ou pessoas com renda variável, pode ser necessário mais (6-12 meses)."
            },
            {
                question: "O que é aposentadoria complementar?",
                options: [
                    "Um benefício do governo",
                    "Um investimento privado para complementar a aposentadoria do INSS",
                    "Um tipo de seguro de vida",
                    "Uma conta poupança especial"
                ],
                answer: "Um investimento privado para complementar a aposentadoria do INSS",
                explanation: "A previdência complementar (PGBL, VGBL, fundos de pensão) é um investimento privado que visa complementar a aposentadoria oficial do INSS, que geralmente não é suficiente para manter o padrão de vida na aposentadoria."
            },
            {
                question: "Qual a diferença entre objetivos de curto, médio e longo prazo?",
                options: [
                    "Não há diferença prática",
                    "Curto prazo: até 1 ano; Médio prazo: 1-5 anos; Longo prazo: mais de 5 anos",
                    "Curto prazo: até 6 meses; Médio prazo: 6 meses-2 anos; Longo prazo: mais de 2 anos",
                    "Depende da idade da pessoa"
                ],
                answer: "Curto prazo: até 1 ano; Médio prazo: 1-5 anos; Longo prazo: mais de 5 anos",
                explanation: "A classificação temporal dos objetivos influencia a estratégia de investimento. Objetivos de curto prazo requerem investimentos mais conservadores e líquidos, enquanto objetivos de longo prazo permitem maior exposição a risco em busca de maior rentabilidade."
            },
            {
                question: "O que é educação financeira dos filhos?",
                options: [
                    "Ensinar apenas a poupar dinheiro",
                    "Transmitir conhecimentos e hábitos saudáveis sobre dinheiro desde cedo",
                    "Dar mesada sem orientação",
                    "Deixar que aprendam sozinhos quando adultos"
                ],
                answer: "Transmitir conhecimentos e hábitos saudáveis sobre dinheiro desde cedo",
                explanation: "A educação financeira infantil envolve ensinar conceitos como valor do dinheiro, diferença entre necessidade e desejo, importância de poupar, e como tomar decisões financeiras conscientes. Isso forma adultos mais responsáveis financeiramente."
            },
            {
                question: "Qual o fator mais importante para o sucesso no longo prazo?",
                options: [
                    "Consistência e disciplina ao longo do tempo",
                    "Tentar prever o mercado",
                    "Fazer investimentos arriscados para ganhos rápidos",
                    "Seguir dicas de influenciadores"
                ],
                answer: "Consistência e disciplina ao longo do tempo",
                explanation: "No longo prazo, a consistência (investir regularmente) e a disciplina (manter o plano mesmo em momentos de volatilidade) são mais importantes que tentar acertar o 'timing' do mercado ou fazer apostas arriscadas. O poder dos juros compostos se manifesta com o tempo."
            },
            {
                question: "Qual a diferença entre planejamento financeiro e investimentos?",
                options: [
                    "São a mesma coisa",
                    "Planejamento financeiro é mais amplo e inclui investimentos como uma de suas partes",
                    "Investimentos são para ricos, planejamento é para classe média",
                    "Planejamento é teórico, investimento é prático"
                ],
                answer: "Planejamento financeiro é mais amplo e inclui investimentos como uma de suas partes",
                explanation: "O planejamento financeiro é o processo completo que inclui orçamento, gestão de dívidas, seguros, impostos, aposentadoria e sucessão. Investimentos são apenas uma parte desse processo, focada em fazer o dinheiro crescer para atingir os objetivos definidos no planejamento."
            }
        ]
    },
    "economia": {
        title: "Economia Básica",
        iconClass: "fas fa-university",
        questions: [
            {
                question: "O que é inflação?",
                options: [
                    "Aumento do PIB",
                    "Aumento generalizado e contínuo dos preços",
                    "Aumento do valor da moeda",
                    "Aumento das exportações"
                ],
                answer: "Aumento generalizado e contínuo dos preços",
                explanation: "Inflação é o processo de aumento contínuo e generalizado dos preços de bens e serviços, resultando na perda do poder de compra da moeda. Por exemplo, com 10% de inflação anual, R$100 hoje comprarão o equivalente a R$90 daqui a um ano."
            },
            {
                question: "O que é o PIB (Produto Interno Bruto)?",
                options: [
                    "O total de impostos arrecadados pelo governo",
                    "A soma de todos os bens e serviços produzidos em um país em determinado período",
                    "O valor das ações na bolsa de valores",
                    "O total de dinheiro em circulação"
                ],
                answer: "A soma de todos os bens e serviços produzidos em um país em determinado período",
                explanation: "O PIB é o principal indicador da atividade econômica de um país, representando o valor total de todos os bens e serviços finais produzidos dentro de suas fronteiras em um período específico (geralmente um ano)."
            },
            {
                question: "O que é taxa de desemprego?",
                options: [
                    "O número total de desempregados",
                    "A porcentagem de pessoas em idade ativa que estão procurando emprego mas não encontram",
                    "O número de vagas de emprego disponíveis",
                    "A quantidade de pessoas aposentadas"
                ],
                answer: "A porcentagem de pessoas em idade ativa que estão procurando emprego mas não encontram",
                explanation: "A taxa de desemprego mede o percentual da população economicamente ativa (pessoas em idade de trabalhar) que está desempregada, mas procurando ativamente por trabalho. É um importante indicador da saúde econômica."
            },
            {
                question: "O que é câmbio?",
                options: [
                    "A taxa de juros do país",
                    "O preço de uma moeda em relação a outra",
                    "O valor das ações na bolsa",
                    "A inflação mensal"
                ],
                answer: "O preço de uma moeda em relação a outra",
                explanation: "Câmbio é a taxa de conversão entre duas moedas. Por exemplo, quando dizemos que o dólar está R$ 5,00, significa que é preciso 5 reais para comprar 1 dólar americano. As variações cambiais afetam importações, exportações e investimentos."
            },
            {
                question: "O que caracteriza uma recessão econômica?",
                options: [
                    "Aumento do PIB por dois trimestres consecutivos",
                    "Queda do PIB por dois trimestres consecutivos",
                    "Aumento da inflação",
                    "Redução da taxa de juros"
                ],
                answer: "Queda do PIB por dois trimestres consecutivos",
                explanation: "Tecnicamente, muitos países consideram recessão quando o PIB cai por dois trimestres consecutivos. É um período marcado por diminuição da produção, aumento do desemprego e queda na renda e no consumo."
            },
            {
                question: "Qual o papel do Banco Central em um país?",
                options: [
                    "Criar leis trabalhistas",
                    "Controlar a emissão de moeda, regular bancos e executar a política monetária",
                    "Definir o salário mínimo",
                    "Construir estradas"
                ],
                answer: "Controlar a emissão de moeda, regular bancos e executar a política monetária",
                explanation: "O Banco Central (no Brasil, o BCB) é a autoridade monetária responsável por garantir a estabilidade do poder de compra da moeda, zelar pela solidez do sistema financeiro e executar a política monetária (definir a Selic, etc.)."
            },
            {
                question: "O que significa 'superávit' e 'déficit' nas contas do governo?",
                options: [
                    "Superávit é gastar mais que arrecadar; Déficit é arrecadar mais que gastar",
                    "Superávit é arrecadar mais que gastar; Déficit é gastar mais que arrecadar",
                    "Ambos significam equilíbrio nas contas",
                    "Referem-se apenas à dívida externa"
                ],
                answer: "Superávit é arrecadar mais que gastar; Déficit é gastar mais que arrecadar",
                explanation: "Quando o governo arrecada mais impostos do que gasta em um período, há superávit primário. Quando gasta mais do que arrecada, há déficit primário, o que geralmente leva ao aumento da dívida pública."
            },
            {
                question: "O que é globalização econômica?",
                options: [
                    "Isolamento econômico de um país",
                    "A crescente interconexão e interdependência das economias mundiais",
                    "Apenas o comércio entre países vizinhos",
                    "O controle da economia por uma única empresa"
                ],
                answer: "A crescente interconexão e interdependência das economias mundiais",
                explanation: "A globalização envolve o aumento do fluxo de bens, serviços, capital, tecnologia e informações entre países, levando a uma maior integração dos mercados e das cadeias produtivas em escala mundial."
            },
            {
                question: "O que é balança comercial?",
                options: [
                    "O saldo entre exportações e importações de um país",
                    "O valor total das empresas na bolsa",
                    "A diferença entre receitas e gastos do governo",
                    "O total de investimentos estrangeiros"
                ],
                answer: "O saldo entre exportações e importações de um país",
                explanation: "A balança comercial é a diferença entre o valor das exportações (vendas para outros países) e importações (compras de outros países). Quando as exportações superam as importações, há superávit; caso contrário, há déficit."
            },
            {
                question: "O que são commodities?",
                options: [
                    "Produtos manufaturados de alta tecnologia",
                    "Matérias-primas ou produtos primários de origem agropecuária ou mineral",
                    "Serviços financeiros",
                    "Produtos exclusivos de luxo"
                ],
                answer: "Matérias-primas ou produtos primários de origem agropecuária ou mineral",
                explanation: "Commodities são produtos básicos, geralmente matérias-primas, que podem ser estocados sem perda de qualidade (soja, milho, petróleo, ouro, etc.). Seus preços são determinados pela oferta e demanda global e influenciam muito a economia brasileira."
            }
        ]
    }
};

// --- Global Variables --- //
let currentCategory = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let quizStartTime = null;
let userAnswers = []; // Array para armazenar as respostas do usuário

// --- DOM Elements (AGORA SÃO 'LET' PARA PERMITIR REATRIBUIÇÃO) --- //
let categoriesArea = document.getElementById('quiz-selection-area'); // Ajustado ID
let quizArea = document.getElementById('quiz-area');
let resultsArea = document.getElementById('quiz-results');
let categoryTitle = document.getElementById('quiz-category-title-header');
let categoryIcon = document.getElementById('category-icon');
let questionElement = document.getElementById('question-text');
let optionsElement = document.getElementById('options-container');
let feedbackElement = document.getElementById('feedback');
let explanationBox = document.getElementById('explanation-box');
let explanationText = document.getElementById('explanation-content');
let nextButton = document.getElementById('next-question-btn');
let scoreElement = document.getElementById('score-text');
let percentageElement = document.getElementById('percentage');
let restartQuizBtn = document.getElementById('restart-quiz-btn');
let backToCategoriesBtnResults = document.getElementById('back-to-categories-btn-results');
let backToCategoriesBtnHeader = document.getElementById('back-to-categories-btn-header');
let questionCounter = document.getElementById('question-counter');
let progressBar = document.querySelector('.progress-bar');

// --- Populate Categories --- //
function populateCategories() {
    categoriesArea.style.display = 'block';
    quizArea.style.display = 'none';
    resultsArea.style.display = 'none';

    const categoriesContainer = document.getElementById('quiz-categories-grid');
    categoriesContainer.innerHTML = '';

    for (const [key, category] of Object.entries(quizData)) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'quiz-category-card';
        categoryCard.setAttribute('data-category', key);
        categoryCard.innerHTML = `
            <div class="icon">
                <i class="${category.iconClass || 'fas fa-question'}"></i>
            </div>
            <h3>${category.title}</h3>
            <p>${category.questions.length} perguntas</p>
            <button class="btn btn-start-quiz">Iniciar Quiz</button>
        `;
        categoryCard.querySelector('.btn-start-quiz').addEventListener('click', () => startQuiz(key));
        categoriesContainer.appendChild(categoryCard);
    }
}

// --- Start Quiz --- //
async function startQuiz(categoryKey) {
    currentCategory = categoryKey;
    currentQuestionIndex = 0;
    score = 0;
    
    // Verificar se deve usar perguntas estáticas ou gerar dinamicamente
    const useGeminiAPI = document.getElementById('use-gemini-api')?.checked || false;
    
    if (useGeminiAPI) {
        // Gerar perguntas usando a API do Gemini
        try {
            const loadingMessage = document.createElement('div');
            loadingMessage.innerHTML = '<p>Gerando perguntas personalizadas...</p>';
            loadingMessage.style.textAlign = 'center';
            loadingMessage.style.padding = '20px';
            
            categoriesArea.style.display = 'none';
            quizArea.style.display = 'block';
            quizArea.innerHTML = ''; // Limpa o conteúdo existente
            quizArea.appendChild(loadingMessage);
            
            // Obter perguntas anteriores do usuário para evitar repetições
            const previousQuestions = await getPreviousQuestions(categoryKey);
            
            const response = await fetch('https://finans-backend-5l2w.onrender.com/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: quizData[categoryKey].title,
                    previousQuestionsTexts: previousQuestions
                } )
            });
            
            if (!response.ok) {
                throw new Error('Erro ao gerar quiz');
            }
            
            const generatedQuestions = await response.json();

            // --- CORREÇÃO: NORMALIZAÇÃO DA RESPOSTA DA API DO GEMINI ---
            // Se a resposta da API vier como 'A', 'B', 'C', 'D', converta para o texto completo da opção
            generatedQuestions.forEach(q => {
                if (q.answer && typeof q.answer === 'string' && q.answer.length === 1 && q.answer.match(/[A-D]/i)) {
                    const answerIndex = q.answer.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
                    if (answerIndex >= 0 && answerIndex < q.options.length) {
                        q.answer = q.options[answerIndex];
                    } else {
                        console.warn(`Resposta inválida para a pergunta: ${q.question}. Resposta: ${q.answer}`);
                        // Fallback para evitar erro, pode ser ajustado conforme a necessidade
                        q.answer = q.options[0]; // Ou alguma outra lógica de tratamento de erro
                    }
                }
            });
            // --- FIM DA CORREÇÃO ---

            questions = generatedQuestions;
            
            // Restaurar a interface do quiz com o novo HTML
            quizArea.innerHTML = `
                <div class="quiz-question-header">
                    <button id="back-to-categories-btn-header" class="btn btn-link">&lt; Voltar às categorias</button>
                    <div class="category-info">
                        <span id="category-icon" class="icon"></span>
                        <h2 id="quiz-category-title-header">${quizData[categoryKey].title}</h2>
                    </div>
                    <span id="question-counter" class="counter">1/${questions.length}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div id="question-container">
                    <p id="question-text"></p>
                    <div id="options-container">
                        <!-- Options buttons generated by JS -->
                    </div>
                    <p id="feedback"></p>
                    <div id="explanation-box" class="explanation-box" style="display: none;">
                        <div class="explanation-header">
                            <i class="fas fa-info-circle explanation-icon"></i>
                            <span class="explanation-title">Explicação:</span>
                        </div>
                        <p id="explanation-content" class="explanation-content"></p>
                    </div>
                </div>
                <button id="next-question-btn" class="btn btn-primary btn-full-width" style="display: none;">Próxima Pergunta</button>
            `;
            
            // Reconfigurar elementos DOM (AGORA CHAMANDO A FUNÇÃO APÓS A ATUALIZAÇÃO DO INNERHTML)
            setupDOMElements();
            
        } catch (error) {
            console.error('Erro ao gerar quiz:', error);
            alert('Erro ao gerar quiz personalizado. Usando perguntas padrão.');
            questions = [...quizData[categoryKey].questions];
            // Restaurar o HTML padrão do quiz se a API falhar
            quizArea.innerHTML = `
                <div class="quiz-question-header">
                    <button id="back-to-categories-btn-header" class="btn btn-link">&lt; Voltar às categorias</button>
                    <div class="category-info">
                        <span id="category-icon" class="icon"></span>
                        <h2 id="quiz-category-title-header">${quizData[categoryKey].title}</h2>
                    </div>
                    <span id="question-counter" class="counter">1/${questions.length}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div id="question-container">
                    <p id="question-text"></p>
                    <div id="options-container">
                        <!-- Options buttons generated by JS -->
                    </div>
                    <p id="feedback"></p>
                    <div id="explanation-box" class="explanation-box" style="display: none;">
                        <div class="explanation-header">
                            <i class="fas fa-info-circle explanation-icon"></i>
                            <span class="explanation-title">Explicação:</span>
                        </div>
                        <p id="explanation-content" class="explanation-content"></p>
                    </div>
                </div>
                <button id="next-question-btn" class="btn btn-primary btn-full-width" style="display: none;">Próxima Pergunta</button>
            `;
            setupDOMElements(); // Chame novamente para obter as novas referências
        }
    } else {
        // Usar perguntas estáticas
        questions = [...quizData[categoryKey].questions];
        // Garanta que o HTML do quiz esteja presente se não estiver usando a API
        // Se o quizArea foi limpo antes, ele precisa ser restaurado aqui.
        // Se o quizArea já está no estado inicial (não limpo), então está ok.
        // Para a primeira vez que o quiz é iniciado sem API, o HTML já deve estar lá.
        // Se você está voltando de um quiz gerado pela API para um estático,
        // você precisaria restaurar o HTML do quizArea.
        // Por simplicidade, vamos chamar setupDOMElements de qualquer forma.
    }
    
    userAnswers = []; // Resetar respostas do usuário
    quizStartTime = new Date(); // Marcar o início do quiz

    categoriesArea.style.display = 'none';
    quizArea.style.display = 'block';
    resultsArea.style.display = 'none';
    quizArea.dataset.currentCategory = categoryKey; // Set data attribute for styling

    // Certifique-se de que setupDOMElements é chamado para garantir que todas as variáveis globais
    // apontem para os elementos corretos, independentemente de como o quizArea foi populado.
    setupDOMElements(); // CHAME AQUI TAMBÉM!

    categoryTitle.textContent = quizData[currentCategory].title;
    categoryIcon.innerHTML = `<i class="${quizData[currentCategory].iconClass || 'fas fa-question'}"></i>`; // Atualiza o ícone
    loadQuestion();
}

// --- Função para reconfigurar elementos DOM após gerar conteúdo dinamicamente --- //
function setupDOMElements() {
    // REATRIBUIR AS VARIÁVEIS GLOBAIS COM OS NOVOS ELEMENTOS DO DOM
    categoriesArea = document.getElementById('quiz-selection-area');
    quizArea = document.getElementById('quiz-area');
    resultsArea = document.getElementById('quiz-results');
    categoryTitle = document.getElementById('quiz-category-title-header');
    categoryIcon = document.getElementById('category-icon');
    questionElement = document.getElementById('question-text');
    optionsElement = document.getElementById('options-container');
    feedbackElement = document.getElementById('feedback');
    explanationBox = document.getElementById('explanation-box');
    explanationText = document.getElementById('explanation-content');
    nextButton = document.getElementById('next-question-btn');
    scoreElement = document.getElementById('score-text');
    percentageElement = document.getElementById('percentage');
    restartQuizBtn = document.getElementById('restart-quiz-btn');
    backToCategoriesBtnResults = document.getElementById('back-to-categories-btn-results');
    backToCategoriesBtnHeader = document.getElementById('back-to-categories-btn-header');
    questionCounter = document.getElementById('question-counter');
    progressBar = document.querySelector('.progress-bar'); // QuerySelector para classes

    // Reconfigurar event listeners
    if (nextButton) {
        // Remova o listener antigo antes de adicionar um novo para evitar múltiplos listeners
        nextButton.removeEventListener('click', nextQuestion);
        nextButton.addEventListener('click', nextQuestion);
    }
    
    if (backToCategoriesBtnHeader) {
        backToCategoriesBtnHeader.removeEventListener('click', populateCategories);
        backToCategoriesBtnHeader.addEventListener('click', populateCategories);
    }
    
    // Atualizar ícone da categoria (se já não foi feito em startQuiz)
    if (categoryIcon && currentCategory) { // Adicionado currentCategory para evitar erro se não houver categoria selecionada
        categoryIcon.innerHTML = `<i class="${quizData[currentCategory].iconClass || 'fas fa-question'}"></i>`;
    }
}

// --- Função para obter perguntas anteriores do usuário --- //
async function getPreviousQuestions(category) {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
        try {
            const userId = firebase.auth().currentUser.uid;
            const db = firebase.firestore();
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                const quizHistory = userData.quizHistory || [];
                
                // Filtrar perguntas da categoria específica dos últimos 5 quizzes
                const categoryHistory = quizHistory
                    .filter(quiz => quiz.quizId === category)
                    .slice(-5); // Últimos 5 quizzes
                
                const previousQuestions = [];
                categoryHistory.forEach(quiz => {
                    if (quiz.answers) {
                        quiz.answers.forEach(answer => {
                            previousQuestions.push(answer.question);
                        });
                    }
                });
                
                return previousQuestions;
            }
        } catch (error) {
            console.error('Erro ao obter perguntas anteriores:', error);
        }
    }
    
    return [];
}

// --- Load Question --- //
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    questionCounter.textContent = `${currentQuestionIndex + 1}/${questions.length}`; // Atualiza contador
    updateProgressBar(); // Atualiza barra de progresso

    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';
    explanationBox.style.display = 'none';
    nextButton.style.display = 'none';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-btn';
        button.addEventListener('click', () => selectOption(button, option, question.answer, question.explanation));
        optionsElement.appendChild(button);
    });

    updateScoreDisplay();
}

// --- Select Option --- //
function selectOption(selectedOption, selectedAnswer, correctAnswer, explanation) {
    const options = document.querySelectorAll('.option-btn');
    const isCorrect = selectedAnswer === correctAnswer;

    // Armazenar a resposta do usuário
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        question: questions[currentQuestionIndex].question,
        selectedAnswer: selectedAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    });

    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        } else if (option === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        score++;
        feedbackElement.textContent = 'Correto!';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `Incorreto. A resposta correta é: ${correctAnswer}`;
        feedbackElement.className = 'feedback incorrect';
    }

    // Show explanation
    explanationText.textContent = explanation;
    explanationBox.style.display = 'block';
    nextButton.style.display = 'block';

    updateScoreDisplay();
}

// --- Next Question --- //
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// --- Show Results --- //
function showResults() {
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';

    const percentage = Math.round((score / questions.length) * 100);
    scoreElement.textContent = `Você acertou ${score} de ${questions.length} perguntas (${percentage}%)`;

    // Determinar mensagem baseada na performance
    const resultMessage = document.getElementById('result-message');
    if (resultMessage) {
        if (percentage >= 80) {
            resultMessage.textContent = 'Excelente! Você tem um ótimo conhecimento sobre o assunto.';
            resultMessage.className = 'result-message excellent';
        } else if (percentage >= 60) {
            resultMessage.textContent = 'Bom trabalho! Continue estudando para melhorar ainda mais.';
            resultMessage.className = 'result-message good';
        } else {
            resultMessage.textContent = 'Continue estudando! A prática leva à perfeição.';
            resultMessage.className = 'result-message needs-improvement';
        }
    }

    // Calcular tempo gasto
    const quizEndTime = new Date();
    const timeSpentSeconds = Math.round((quizEndTime - quizStartTime) / 1000);

    // Salvar histórico completo do quiz
    saveQuizHistoryToFirebase(currentCategory, score, questions.length, timeSpentSeconds, userAnswers);
}

// --- Restart and Back Buttons --- //
// É importante que esses event listeners sejam adicionados APENAS UMA VEZ
// ou que sejam removidos e adicionados novamente se os botões forem recriados.
// Como restartQuizBtn e backToCategoriesBtnResults não são recriados dinamicamente
// (eles estão na resultsArea que não é limpa e recriada), eles podem ter listeners fixos.
// O backToCategoriesBtnHeader é recriado, então seu listener é tratado em setupDOMElements.
restartQuizBtn.addEventListener('click', () => startQuiz(currentCategory));
backToCategoriesBtnResults.addEventListener('click', populateCategories);
// backToCategoriesBtnHeader.addEventListener('click', populateCategories); // Este é tratado em setupDOMElements

// --- Firebase Integration - HISTÓRICO COMPLETO DO QUIZ --- //
async function saveQuizHistoryToFirebase(category, userScore, totalQuestions, timeSpent, answers) {
    console.log(`[QUIZ] Attempting to save quiz history. User logged in: ${!!(typeof firebase !== 'undefined' && firebase.auth().currentUser)}`);

    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
        const userId = firebase.auth().currentUser.uid;
        const db = firebase.firestore();
        // Use new Date() para o timestamp dentro do array
        const completedAtTimestamp = new Date();
        const percentage = Math.round((userScore / totalQuestions) * 100);

        console.log(`[QUIZ] Saving quiz history for userId: ${userId}, Category: ${category}, Score: ${userScore}/${totalQuestions}, Time: ${timeSpent}s`);

        try {
            // 1. Salvar histórico completo do quiz no documento do usuário
            const userRef = db.collection('users').doc(userId);

            // Primeiro, verificar se o documento do usuário existe
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                // Criar documento do usuário se não existir
                const user = firebase.auth().currentUser;
                await userRef.set({
                    name: user.displayName || 'Usuário',
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Aqui pode usar serverTimestamp
                    quizHistory: []
                });
                console.log("[QUIZ] User document created.");
            }

            // Criar objeto do histórico do quiz
            const quizHistoryEntry = {
                quizId: category,
                quizTitle: quizData[category].title,
                score: userScore,
                totalQuestions: totalQuestions,
                percentage: percentage,
                timeSpent: timeSpent,
                completedAt: completedAtTimestamp, // Usar new Date() aqui
                answers: answers
            };

            // Adicionar ao histórico usando arrayUnion
            await userRef.update({
                quizHistory: firebase.firestore.FieldValue.arrayUnion(quizHistoryEntry)
            });

            console.log("[QUIZ] Quiz history saved successfully.");

            // 2. Atualizar estatísticas do quiz (documento separado para estatísticas)
            const quizStatsRef = db.collection('quizStats').doc(userId);
            
            // Usar transação para atualizar estatísticas
            await db.runTransaction(async (transaction) => {
                const statsDoc = await transaction.get(quizStatsRef);
                if (!statsDoc.exists) {
                    transaction.set(quizStatsRef, {
                        totalScore: userScore,
                        bestScore: userScore,
                        completed: 1,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp() // Aqui pode usar serverTimestamp
                    });
                } else {
                    const currentStats = statsDoc.data();
                    const newTotalScore = (currentStats.totalScore || 0) + userScore;
                    const newBestScore = Math.max((currentStats.bestScore || 0), userScore);
                    const newCompleted = (currentStats.completed || 0) + 1;
                    transaction.update(quizStatsRef, {
                        totalScore: newTotalScore,
                        bestScore: newBestScore,
                        completed: newCompleted,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp() // Aqui pode usar serverTimestamp
                    });
                }
            });

            console.log("[QUIZ] Quiz stats updated successfully.");

        } catch (error) {
            console.error("[QUIZ] Error saving quiz history: ", error);
            alert("Erro ao salvar o histórico do quiz. Verifique sua conexão e tente novamente.");
        }

    } else {
        console.log("[QUIZ] Firebase not configured or user not logged in. Quiz history not saved.");
    }
}

// --- Progress Bar Update --- //
function updateProgressBar() {
    // Certifique-se de que progressBar não é null antes de tentar acessar style
    if (progressBar) {
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// --- Initial Load --- //
populateCategories();

function updateScoreDisplay() {
    // console.log(`Score atual: ${score}`);
}