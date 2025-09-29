# Recanto Estúdio — Landing Page

Site estático simples para apresentar o espaço de locação para ensaios fotográficos: informações, galeria e contatos.

## Estrutura

- `index.html`: marcação principal do site
- `styles.css`: estilos (tema com variáveis CSS)
- `script.js`: menu mobile, lightbox e utilidades
- `assets/favicon.svg`: ícone do site

## Personalização rápida

Edite o arquivo `index.html` e substitua os seguintes trechos:

- Título e descrição da página (`<title>` e meta description)
- Dados do bloco JSON‑LD (nome, endereço, telefone, e‑mail, redes)
- Links de WhatsApp/Instagram e e‑mail nas seções "Herói" e "Contato"
- Endereço do Google Maps (parâmetro `q=` da `iframe`)
- Valores e itens da tabela de preços
- Imagens da galeria (substitua os links do `picsum.photos` pelos seus)

Você também pode ajustar as cores no topo do `styles.css` (variáveis `--brand`, `--bg`, `--text`, etc.).

## Como visualizar localmente

1. Clique duas vezes em `index.html` para abrir no navegador; ou
2. Use um servidor local (recomendado):

   - Python 3:
     ```bash
     python -m http.server 5173
     ```
     Acesse: `http://localhost:5173`

   - Node.js (http-server):
     ```bash
     npm i -g http-server
     http-server -p 5173
     ```

## Implantação

- GitHub Pages: publique a pasta do projeto como raiz do site
- Netlify/Vercel: arraste e solte a pasta ou conecte o repositório

## Dicas de conteúdo

- Prefira imagens JPG otimizadas (qualidade ~70, largura até 1600px)
- Use textos curtos e objetivos; destaque comodidades e diferenciais
- Mantenha contatos e endereço sempre visíveis e atualizados

