# Construtor RSQL (GLPI)

Componente standalone para construir strings de filtro RSQL destinadas à API do GLPI.

Como usar
- Abra `ui/rsql-filter/index.html` num navegador.
- Preencha `Campo`, escolha o `Operador` e, quando aplicável, informe o `Valor`.
- Clique em `Adicionar Filtro` para inserir o critério na lista.
- Ajuste `Limit` (padrão 10).
- Resultado exibido no formato: `?filter=campo=operador=valor;campo2=...&limit=X`.

Regras importantes
- Operadores sem valor: `=isnull=`, `=isnotnull=`, `=empty=`, `=notempty=` — o campo `Valor` é desabilitado.
- Para `=like=` e `=ilike=` o valor é encapsulado automaticamente em `*valor*` ao gerar a query.
- Os itens são combinados com `;` (AND lógico).
- Não há menções a `start` ou `sort` no output.

Observações
- O componente é standalone (HTML/JS/CSS) e fácil de integrar ou adaptar para frameworks.
