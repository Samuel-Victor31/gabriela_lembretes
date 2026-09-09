# ⚡ Guia Rápido - Primeiros 5 Minutos

Quer colocar para rodar o quanto antes? Siga este guia simples!

---

## 📋 Checklist Pré-Requisitos

- [ ] Navegador moderno (Chrome, Firefox, Safari ou Edge)
- [ ] Conta no GitHub
- [ ] Conta no Cloudflare (gratuita)

---

## 🚀 Passo 1: Fork do Repositório (1 min)

1. Acesse: https://github.com/seu-usuario/gabriela-lembretes
2. Clique em **Fork** (canto superior direito)
3. Deixe as opções padrão e clique em **Create fork**

Pronto! Você tem sua própria cópia.

---

## 🛠️ Passo 2: Configurar Cloudflare (2 min)

### 2.1 Criar D1 Database

1. Acesse: https://dash.cloudflare.com/
2. Vá em **Workers & Pages** → **D1**
3. Clique em **Create Database**
4. Nome: `gabriela_lembretes`
5. Copie o **Database ID** (vamos usar depois)

### 2.2 Criar Worker

1. Vá em **Workers & Pages** → **Create**
2. Nome: `gabriela-lembretes-api`
3. Selecione tipo **HTTP handler**
4. Clique em **Deploy**

---

## 📁 Passo 3: Clonar Localmente (1 min)

```bash
# Abra terminal/CMD e rode:
git clone https://github.com/SEU-USUARIO/gabriela-lembretes.git
cd gabriela-lembretes
```

---

## ⚙️ Passo 4: Configurar Cloudflare Local (1 min)

### 4.1 Instalar Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 4.2 Criar wrangler.toml

Crie um arquivo `wrangler.toml` na raiz do projeto:

```toml
name = "gabriela-lembretes-api"
main = "worker-com-consultas.js"
compatibility_date = "2024-01-15"

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.d1_databases]]
binding = "lembretes_gabriela"
database_name = "gabriela_lembretes"
database_id = "seu-id-aqui"
```

**Importante:** Substitua `seu-id-aqui` pelo Database ID copiado antes!

### 4.3 Deploy

```bash
wrangler deploy --env production
```

Após o deploy, copie a URL do seu worker (algo como `https://gabriela-lembretes-api.SEU-USUARIO.workers.dev`)

---

## 🌐 Passo 5: Atualizar API URL (30 seg)

Edite o arquivo `consultas.js` na linha ~10:

```javascript
// ANTES
API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',

// DEPOIS
API_URL: 'https://SEU-USUARIO-gabriela-lembretes-api.workers.dev',
```

---

## 🎉 Pronto!

Abra no navegador:
```
file:///seu-caminho/gabriela-lembretes/index.html
```

Ou melhor ainda, use Live Server:
```bash
# Se tiver VS Code instalado
code . # Abre VS Code
# Clique em "Go Live" na barra inferior
```

---

## ✅ Seu Sistema Está Funcionando Se...

- ✅ A página carrega sem erros
- ✅ Você consegue criar um lembrete
- ✅ Você consegue adicionar uma consulta
- ✅ O dark mode funciona (clique em 🌙)
- ✅ Os botões respondem

---

## 🎯 Próximos Passos

### Opcional: Deploy no GitHub Pages

```bash
git add .
git commit -m "Primeiro commit"
git push origin main
```

Depois, vá para Settings → Pages → Source → Main branch

Seu site estará em: `https://seu-usuario.github.io/gabriela-lembretes/`

---

## ❓ Deu Erro?

### "Erro de conexão com worker"
- Verifique a URL no `consultas.js`
- Confirme que o worker está online em https://dash.cloudflare.com/

### "Database não encontrado"
- Copie o Database ID correto do Cloudflare
- Verifique se está no `wrangler.toml`

### "Página não carrega"
- Limpe cache (Ctrl+Shift+Del)
- Tente em outro navegador
- Verifique console (F12) para erros

---

## 📚 Documentação Completa

Quer aprender mais?

- [README.md](./README.md) — Documentação completa
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Como contribuir
- [GUIA-EVOLUTION-API.md](./GUIA-EVOLUTION-API.md) — Integração WhatsApp

---

## 💡 Dicas Finais

**Testar Localmente**
```bash
# Use VS Code Live Server ou:
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Fazer Alterações**
1. Edite os arquivos
2. Recarregue a página (F5)
3. Teste tudo
4. Commit: `git add . && git commit -m "Sua mudança"`
5. Push: `git push origin main`

**Voltar a Uma Versão Anterior**
```bash
git log --oneline  # Ver histórico
git revert COMMIT_ID  # Reverter um commit
```

---

## 🎊 Parabéns!

Você tem um sistema de gerenciamento de consultas totalmente funcional!

Agora explore as funcionalidades:
- 📌 Crie lembretes
- 📅 Registre consultas
- 📊 Gere relatórios
- 🌙 Teste o dark mode

**Divirta-se! 🚀**

---

**Precisa de ajuda?**
- Abra uma [Issue](https://github.com/seu-usuario/gabriela-lembretes/issues)
- Verifique o [README](./README.md)
- Leia o [Guia de Troubleshooting](./README.md#-troubleshooting)
