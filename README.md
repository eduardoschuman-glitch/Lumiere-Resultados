# Instituto Lumière · Resultados

Página de antes e depois do Instituto Lumière (Mafra/SC), feita para a equipe mostrar ao paciente durante a avaliação, no tablet, no celular ou no computador da clínica. É o mesmo comparador da página institucional (`Lumiere-Odonto-2`), sozinho e em tela cheia.

**Endereço:** https://eduardoschuman-glitch.github.io/Lumiere-Resultados/

## Como usar na clínica

- Arraste a linha sobre a foto para comparar. Os botões **Antes**, **Comparar** e **Depois** levam direto para cada posição.
- Troque de caso pelas miniaturas, pelas setas ou arrastando o dedo para o lado sobre o texto.
- Quando o paciente tem outras fotos, elas aparecem em **Mais fotos deste caso**, logo abaixo da foto. Toque na miniatura para abrir no comparador.
- O botão de linhas, no topo, esconde o texto para a foto ficar maior. O de cantos coloca em tela cheia.
- Para abrir direto em um caso, use o endereço com o código dele, por exemplo `.../Lumiere-Resultados/#caso-04`. Para a segunda foto de um caso, `#caso-01-2`.
- No tablet ou celular, use **Adicionar à tela de início** (Safari: compartilhar; Chrome: menu ⋮). A página vira um ícone, abre em tela cheia e, depois da primeira abertura com internet, funciona mesmo sem sinal. Enquanto está aberta, a tela não apaga sozinha.
- No computador: setas do teclado trocam de caso, `A` mostra o antes, `D` o depois e espaço volta para o meio.

## Como incluir um caso ou uma foto nova

Os casos seguem a ordem por tipo de tratamento: protocolos, prótese e facetas. Quando um paciente tem mais de uma foto, a primeira abre no comparador e as outras aparecem em "Mais fotos deste caso", logo abaixo. Na fileira de casos, esses pacientes têm o selo "2 fotos".

1. Alinhe o par antes e depois para os sorrisos se encaixarem (mesmo tamanho, mesma posição da boca) e salve em `assets/img` como `NOME-antes.webp` e `NOME-depois.webp`, com até 1200 px de largura. Foto extra de um caso leva `-2`, `-3` no nome (`caso-01-2`).
2. Em `assets/js/app.js`, na lista `CASES`, acrescente o caso na posição do tipo dele, ou acrescente `{ src: 'NOME', w: largura, h: altura }` nas `views` de um caso que já existe.
3. Ao trocar uma foto que já existe, aumente o `?v=` na função `img` de `assets/js/app.js`, para os aparelhos baixarem a nova.
4. Em `sw.js`, aumente a versão (`resultados-v4`, e assim por diante) e acrescente as fotos novas na lista, com o mesmo `?v=`.

Só entram fotos de pacientes que assinaram o termo de autorização de imagem.

## Arquivos

- `index.html`: estrutura da página
- `assets/css/style.css`: design system (Azul Lumière, Rosa Lumière, Off-White; Cambria/Caladea e Gotham/Montserrat)
- `assets/js/app.js`: casos e interações
- `manifest.webmanifest`, `sw.js` e `icons/`: ícone na tela de início e uso sem internet
