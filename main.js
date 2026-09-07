const API_URL = 'https://lembrete-gabriela.samuelvivi1996.workers.dev';
 
const MENSAGENS = [
  // Produtividade e Sucesso
  '🌅 Ótimo dia para ser produtivo!',
  '💪 Você consegue conquistar tudo hoje!',
  '✨ Que seu dia seja tão brilhante quanto você!',
  '🎯 Vamos alcançar nossos objetivos!',
  '☀️ Um novo dia, novas oportunidades!',
  '🚀 Hoje é o dia para fazer acontecer!',
  '⭐ Você é capaz de coisas incríveis!',
  '💎 Cada dia é uma chance de brilhar!',
  '🔥 Bora colocar as mãos na massa!',
  '🌟 Seu potencial é infinito!',
  '🎪 Hoje vamos fazer história!',
  '💫 Acredite em seu trabalho!',
  '🏆 Você é um vencedor!',
  '🌈 Cada desafio é uma oportunidade!',
  '⚡ Sua energia é contagiante!',
  '🎨 Crie sua própria história de sucesso!',
  '🌸 Hoje é perfeito para começar!',
  '🎭 Seja o protagonista da sua vida!',
  '💝 Você merece tudo de bom!',
  '🌺 Floresça no seu próprio tempo!',
 
  // Força e Coragem
  '💪 Você é mais forte do que pensa!',
  '🦁 Tenha coragem de ser você mesmo!',
  '⚔️ Enfrente seus medos com confiança!',
  '🛡️ Você consegue superar qualquer obstáculo!',
  '🏔️ Escale montanhas! Você consegue!',
  '🌊 Surfe nas ondas da vida com segurança!',
  '🔐 Sua força vem de dentro!',
  '💥 Exploda em potencial!',
  '🎯 Mire alto e acerte!',
  '🚂 Siga em frente, sempre em frente!',
  '🌳 Tenha raízes fortes e crescimento livre!',
  '⚙️ Engrenagens da vitória em movimento!',
  '🎪 Circo da vida: você é o melhor ator!',
  '🏅 Você é merecedor de ouro!',
  '🚁 Suba mais alto que suas limitações!',
 
  // Motivação Pessoal
  '🌟 Você é incrível do jeito que é!',
  '✨ Sua essência brilha naturalmente!',
  '💖 Ame-se primeiro, sempre!',
  '🎁 Você é um presente para o mundo!',
  '👑 Você é realeza!',
  '🦋 Transforme-se em algo melhor!',
  '🌻 Seja a luz do seu próprio caminho!',
  '🎸 Toque a música do seu coração!',
  '🌙 Mesmo nas noites escuras, brilhe!',
  '☄️ Seja uma estrela cadente de sucesso!',
  '🎨 Pinte seu destino com cores vibrantes!',
  '🌴 Relaxe, mas não desista dos sonhos!',
  '🎭 Você é uma obra de arte!',
  '🏖️ Encontre paz na sua jornada!',
  '🎪 Divirta-se enquanto conquista!',
  '🌺 Você é uma flor única!',
  '🦚 Exiba sua beleza interior!',
  '💎 Você é precioso!',
  '🌊 Flua com a vida!',
  '🔮 Seu futuro é brilhante!',
 
  // Crescimento e Aprendizado
  '📚 Cada dia é uma oportunidade de aprender!',
  '🧠 Seu cérebro é poderoso!',
  '🌱 Cresça todos os dias!',
  '🌿 Da semente vem a floresta!',
  '🎓 Você é seu melhor professor!',
  '📖 Escreva sua própria história!',
  '🔬 Experimente coisas novas!',
  '🧩 As peças se encaixarão!',
  '🎯 Foco e crescimento andam juntos!',
  '🌳 Sua raiz será profunda!',
  '💡 Ideias brilhantes nascimento dentro de você!',
  '🔓 Abra as portas do conhecimento!',
  '🌐 O mundo é seu sala de aula!',
  '📝 Anote seus progressos!',
  '🚪 Cada porta leva a novas possibilidades!',
  '🎢 A jornada do crescimento é emocionante!',
  '🧗 Escalade seu potencial!',
  '🎯 Mirar na excelência!',
  '🏃 Corra atrás de seu conhecimento!',
  '🎪 Circo da aprendizagem nunca fecha!',
 
  // Positividade e Esperança
  '🌞 A positividade atrai sucesso!',
  '🎉 Celebre cada pequena vitória!',
  '🎊 Você merece festejar!',
  '😊 Sorria, o melhor está por vir!',
  '🌅 O amanhã é promissor!',
  '🌈 Após a chuva, vem o arco-íris!',
  '☀️ Você é tão brilhante quanto o sol!',
  '🌟 Sua luz não pode ser apagada!',
  '💫 Estrelas também têm sombras, mas brilham!',
  '🎆 Seja fogos de artifício de alegria!',
  '🎇 Ilumine a escuridão!',
  '🕯️ Uma vela é melhor que amaldiçoar a escuridão!',
  '🔦 Seja a luz no caminho de alguém!',
  '💥 Sua presença é explosiva e positiva!',
  '🌺 Espalhe alegria!',
  '🦋 Transformação é linda!',
  '🌸 Floresça sempre!',
  '🌻 Gire em direção à luz!',
  '🌷 Delicadeza com força!',
  '🌼 Beleza natural em você!',
 
  // Foco e Determinação
  '🎯 Foco é o segredo do sucesso!',
  '🔍 Veja claramente seus objetivos!',
  '🧭 Sua bússola interna aponta para o sucesso!',
  '📍 Saiba exatamente onde quer chegar!',
  '🛣️ Siga a estrada do seu propósito!',
  '🚀 Decolagem para o sucesso agora!',
  '💨 Velocidade e determinação juntas!',
  '⚡ Energia máxima ativada!',
  '🔥 Fogo da determinação aceso!',
  '💪 Músculos da vontade contraídos!',
  '🏃 Corra em sua própria velocidade!',
  '🚴 Pedale em direção aos seus sonhos!',
  '🏊 Nade contra a corrente se necessário!',
  '🧗 Suba, mesmo que lentamente!',
  '⛰️ Montanhas foram feitas para serem escaladas!',
  '🛤️ Siga o caminho com confiança!',
  '🗺️ Você tem um mapa mental claro!',
  '🧲 Atração para o sucesso!',
  '🎪 Circo do sucesso começa aqui!',
  '🎭 O palco do sucesso é seu!',
 
  // Autoestima e Confiança
  '👑 Você é digno de respeito!',
  '💎 Você é uma joia rara!',
  '🦁 Tenha a confiança de um leão!',
  '🌟 Você brilla naturalmente!',
  '✨ Sua confiança é seu superpower!',
  '🔐 Segurança em si mesmo é fundamental!',
  '🛡️ Proteja sua autoestima!',
  '🏰 Construa seu castelo de confiança!',
  '👸 Você é royalty!',
  '🤴 Seu valor é inquestionável!',
  '💪 Você é forte mentalmente!',
  '🧠 Sua mente é seu maior ativo!',
  '❤️ Ame-se incondicionalmente!',
  '💕 Você merece amor próprio!',
  '💖 Seu coração é valioso!',
  '💝 Você é um presente para si mesmo!',
  '🌹 Sua beleza é interior!',
  '🦚 Peacock não precisa de validação!',
  '🎨 Você é uma obra-prima!',
  '🖼️ Seu retrato é especial!',
 
  // Gratidão e Apreciação
  '🙏 Agradeça pelos pequenos momentos!',
  '🍂 Cada folha caída tem sua beleza!',
  '🌾 A colheita é resultado do trabalho!',
  '🎁 Cada dia é um presente!',
  '🎀 Desembrulhe as surpresas da vida!',
  '❤️ Gratidão abre corações!',
  '🌻 Apreciar é viver plenamente!',
  '🌺 Cada flor tem sua hora!',
  '🦋 Aprecie as transformações!',
  '🌈 Cores da vida precisam ser apreciadas!',
  '☀️ Aprecie a luz do dia!',
  '🌙 Aprecie o repouso da noite!',
  '⭐ Cada estrela merece atenção!',
  '🌟 Brilhe com gratidão!',
  '💫 Pequenas coisas, grande alegria!',
  '✨ Magia está nos detalhes!',
  '🎊 Celebre a vida!',
  '🎉 Festeje sua existência!',
  '🎈 Levante-se com esperança!',
  '🎀 Embrulhe seu dia em alegria!',
 
  // Relacionamentos e Conexão
  '🤝 As pessoas fazem a vida valer!',
  '💑 Ame e seja amado!',
  '👨‍👩‍👧‍👦 Família é tudo!',
  '👫 Conexões autênticas são ouro!',
  '🤗 Um abraço cura!',
  '😊 Um sorriso contagia!',
  '💬 Converse do coração!',
  '👂 Escute com empatia!',
  '❤️ Amor é o maior poder!',
  '💕 Relate-se genuinamente!',
  '💖 Mostrem amor sempre!',
  '💝 Pequenos gestos importam!',
  '🌹 Ofereça rosas de gentileza!',
  '🤲 Mãos abertas, coração aberto!',
  '🙌 Celebre os outros!',
  '👏 Aplauda o sucesso alheio!',
  '🎺 Anuncie a beleza dos outros!',
  '🎵 Cante louvores!',
  '🎶 Ritmo da amizade sincera!',
  '🎼 Harmonia nos relacionamentos!',
 
  // Saúde e Bem-estar
  '🏃 Movimento é medicina!',
  '🧘 Encontre paz interior!',
  '🥗 Nutra seu corpo!',
  '💧 Hidratação é essencial!',
  '🛌 Durma bem, acorde melhor!',
  '😴 O descanso alimenta a alma!',
  '🌬️ Respire fundo e relaxe!',
  '🧘‍♂️ Meditação traz clareza!',
  '🏋️ Fortaleça seu corpo!',
  '🤸 Seja ativo e vivo!',
  '🚴 Movimente-se com alegria!',
  '⛹️ Jogue com energia!',
  '🏊 Nade em bem-estar!',
  '🧗 Escale sua saúde!',
  '🍎 Saúde começa na mesa!',
  '🥕 Alimento é combustível!',
  '🌽 Nutrir é amar!',
  '🥦 Verde é vida!',
  '🍊 Vitaminas e sorrisos!',
  '🍇 Pequenas frutas, grandes benefícios!',
 
  // Superação e Resiliência
  '🌊 As ondas passam!',
  '🏔️ Montanhas podem ser escaladas!',
  '❄️ Mesmo no frio, há calor!',
  '🌪️ Tempestades passam!',
  '⛈️ Após a chuva, sol!',
  '🔥 Do fogo surge a força!',
  '💨 Vento não te derruba!',
  '🌳 Árvores se dobram mas não quebram!',
  '🪨 Pedras são resilientes!',
  '🦾 Você é mais forte que pensa!',
  '🦾 Força vem da perseverança!',
  '🛡️ Defenda seus sonhos!',
  '⚔️ Lute pelos seus objetivos!',
  '🏹 Precisão na persistência!',
  '🎯 Alvo: superação!',
  '🚀 Decolagem em 3, 2, 1!',
  '🌟 Brilhe apesar dos obstáculos!',
  '✨ Mágica vem da persistência!',
  '💫 Você é invencível!',
  '⭐ Sua estrela não se apaga!',
 
  // Sonhos e Ambição
  '🌙 Sonhe bem!',
  '✨ Seus sonhos são válidos!',
  '🎆 Sonhos explodem em cores!',
  '🎇 Fogos de artifício de esperança!',
  '🌟 Sonhe em GRANDE!',
  '💫 Nenhum sonho é pequeno demais!',
  '🚀 Sonhe alto, voe fundo!',
  '🛸 Navegue pelo universo dos sonhos!',
  '🌌 Galáxia de possibilidades!',
  '🪐 Cada planeta é um novo sonho!',
  '☄️ Meteorito de ambição!',
  '🌠 Chuva de meteoros de sucesso!',
  '🌃 Vislumbre o horizonte!',
  '🌆 Cidade dos sonhos o aguarda!',
  '🏙️ Construa seu império!',
  '🏰 Seu castelo espera!',
  '👑 Use sua coroa de sonhos!',
  '💎 Pedras preciosas de ambição!',
  '🔮 O futuro pertence aos sonhadores!',
  '🎪 Circo mágico dos sonhos!',
 
  // Presente e Mindfulness
  '🧘 Viva o agora!',
  '🕉️ Om de presente!',
  '☮️ Paz no momento!',
  '🌸 Flor que existe agora é bela!',
  '🦋 Metamorfose no presente!',
  '🌊 Onda do agora!',
  '🍃 Folha que balança agora!',
  '🌬️ Brisa do momento!',
  '☀️ Sol brilha agora!',
  '🌤️ Nuvem passa agora!',
  '⚡ Energia do presente!',
  '💫 Momento é tudo!',
  '✨ Brilhe neste segundo!',
  '🕯️ Luz agora!',
  '🔥 Fogo vivo do presente!',
  '💧 Gota de água agora!',
  '🪨 Pedra sólida do presente!',
  '🌳 Árvore enraizada agora!',
  '🦅 Voo do momento!',
  '🐠 Nado no agora!',
 
  // Criatividade e Inovação
  '🎨 Sua criatividade não tem limites!',
  '🖌️ Pinte sua vida em cores vivas!',
  '🖍️ Desenhe seu futuro!',
  '✏️ Escreva sua épica!',
  '✒️ Tinta da inovação!',
  '📝 Página em branco: possibilidades infinitas!',
  '📖 Livro aberto da criatividade!',
  '📚 Biblioteca de ideias!',
  '💡 Luz criativa acesa!',
  '🔆 Brilho da imaginação!',
  '🌈 Arco-íris de possibilidades!',
  '🎭 Teatro da criatividade!',
  '🎪 Circo de ideias!',
  '🎨 Tela em branco esperando!',
  '🖼️ Sua obra-prima começa aqui!',
  '🎬 Filme do seu sucesso!',
  '🎥 Câmera, ação, criatividade!',
  '🎞️ Quadros de inovação!',
  '🎵 Música da engenhosidade!',
  '🎶 Melodia do sucesso!',
 
  // Diversidade de Motivação
  '🎊 Toda hora é hora de celebrar!',
  '🎉 Diversidade traz força!',
  '🌍 O mundo é seu playground!',
  '🌎 Seja global, pense local!',
  '🌏 Conecte com o planeta!',
  '🗺️ Sua jornada é única!',
  '🧭 Navegue com propósito!',
  '⛵ Vele para a vitória!',
  '🚢 Navio do sucesso zarpa!',
  '⚓ Ancorado em seus valores!',
  '🏊 Nade contra a maré!',
  '🏄 Surfe na vida!',
  '🚣 Remar para frente!',
  '🛶 Pequenos barcos também chegam!',
  '✈️ Voe alto!',
  '🚁 Elevação em vista!',
  '🚂 Viagem do sucesso começou!',
  '🚃 Trilhos do destino!',
  '🚄 Trem expresso do êxito!',
  '🚅 Alta velocidade para a glória!',
 
  // Mais Positividade e Energia
  '⚡ Energia sem limite!',
  '🔋 Bateria recarregada!',
  '🔌 Conectado ao sucesso!',
  '💡 Lâmpada de ideias!',
  '🕯️ Chama viva da determinação!',
  '🔥 Fogueira do sucesso!',
  '🌟 Brilho radiante!',
  '✨ Brilho mágico!',
  '💫 Cintilação de esperança!',
  '⭐ Estrela em ascensão!',
  '🌠 Trilha de sucesso!',
  '🌌 Universo de oportunidades!',
  '🪐 Planeta oportunidade!',
  '☄️ Impacto positivo!',
  '🌋 Vulcão de potencial!',
  '⛰️ Pico do sucesso!',
  '🏔️ Montanha conquistável!',
  '🗻 Cume em vista!',
  '🏕️ Base camp do triunfo!',
  '🏞️ Paisagem linda pela frente!',
 
  // Qualidades Pessoais
  '💪 Você é determinado!',
  '🧠 Você é inteligente!',
  '❤️ Você é bondoso!',
  '👁️ Você é perspicaz!',
  '👂 Você é empático!',
  '🙌 Você é generoso!',
  '👐 Você é acolhedor!',
  '💬 Você é eloquente!',
  '🤐 Você é discreto!',
  '👃 Você é intuitivo!',
  '🧭 Você é direcionado!',
  '🎯 Você é preciso!',
  '🔍 Você é observador!',
  '🔎 Você é investigador!',
  '📍 Você é focado!',
  '🗺️ Você é estratégico!',
  '📊 Você é analítico!',
  '📈 Você é progressivo!',
  '📉 Você aprende com quedas!',
  '💹 Seu valor cresce!',
 
  // Ação e Movimento
  '🏃 Comece agora!',
  '🚶 Cada passo conta!',
  '🧗 Suba sempre!',
  '🚴 Pedale com força!',
  '🏊 Nade fundo!',
  '⛹️ Jogue para ganhar!',
  '🤸 Seja flexível!',
  '🤾 Jogue como campeão!',
  '🤺 Espadachim da vida!',
  '🏹 Arqueiro do sucesso!',
  '🎣 Pesque oportunidades!',
  '🥊 Lute com garra!',
  '🥋 Disciplina oriental!',
  '🏋️ Levante pesos maiores!',
  '🤼 Luta até a vitória!',
  '🏌️ Golpear certo!',
  '🏇 Galopada ao sucesso!',
  '🧗 Escalada ao topo!',
  '🚴 Pedal acelerado!',
  '🏃 Velocidade total!',
 
  // Inspiração Geral
  '🌟 Você é a estrela!',
  '✨ Magia em suas mãos!',
  '💫 Celestial e terrestre!',
  '⭐ Brilhe eternamente!',
  '🌠 Deixe um rastro!',
  '🌌 Infinito em você!',
  '🌃 Seu horizonte é vasto!',
  '🌆 Cidades ao seu comando!',
  '🌇 Pôr do sol de vitória!',
  '🌅 Amanhecer de possibilidades!',
  '🌄 Montanha ao amanhecer!',
  '🌉 Ponte para o sucesso!',
  '🌁 Nevoeiro do mistério!',
  '🎑 Noite de realizações!',
  '🌀 Espiral de crescimento!',
  '🌈 Promessa após a chuva!',
  '🌤️ Tempo melhorando!',
  '⛅ Céu misturado, mas esperançoso!',
  '🌥️ Nuvens passam!',
  '☁️ Macieza flutuante!',
 
  // Força Interior
  '🔐 Sua força é interna!',
  '🔓 Abra seu coração!',
  '🔒 Segure seus valores!',
  '🗝️ Chave do sucesso!',
  '🔑 Desbloqueie potencial!',
  '⚔️ Espada da determinação!',
  '🛡️ Escudo do caráter!',
  '🏹 Flecha da precisão!',
  '🎯 Centro do sucesso!',
  '💣 Explosão de criatividade!',
  '💥 Impacto positivo!',
  '🔥 Fogo interior!',
  '❄️ Calma em tempos frios!',
  '💧 Fluidez na adaptação!',
  '🌪️ Tempestade de energia!',
  '⚡ Raio de potencial!',
  '☄️ Meteoro de sucesso!',
  '🌊 Onda de força!',
  '🗻 Montanha de estabilidade!',
  '🌋 Vulcão de poder!',
 
  // Mais 100 variações de positivity
  '🎪 Circo da vida é seu!',
  '🎭 Drama do sucesso!',
  '🎨 Paleta de cores vivas!',
  '🎬 Ação em sua vida!',
  '🎤 Seu discurso ressoa!',
  '🎧 Ouça seu coração!',
  '🎵 Cante sua vitória!',
  '🎶 Ritmo do sucesso!',
  '🎸 Toque sua própria canção!',
  '🎹 Harmonia perfeita!',
  '🎺 Anuncie sua chegada!',
  '🎻 Melodia de sucesso!',
  '🥁 Batida do progresso!',
  '🔔 Som da vitória!',
  '🔕 Silêncio dos críticos!',
  '📢 Grite seu sucesso!',
  '📣 Megafone de triunfo!',
  '📯 Trombeta de glória!',
  '🔊 Volume máximo de alegria!',
  '🔉 Sussurro de esperança!',
 
  // Conexão com a Natureza
  '🌲 Floresta de oportunidades!',
  '🌳 Árvore de sabedoria!',
  '🌴 Paraíso à sua frente!',
  '🌵 Oásis em deserto!',
  '🌾 Campo de possibilidades!',
  '🌿 Folha verde do crescimento!',
  '☘️ Trevo da sorte!',
  '🍀 Quatro folhas de sucesso!',
  '🎍 Tradição e inovação!',
  '🎋 Bambu flexível!',
  '🌱 Broto do novo!',
  '🌲 Coníferas de estabilidade!',
  '🌳 Folhagem de verdade!',
  '🌴 Praias de sonhos!',
  '🌵 Resistência em adversidade!',
  '🌾 Colheita de trabalho!',
  '🌿 Folhas de esperança!',
  '🍁 Transformação de cores!',
  '🍂 Beleza na mudança!',
  '🍃 Leveza do vento!',
 
  // Animais Inspiradores
  '🦁 Corajoso como leão!',
  '🐯 Feroz e focado!',
  '🦅 Visão de águia!',
  '🦉 Sabedoria de coruja!',
  '🐺 Força de manada!',
  '🐘 Memória de elefante!',
  '🦏 Carga de rinoceronte!',
  '🦋 Transformação de borboleta!',
  '🐝 Trabalho de abelha!',
  '🦾 Força de formiga!',
  '🦞 Dureza de lagosta!',
  '🐢 Persistência de tartaruga!',
  '🐇 Rapidez de coelho!',
  '🐿️ Armazenamento de esquilo!',
  '🦝 Astúcia de guaxinim!',
  '🦊 Inteligência de raposa!',
  '🐻 Força de urso!',
  '🦌 Graça de veado!',
  '🦓 Singularidade de zebra!',
  '🦒 Altura de girafa!',
 
  // Elementos e Energia
  '🔥 Fogo do entusiasmo!',
  '💧 Água da adaptação!',
  '🌪️ Ar da liberdade!',
  '🌍 Terra da estabilidade!',
  '⚡ Raio da inspiração!',
  '❄️ Gelo da calma!',
  '💨 Vento da mudança!',
  '🌊 Onda do progresso!',
  '🔔 Som da vitória!',
  '💥 Explosão de alegria!',
  '✨ Brilho da magia!',
  '🌟 Luz da verdade!',
  '💫 Cintilação de esperança!',
  '⭐ Estrela do destino!',
  '🌠 Trilho de sucesso!',
  '☄️ Impacto transformador!',
  '🌋 Vulcão de paixão!',
  '🏔️ Pico conquistado!',
  '⛰️ Montanha vencida!',
  '🗻 Cume em vista!',
 
  // Tempo e Ciclos
  '🌅 Madrugada de novo começo!',
  '☀️ Sol de novo dia!',
  '🌞 Clarão de sucesso!',
  '🌝 Lua cheia de plenitude!',
  '🌛 Crescente de esperança!',
  '🌜 Minguante de problemas!',
  '⭐ Estrela da noite!',
  '🌟 Brilho do dia!',
  '💫 Centelha eterna!',
  '✨ Brilho sem fim!',
  '🌈 Arco de promessa!',
  '🌤️ Claridade voltando!',
  '⛅ Céu misto, esperança certa!',
  '🌥️ Nuvens passageiras!',
  '☁️ Fofura do otimismo!',
  '🌦️ Chuva nutritiva!',
  '🌧️ Tempestade passageira!',
  '⛈️ Trovão de força!',
  '🌩️ Relâmpago de ação!',
  '🌨️ Neve de purificação!',
 
  // Mais 80 de Puro Estímulo
  '🎯 Alvo sempre certeiro!',
  '🎪 Circo da diversão!',
  '🎨 Arte de viver bem!',
  '🎭 Teatro da vitória!',
  '🎬 Filme de sucesso!',
  '🎤 Palco é seu!',
  '🎧 Música do coração!',
  '🎵 Canção do triunfo!',
  '🎶 Harmonia interna!',
  '🎸 Cordas da paixão!',
  '🎹 Teclado do destino!',
  '🎺 Trombeta do aviso!',
  '🎻 Violino do sucesso!',
  '🥁 Tambor da determinação!',
  '📚 Biblioteca de conhecimento!',
  '📖 Página em branco!',
  '📝 Caneta do poder!',
  '✏️ Lápis da criação!',
  '📐 Régua do progresso!',
  '📏 Medida do sucesso!',
  '🔬 Laboratório de ideias!',
  '🔭 Telescópio do futuro!',
  '⚗️ Alquimia do crescimento!',
  '🧪 Experimento de vida!',
  '🧬 DNA do sucesso!',
  '⚙️ Engrenagem perfeita!',
  '🔧 Ferramenta de mudança!',
  '🔨 Martelo do progresso!',
  '⚒️ Picareta de oportunidades!',
  '🛠️ Kit de ferramentas completo!',
  '⛏️ Escavação de potencial!',
  '🔩 Parafuso da estabilidade!',
  '⚖️ Balança do equilíbrio!',
  '🧲 Ímã de sucesso!',
  '📡 Antena do futuro!',
  '🔋 Bateria infinita!',
  '🔌 Plugado no sucesso!',
  '💡 Ideia brilhante!',
  '🕯️ Chama eterna!',
  '🪔 Lâmpada da sabedoria!',
  '🏮 Lanterna do caminho!',
  '📦 Caixa de oportunidades!',
  '📫 Correspondência positiva!',
  '📪 Recebimento de bênçãos!',
  '📬 Caixa de surpresas!',
  '📭 Vazio de negatividade!',
  '📮 Entrega de sucesso!',
  '✉️ Mensagem de esperança!',
  '📩 Email de vitória!',
  '📨 Recebimento de bom!',
  '📤 Envio de positivo!',
  '📥 Entrada de sucesso!',
  '🗳️ Voto pela vitória!',
  '✏️ Marca seu destino!',
  '✒️ Tinta indelével!',
  '🖋️ Caneta do poder!',
  '🖊️ Marcador de progresso!',
  '🖌️ Pincel de cores!',
  '🖍️ Lápis de cor!',
  '📝 Assinando sucesso!',
  '📄 Documento de vitória!',
  '📃 Pergaminho de sabedoria!',
  '📑 Página virada!',
  '🧾 Recibo do progresso!',
  '📜 Scroll da vida!',
  '📰 Notícia de sucesso!',
  '🗞️ Jornal de triunfo!',
  '📑 Folha de ouro!',
  '🧷 Prendedor de sorte!',
  '🔗 Elo com sucesso!',
  '📎 Clipe da vitória!',
  '🖇️ Agrupador de talentos!',
  '📐 Triângulo do poder!',
  '📏 Régua reta!',
  '🧮 Ábaco do progresso!',
  '📓 Caderno de sonhos!',
  '📔 Diário da vitória!',
  '📒 Livro de conquistas!',
  '📕 Volume vermelho de paixão!',
  '📗 Livro verde de esperança!',
  '📘 Livro azul de verdade!',
  '📙 Livro amarelo de ouro!',
  '📚 Biblioteca completa!',
  '📖 Paginação do sucesso!',
 
  // Final 50 Mensagens de Impacto
  '🚀 Decolagem iminente!',
  '🛸 Viagem para as estrelas!',
  '🛰️ Satélite do sucesso!',
  '🌌 Galáxia de oportunidades!',
  '🪐 Planeta perdido no sucesso!',
  '⭐ Constelação de vitória!',
  '🌟 Supernova de energia!',
  '💫 Buraco negro de sucesso!',
  '✨ Nebulosa de criatividade!',
  '☄️ Chuva de meteoros!',
  '🌠 Meteorito de impacto!',
  '🔭 Telescópio para o futuro!',
  '🌃 Skyline de ambição!',
  '🌆 Cidade dos sonhos!',
  '🌇 Pôr do sol triunfal!',
  '🌉 Ponte para a gloria!',
  '🌁 Névoa do mistério!',
  '🎑 Lua cheia de plenitude!',
  '🌄 Montanha ao amanhecer!',
  '🏔️ Summit da vida!',
  '🗻 Fuji do sucesso!',
  '🏕️ Acampamento da vitória!',
  '⛺ Tenda da esperança!',
  '🏠 Casa do triunfo!',
  '🏡 Lar da paz!',
  '🏘️ Comunidade de sucesso!',
  '🏢 Prédio do poder!',
  '🏣 Marca do sucesso!',
  '🏤 Correios da vitória!',
  '🏥 Hospital da cura!',
  '🏦 Banco de ouro!',
  '🏧 Máquina do sucesso!',
  '🏨 Hotel de luxo!',
  '🏩 Motel de romance!',
  '🏪 Loja de abundância!',
  '🏫 Escola de vitória!',
  '🏬 Supermercado de oportunidades!',
  '🏭 Fábrica de sucesso!',
  '🏯 Castelo de poder!',
  '🏰 Fortaleza da força!',
  '💒 Igreja da fé!',
  '🗼 Torre de Babel!',
  '🗽 Liberdade garantida!',
  '⛪ Capela da esperança!',
  '🕌 Mesquita da paz!',
  '🕍 Sinagoga da sabedoria!',
  '⛩️ Santuário da serenidade!',
  '🛕 Templo da transformação!',
  '⌚ Hora do sucesso!',
  '⏰ Despertador da vitória!',
  '⏱️ Cronômetro do progresso!'
];
 
