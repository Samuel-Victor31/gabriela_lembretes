# 🤝 Contribuindo para o Projeto

Primeiro, obrigado por considerar contribuir! É gente como você que torna esse projeto incrível.

---

## 💡 Antes de Começar

Leia nosso [README.md](./README.md) para entender melhor o projeto.

Se você vai fazer uma contribuição significativa, é bom:
1. Abrir uma [Issue](https://github.com/seu-usuario/gabriela-lembretes/issues) primeiro
2. Discutir sua ideia com a gente
3. Esperar aprovação antes de começar

---

## 🐛 Reportando Bugs

Encontrou um bug? Ótimo, nos avise!

**Abra uma Issue com:**
- Título claro e descritivo
- Descrição detalhada do problema
- Passos para reproduzir
- Resultado esperado vs. resultado atual
- Screenshots (se aplicável)
- Seu navegador e versão

**Exemplo:**
```
Título: Modal de consultas fecha quando clico em "Adicionar"

Descrição:
Quando adiciono uma nova consulta e clico no botão "Adicionar Consulta",
o modal fecha mas nenhuma mensagem de sucesso aparece.

Passos:
1. Abrir modal de consultas
2. Preencher formulário com dados válidos
3. Clicar em "Adicionar Consulta"

Resultado esperado:
Mensagem de sucesso e atualização da tabela

Resultado atual:
Modal fecha em silêncio, sem atualizar nada

Navegador: Chrome 120 no Windows 11
```

---

## ✨ Sugerindo Melhorias

Tem uma ideia brilhante? Nos diga!

**Abra uma Issue com tag `enhancement`:**
- Descrição clara do problema que resolve
- Solução proposta
- Exemplos de como seria
- Benefícios

---

## 🔄 Seu Primeiro Pull Request

### Setup Local

1. **Fork o repositório**
```bash
# No GitHub, clique em "Fork"
```

2. **Clone sua cópia**
```bash
git clone https://github.com/SEU-USUARIO/gabriela-lembretes.git
cd gabriela-lembretes
```

3. **Crie uma branch**
```bash
git checkout -b feature/sua-feature-incrivel
# ou
git checkout -b fix/seu-bug-fix
```

4. **Faça suas mudanças**
- Teste tudo localmente
- Siga o estilo de código existente
- Adicione comentários onde necessário

5. **Commit com mensagens claras**
```bash
git commit -m "Adiciona nova funcionalidade X"
# ou
git commit -m "Corrige bug de Y quando Z acontece"
```

6. **Push para sua fork**
```bash
git push origin feature/sua-feature-incrivel
```

7. **Abra um Pull Request**
- Vá ao repositório original
- Clique em "New Pull Request"
- Descreva suas mudanças
- Referencie Issues relacionadas (#123)

---

## 📋 Checklist para Pull Request

Antes de submeter, verifique:

- [ ] Código segue o estilo do projeto
- [ ] Testei em navegadores modernos
- [ ] Atualizei documentação se necessário
- [ ] Adicionei comentários para código complexo
- [ ] Não há console.errors ou warnings
- [ ] Mobile funciona perfeitamente
- [ ] Dark mode funciona
- [ ] Mensagens são claras para o usuário

---

## 🎨 Guia de Estilo

### JavaScript
```javascript
// Use const por padrão
const minhaVariavel = 'valor';

// Funções nomeadas e legíveis
function adicionarLembrete(nome, data) {
  // ... código
}

// Comentários para lógica complexa
// Extrair mês da data para agrupamento
const [ano, mes] = data.split('-');

// Use arrow functions em callbacks
dados.forEach(d => {
  console.log(d.nome);
});
```

### CSS
```css
/* Classes descritivas */
.modal-consultas-content {
  /* ... */
}

/* Variáveis CSS para cores */
--color-primary: #667eea;

/* Comentários antes de seções */
/* ========== MODAL ========== */
.modal { }

/* Espaçamento consistente */
margin: 20px;
padding: 15px;
```

### HTML
```html
<!-- IDs úicos e semânticos -->
<div id="containerConsultas"></div>

<!-- Atributos legíveis -->
<button 
  id="btnAdicionar"
  class="btn btn-primary"
  data-action="add"
>
  Adicionar
</button>
```

---

## 🧪 Testando Suas Mudanças

### Antes de Submeter

1. **Teste no Chrome**
```
F12 → Console → Nenhum erro?
```

2. **Teste no Firefox**
```
Verifique funcionalidade
```

3. **Teste no Safari (se possível)**
```
Compatibilidade
```

4. **Teste responsividade**
```
DevTools → Toggle device toolbar
Teste: Mobile, Tablet, Desktop
```

5. **Teste Dark Mode**
```
Clique no botão 🌙
Verifique todos os elementos
```

---

## 📝 Tipos de Contribuição

### Código
- Novas funcionalidades
- Bug fixes
- Performance improvements
- Refatoração

### Documentação
- README
- Guias
- Comentários no código
- Exemplos

### Design
- Ícones
- Cores
- Layout
- UX improvements

### Testes
- Testes automatizados
- Relatório de bugs
- Feedback
- Sugestões

---

## ❓ Dúvidas?

- 📌 Abra uma Discussion
- 💬 Comente em uma Issue
- 📧 Me chame no LinkedIn

Não tenha medo de perguntar — todos começam em algum lugar!

---

## 🎉 Obrigado!

Toda contribuição, por menor que seja, faz diferença. Valeu por ajudar a melhorar o projeto!

---

**Desenvolvido com ❤️ pela comunidade**
