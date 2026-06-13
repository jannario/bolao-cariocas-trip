# Bolao Carioca's Trip

Site do bolao do grupo Carioca's Trip.

## Publicar no Netlify

Este projeto precisa ser publicado pelo Netlify conectado ao GitHub, porque usa
Netlify Functions para salvar os palpites para todo o grupo.

Arquivos importantes:

- `index.html`
- `assets/cariocas-trip-logo.png`
- `netlify/functions/bolao-state.js`
- `netlify.toml`
- `package.json`

No Netlify:

1. Conecte este repositorio ao site.
2. Deixe o build command vazio.
3. Deixe o publish directory como `.`.
4. O Netlify vai ler `netlify.toml` e ativar as functions.

Se o site mostrar "Salvamento compartilhado ativo", esta correto.
