# Minhas Finanças: guia de configuração

App de finanças pessoais que funciona no celular e no computador, com os dados salvos na nuvem (Supabase) e login com Google. Também funciona sem internet: as alterações ficam guardadas no aparelho e são enviadas quando a conexão voltar.

São 6 etapas, uns 20 minutos no total. Faça pelo computador.

---

## Etapa 0: salve seus dados atuais

Se você já tem lançamentos no arquivo antigo `Financeiro.html`:

1. Abra o `Financeiro.html` antigo no mesmo navegador de sempre.
2. Clique em **⚙ Configurações e backup → Exportar backup**.
3. Guarde o arquivo `.json` baixado. Você vai importá-lo na Etapa 5.

---

## Etapa 1: publicar o app no GitHub Pages

1. Crie uma conta em **github.com** (se ainda não tiver).
2. Clique em **+ → New repository**.
   - Nome: `financas`
   - Deixe como **Public** (o GitHub Pages gratuito exige isso; seus dados financeiros **não** ficam no repositório, só o código).
   - Clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Arraste **todos os arquivos e a pasta `icons`** deste projeto (não a pasta `financas-app` em si, e sim o que tem dentro dela). Clique em **Commit changes**.
5. Vá em **Settings → Pages**. Em *Branch*, escolha `main` e a pasta `/ (root)`, e clique em **Save**.
6. Depois de 1 ou 2 minutos, o endereço aparece no topo dessa página, algo como:
   `https://SEU-USUARIO.github.io/financas/`

   Anote esse endereço. Por enquanto ele vai mostrar a mensagem "O app ainda não foi conectado ao Supabase", e isso é normal.

---

## Etapa 2: criar o banco de dados no Supabase

1. Crie uma conta em **supabase.com** (pode entrar com a conta do GitHub).
2. Clique em **New project**.
   - Nome: `financas`
   - Crie uma senha do banco e guarde-a (você quase nunca vai precisar dela).
   - Região: **South America (São Paulo)**.
3. Quando o projeto terminar de criar, abra o menu **SQL Editor**, cole todo o conteúdo do arquivo `supabase.sql` e clique em **Run**. Deve aparecer "Success".
4. Abra **Project Settings** (engrenagem) e procure as seções **Data API** e **API Keys**. Copie:
   - a **Project URL** (ex.: `https://abcdefghijkl.supabase.co`)
   - a **Publishable key** (começa com `sb_publishable_`). Se o seu painel mostrar só a **anon public key**, use essa.
5. No GitHub, abra o arquivo `config.js`, clique no lápis ✏️ para editar, cole a URL e a chave nos lugares indicados e clique em **Commit changes**.

A chave pública pode ficar visível no código. Quem protege seus dados são as regras de segurança criadas pelo `supabase.sql`: cada conta só consegue ler e alterar os próprios dados.

---

## Etapa 3: ativar o login com Google

Esta é a etapa mais trabalhosa, mas só precisa ser feita uma vez.

**No Supabase**

1. Vá em **Authentication → Sign In / Providers → Google**.
2. Copie a **Callback URL** mostrada ali (algo como `https://abcdefghijkl.supabase.co/auth/v1/callback`). Deixe essa aba aberta.

**No Google Cloud** (console.cloud.google.com, entre com sua conta Google)

3. No topo, crie um projeto novo chamado `Financas`.
4. Abra **APIs e serviços → Tela de consentimento OAuth** (em algumas contas aparece como **Google Auth Platform**) e configure:
   - Tipo de usuário: **Externo**
   - Nome do app: `Minhas Finanças`, e-mail de suporte: o seu
   - Em **Público-alvo / Usuários de teste**, adicione o seu e-mail do Google. Assim só você consegue entrar.
5. Vá em **Credenciais → Criar credenciais → ID do cliente OAuth**:
   - Tipo de aplicativo: **Aplicativo da Web**
   - **Origens JavaScript autorizadas:** `https://SEU-USUARIO.github.io`
   - **URIs de redirecionamento autorizados:** cole a Callback URL do Supabase (passo 2)
   - Clique em **Criar**. Copie o **ID do cliente** e a **Chave secreta do cliente**.

**De volta ao Supabase**

6. Na tela do provedor Google, ative a opção (**Enable**), cole o ID do cliente e a chave secreta e clique em **Save**.

---

## Etapa 4: informar o endereço do app ao Supabase

1. No Supabase, vá em **Authentication → URL Configuration**.
2. **Site URL:** `https://SEU-USUARIO.github.io/financas/`
3. Em **Redirect URLs**, clique em **Add URL** e adicione o mesmo endereço. Salve.

---

## Etapa 5: entrar e trazer seus dados

1. Abra `https://SEU-USUARIO.github.io/financas/` e clique em **Entrar com Google**.
2. Se você fez a Etapa 0: vá em **⚙ Configurações e backup → Importar backup**, escolha o arquivo `.json` e confirme. Seus dados vão para a nuvem na hora.

---

## Etapa 6: instalar como aplicativo

- **Android (Chrome):** abra o endereço, toque no menu **⋮ → Instalar app** (ou "Adicionar à tela inicial").
- **iPhone (Safari):** abra o endereço, toque em **Compartilhar → Adicionar à Tela de Início**.
- **Computador (Chrome ou Edge):** abra o endereço e clique no ícone de instalar na barra de endereço (um monitor com seta), ou menu **⋮ → Instalar Minhas Finanças**.

Entre com a mesma conta Google em todos os aparelhos.

---

## Bom saber

- **Indicador de sincronização:** no menu lateral aparece "Sincronizado", "Salvando na nuvem…" ou "Sem internet · salvo no aparelho".
- **Usando em dois aparelhos ao mesmo tempo:** ao voltar para o app, ele puxa as novidades do outro aparelho. Se você alterar os dois aparelhos sem internet ao mesmo tempo, vale a versão salva por último.
- **Backup:** o botão **Exportar backup** continua funcionando. Vale fazer um de vez em quando.
- **Plano gratuito:** o Supabase pausa projetos gratuitos que ficam cerca de uma semana sem nenhum acesso. Se acontecer, entre em supabase.com e clique em **Restore project**; nenhum dado é perdido. Usando o app normalmente, isso não acontece.

---

## Como pedir alterações ao Claude

Comece a conversa com algo como:

> Meu app de finanças está no repositório **SEU-USUARIO/financas** no GitHub. Quero que você [descreva a alteração].

O Claude lê o código atual, faz a alteração e, com sua autorização, envia para o GitHub. Em 1 ou 2 minutos a nova versão está no ar, e o app se atualiza sozinho na próxima vez que você abrir. Seus dados no Supabase não são afetados.

---

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro (telas, cálculos, sincronização) |
| `config.js` | Endereço e chave pública do seu Supabase |
| `manifest.webmanifest` | Nome, ícone e cores para instalar como app |
| `sw.js` | Permite abrir o app sem internet |
| `icons/` | Ícones do app |
| `supabase.sql` | Cria a tabela e as regras de segurança no Supabase |