// Estrutura centralizada do App
const APP = {
  modal: document.getElementById('modalAdicionar'),
  form: document.getElementById('formLembrete'),
  btnAdicionar: document.getElementById('btnAdicionar'),
  btnVerificar: document.getElementById('btnVerificar'),
  btnClose: document.getElementById('closeModal'),
  themeToggle: document.getElementById('themeToggle'),
  dailyMessage: document.getElementById('dailyMessage'),
  containerLembretes: document.getElementById('containerLembretes'),
  countLembretes: document.getElementById('countLembretes'),
 
  init() {
    this.carregarTemaSalvo();
    this.gerarMensagemDiaria();
    this.carregarLembretesDoDia();
    this.adicionarEventos();
  },
 
  adicionarEventos() {
    this.btnAdicionar.addEventListener('click', () => this.abrirModal());
    this.btnVerificar.addEventListener('click', () => this.atualizarLembretes());
    this.btnClose.addEventListener('click', () => this.fecharModal());
    this.themeToggle.addEventListener('click', () => this.alternarTema());
    this.form.addEventListener('submit', (e) => this.adicionarLembrete(e));
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.fecharModal();
    });
  },
 
  gerarMensagemDiaria() {
    const mensagem = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
    this.dailyMessage.textContent = mensagem;
  },
 
  alternarTema() {
    document.body.classList.toggle('dark-mode');
    const temaSalvo = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('tema', temaSalvo);
    this.themeToggle.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
  },
 
  carregarTemaSalvo() {
    const tema = localStorage.getItem('tema') || 'light';
    if (tema === 'dark') {
      document.body.classList.add('dark-mode');
      this.themeToggle.textContent = '☀️';
    }
  },
 
  abrirModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.form.reset();
  },
 
  fecharModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.form.reset();
  },
 
  mostrarMensagem(tipo, texto) {
    const div = document.createElement('div');
    const bgColor = tipo === 'sucesso' ? '#28a745' : '#dc3545';
    
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${bgColor};
      color: white;
      border-radius: 8px;
      font-weight: 600;
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    
    div.textContent = texto;
    document.body.appendChild(div);
    
    setTimeout(() => div.remove(), 3000);
  },
 
  async copiarTexto(texto, tipo) {
    try {
      await navigator.clipboard.writeText(texto);
      this.mostrarMensagem('sucesso', `✅ ${tipo} copiado!`);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  },
 
  atualizarLembretes() {
    this.mostrarMensagem('sucesso', '🔄 Atualizando...');
    this.carregarLembretesDoDia();
  },
 
  async adicionarLembrete(e) {
    e.preventDefault();
 
    const dados = {
      nome: document.getElementById('nome').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      data: document.getElementById('data').value,
      descricao: document.getElementById('descricao').value.trim(),
    };
 
    try {
      const response = await fetch(`${API_URL}/api/lembretes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
 
      if (response.ok) {
        this.mostrarMensagem('sucesso', '✅ Lembrete adicionado!');
        this.fecharModal();
        this.carregarLembretesDoDia();
      } else {
        this.mostrarMensagem('erro', '❌ Erro ao adicionar');
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },
 
  async carregarLembretesDoDia() {
    const hoje = new Date().toISOString().split('T')[0];
 
    try {
      const response = await fetch(`${API_URL}/api/lembretes`);
      const lembretes = await response.json();
 
      const lembretesHoje = lembretes.filter(l => l.data && l.data.startsWith(hoje));
 
      this.countLembretes.textContent = lembretesHoje.length;
 
      if (lembretesHoje.length === 0) {
        this.containerLembretes.innerHTML = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
          <p>📭 Nenhum lembrete para hoje</p>
          <p class="empty-text">Clique em "Adicionar Lembrete" para criar um novo</p>
        `;
        this.containerLembretes.appendChild(emptyDiv);
        return;
      }
 
      this.containerLembretes.innerHTML = '';
 
      lembretesHoje.forEach(lembrete => {
        const card = this.criarCardLembrete(lembrete);
        this.containerLembretes.appendChild(card);
      });
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      this.mostrarMensagem('erro', '❌ Erro ao conectar');
    }
  },
 
  criarCardLembrete(lembrete) {
    const card = document.createElement('div');
    card.className = 'lembrete-card';
 
    const dataFormatada = lembrete.data ? new Date(lembrete.data).toLocaleDateString('pt-BR') : 'Sem data';
    const status = lembrete.enviado ? 'Enviado' : 'Pendente';
    const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';
 
    // Criar header
    const header = document.createElement('div');
    header.className = 'lembrete-header';
 
    const info = document.createElement('div');
    info.className = 'lembrete-info';
 
    if (lembrete.nome) {
      const nome = document.createElement('h3');
      nome.textContent = lembrete.nome;
      info.appendChild(nome);
    }
 
    if (lembrete.telefone) {
      const telefone = document.createElement('div');
      telefone.className = 'lembrete-telefone-destaque';
      telefone.style.cursor = 'pointer';
      telefone.setAttribute('title', 'Clique para copiar');
      
      const icon = document.createElement('span');
      icon.textContent = '📱 ';
      
      const num = document.createElement('span');
      num.textContent = lembrete.telefone;
      
      telefone.appendChild(icon);
      telefone.appendChild(num);
      
      telefone.addEventListener('click', () => {
        this.copiarTexto(lembrete.telefone, 'Telefone');
      });
      
      info.appendChild(telefone);
    }
 
    const statusSpan = document.createElement('span');
    statusSpan.className = `lembrete-status ${statusClass}`;
    statusSpan.textContent = status;
 
    header.appendChild(info);
    header.appendChild(statusSpan);
    card.appendChild(header);
 
    // Criar body
    const body = document.createElement('div');
    body.className = 'lembrete-body';
 
    if (lembrete.data) {
      const data = document.createElement('p');
      data.className = 'lembrete-data';
      data.textContent = `📅 ${dataFormatada}`;
      body.appendChild(data);
    }
 
    if (lembrete.descricao) {
      const descricao = document.createElement('div');
      descricao.className = 'lembrete-mensagem-destaque';
      descricao.style.cursor = 'pointer';
      descricao.setAttribute('title', 'Clique para copiar');
      
      const msgText = document.createElement('p');
      msgText.textContent = lembrete.descricao;
      
      descricao.appendChild(msgText);
      
      descricao.addEventListener('click', () => {
        this.copiarTexto(lembrete.descricao, 'Mensagem');
      });
      
      body.appendChild(descricao);
    }
 
    card.appendChild(body);
 
    // Criar actions
    const actions = document.createElement('div');
    actions.className = 'lembrete-actions';
 
    if (lembrete.telefone) {
      const btnTelefone = document.createElement('button');
      btnTelefone.className = 'lembrete-btn btn-copiar';
      btnTelefone.textContent = '📋 Telefone';
      btnTelefone.addEventListener('click', () => {
        this.copiarTexto(lembrete.telefone, 'Telefone');
      });
      actions.appendChild(btnTelefone);
    }
 
    if (lembrete.descricao) {
      const btnMensagem = document.createElement('button');
      btnMensagem.className = 'lembrete-btn btn-copiar';
      btnMensagem.textContent = '📋 Mensagem';
      btnMensagem.addEventListener('click', () => {
        this.copiarTexto(lembrete.descricao, 'Mensagem');
      });
      actions.appendChild(btnMensagem);
    }
 
    const btnEnviado = document.createElement('button');
    btnEnviado.className = 'lembrete-btn btn-enviado';
    btnEnviado.textContent = lembrete.enviado ? '✓ Enviado' : 'Marcar Enviado';
    btnEnviado.addEventListener('click', () => {
      this.marcarEnviado(lembrete.id, !lembrete.enviado);
    });
    actions.appendChild(btnEnviado);
 
    const btnDeletar = document.createElement('button');
    btnDeletar.className = 'lembrete-btn btn-deletar';
    btnDeletar.textContent = '🗑️ Deletar';
    btnDeletar.addEventListener('click', () => {
      this.deletarLembrete(lembrete.id);
    });
    actions.appendChild(btnDeletar);
 
    card.appendChild(actions);
 
    return card;
  },
 
  async marcarEnviado(id, enviado) {
    try {
      const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enviado }),
      });
 
      if (response.ok) {
        this.carregarLembretesDoDia();
        const msg = enviado ? '✅ Marcado como enviado!' : '✅ Marcado como pendente!';
        this.mostrarMensagem('sucesso', msg);
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro ao atualizar');
    }
  },
 
  deletarLembrete(id) {
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'modal-confirmacao';
    
    const content = document.createElement('div');
    content.className = 'modal-confirmacao-content';
    
    const titulo = document.createElement('h3');
    titulo.textContent = 'Deletar Lembrete?';
    content.appendChild(titulo);
    
    const mensagem = document.createElement('p');
    mensagem.textContent = 'Esta ação não pode ser desfeita';
    content.appendChild(mensagem);
    
    const botoes = document.createElement('div');
    botoes.className = 'modal-confirmacao-buttons';
    
    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn-confirm-delete';
    btnConfirm.textContent = '🗑️ Deletar';
    
    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn-cancel-delete';
    btnCancel.textContent = 'Cancelar';
    
    botoes.appendChild(btnConfirm);
    botoes.appendChild(btnCancel);
    content.appendChild(botoes);
    
    confirmDelete.appendChild(content);
    document.body.appendChild(confirmDelete);
    
    btnCancel.addEventListener('click', () => {
      confirmDelete.remove();
    });
    
    btnConfirm.addEventListener('click', async () => {
      confirmDelete.remove();
      
      try {
        const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
          method: 'DELETE',
        });
 
        if (response.ok) {
          this.carregarLembretesDoDia();
          this.mostrarMensagem('sucesso', '✅ Lembrete deletado!');
        }
      } catch (error) {
        console.error('Erro:', error);
        this.mostrarMensagem('erro', '❌ Erro ao deletar');
      }
    });
  }
};
 
// Inicializar quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
