# 🎉 Convite Artur Garcia — 22 Anos (com RSVP e Painel Admin)

Sistema web moderno, fluido e responsivo para confirmação de presença (RSVP) e gestão de convidados, com design **Dark Moderno Premium**, estética masculina e detalhes em vermelho carmesim.

---

## 🚀 Como Executar Localmente

Você não precisa instalar dependências pesadas. O backend utiliza apenas os módulos nativos do Node.js:

```bash
cd birthday-22
node server.js
```
ou:
```bash
npm start
```

Acesse no seu navegador: **`http://localhost:3000`**

---

## ☁️ Como Publicar no Cloudflare Pages

Este projeto foi desenhado sob medida para o **Cloudflare Pages**:

### Opção 1: Deploy Rápido (Git / Interface Web)
1. Conecte seu repositório no [Cloudflare Pages](https://dash.cloudflare.com/).
2. Na configuração de build:
   - **Framework preset**: `None`
   - **Build command**: *(deixe em branco)*
   - **Build output directory**: `birthday-22/public`
3. *(Opcional)* Se desejar persistência no Edge com Cloudflare Workers KV, adicione a pasta `birthday-22/functions` com o binding `RSVPS`.
4. O sistema possui fallback inteligente automático no navegador (`localStorage`), de modo que as confirmações e o painel funcionam imediatamente em qualquer hospedagem estática!

---

## 🔐 Acesso à Área do Anfitrião (Admin)

Para acessar o painel de confirmações:
1. No rodapé do convite, clique no botão discreto: **`Área do Anfitrião 🔒`**.
2. Insira as credenciais configuradas:
   - **Usuário:** `artur.garcia`
   - **Senha:** `Mateus17`

---

## 🛠️ Recursos Incluídos

* **Hero de Impacto**: Título bold "ARTUR GARCIA 22", selo exclusivo e contagem regressiva em tempo real para **Sexta-feira, 13 de Novembro de 2026 às 19:00**.
* **Fluxo de Confirmação Rápida (RSVP)**:
  - Campo simples para nome ou apelido (sem fricção de formulários longos).
  - Dois botões interativos:
    - `🔥 Vou com certeza!` — dispara animação festiva de confetes nas cores vermelho carmesim e dourado, e salva o status.
    - `😢 Não poderei ir` — exibe mensagem empática de agradecimento.
  - Opção para o convidado alterar a resposta se tiver clicado errado.
* **Card do Local**:
  - **Carneiro do Ordones Jovita** (Av. Jovita Feitosa, 289 · Parquelândia, Fortaleza - CE).
  - Botão direto para o Google Maps (`https://maps.app.goo.gl/Un93fJ1gBTftwSus5`).
  - Botão com 1 clique para "Copiar Endereço" com feedback visual tátil.
* **Painel Administrativo Completo**:
  - Métricas ao vivo: **Confirmados**, **Não vão** e **Total de Respostas**.
  - Campo de busca em tempo real por nome.
  - Filtros rápidos por abas (*Todos*, *Confirmados*, *Ausentes*).
  - **Botão "Copiar Lista para WhatsApp"**: Gera mensagem formatada com emojis e lista numerada dos confirmados pronta para enviar no WhatsApp.
  - **Botão "Baixar Planilha (CSV)"**: Exporta arquivo `.csv` compatível com Excel/Google Sheets.
  - Exclusão individual de respostas.
