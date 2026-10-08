# Instituto Lumière · Resultados

Página de antes e depois do Instituto Lumière (Mafra/SC), feita para a equipe mostrar ao paciente durante a avaliação, no tablet, no celular ou no computador da clínica. É o mesmo comparador da página institucional (`Lumiere-Odonto-2`), sozinho e em tela cheia.

**Endereço:** https://eduardoschuman-glitch.github.io/Lumiere-Resultados/

## Como usar na clínica

- Arraste a linha sobre a foto para comparar. Os botões **Antes**, **Comparar** e **Depois** levam direto para cada posição.
- Troque de caso pelas miniaturas, pelas setas ou arrastando o dedo para o lado sobre o texto.
- O botão de linhas, no topo, esconde o texto para a foto ficar maior. O de cantos coloca em tela cheia.
- Para abrir direto em um caso, use o endereço com o código dele, por exemplo `.../Lumiere-Resultados/#caso-04`.
- No tablet ou celular, use **Adicionar à tela de início** (Safari: compartilhar; Chrome: menu ⋮). A página vira um ícone, abre em tela cheia e, depois da primeira abertura com internet, funciona mesmo sem sinal. Enquanto está aberta, a tela não apaga sozinha.
- No computador: setas do teclado trocam de caso, `A` mostra o antes, `D` o depois e espaço volta para o meio.

## Como incluir um caso novo

1. Salve as duas fotos, com o mesmo tamanho e enquadramento, em `assets/img` como `caso-XX-antes.webp` e `caso-XX-depois.webp` (largura de 1200 px).
2. Acrescente o caso na lista `CASES`, no começo de `assets/js/app.js`, com tipo de tratamento, título e texto.
3. Em `sw.js`, aumente a versão (`resultados-v2`) e acrescente as duas fotos na lista.

Só entram fotos de pacientes que assinaram o termo de autorização de imagem.

## Arquivos

- `index.html`: estrutura da página
- `assets/css/style.css`: design system (Azul Lumière, Rosa Lumière, Off-White; Cambria/Caladea e Gotham/Montserrat)
- `assets/js/app.js`: casos e interações
- `manifest.webmanifest`, `sw.js` e `icons/`: ícone na tela de início e uso sem internet
