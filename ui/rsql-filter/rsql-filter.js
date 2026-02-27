// RSQL Filter Builder - GLPI
(function () {
  const operators = [
    '==', '!=', '=in=', '=out=', '=lt=', '=le=', '=gt=', '=ge=', '=like=', '=ilike=', '=isnull=', '=isnotnull=', '=empty=', '=notempty='
  ];

  const noValueOps = new Set(['=isnull=', '=isnotnull=', '=empty=', '=notempty=']);

  const $ = (id) => document.getElementById(id);

  const fieldInput = $('fieldInput');
  const operatorSelect = $('operatorSelect');
  const valueInput = $('valueInput');
  const valueRow = $('valueRow');
  const addFilterBtn = $('addFilterBtn');
  const clearAllBtn = $('clearAllBtn');
  const filtersList = $('filtersList');
  const limitInput = $('limitInput');
  const resultDiv = $('result');
  const copyBtn = $('copyBtn');

  let filters = [];

  function populateOperators() {
    operatorSelect.innerHTML = '';
    operators.forEach((op) => {
      const opt = document.createElement('option');
      opt.value = op;
      opt.textContent = op;
      operatorSelect.appendChild(opt);
    });
  }

  function updateValueVisibility() {
    const op = operatorSelect.value;
    if (noValueOps.has(op)) {
      valueInput.disabled = true;
      valueInput.value = '';
      valueRow.classList.add('disabled');
    } else {
      valueInput.disabled = false;
      valueRow.classList.remove('disabled');
    }
  }

  function renderFilters() {
    filtersList.innerHTML = '';
    filters.forEach((f, i) => {
      const li = document.createElement('li');
      li.textContent = `${f.field}${f.operator}${f.value || ''}`;
      const btn = document.createElement('button');
      btn.textContent = 'Remover';
      btn.className = 'small';
      btn.addEventListener('click', () => {
        filters.splice(i, 1);
        renderFilters();
        updateResult();
      });
      li.appendChild(btn);
      filtersList.appendChild(li);
    });
  }

  function sanitizeField(s) {
    return String(s || '').trim();
  }

  function formatValueForOperator(op, val) {
    if (noValueOps.has(op)) return '';
    if (op === '=like=' || op === '=ilike=') {
      const v = String(val || '').trim();
      // ensure asterisks only once
      const hasLeading = v.startsWith('*');
      const hasTrailing = v.endsWith('*');
      return `${hasLeading ? '' : '*'}${v}${hasTrailing ? '' : '*'}`;
    }
    return String(val || '').trim();
  }

  function buildFilterString() {
    // combine with ; AND
    const parts = filters.map((f) => {
      const valPart = formatValueForOperator(f.operator, f.value);
      // If operator expects no value, format as field=op (no trailing =value)
      if (noValueOps.has(f.operator)) {
        return `${f.field}${f.operator}`;
      }
      return `${f.field}${f.operator}${valPart}`;
    });
    return parts.join(';');
  }

  function updateResult() {
    const filterString = buildFilterString();
    const limit = Math.max(1, parseInt(limitInput.value || '10', 10) || 10);
    // Output format required: ?filter=campo=operador=valor;campo2=operador2=valor2&limit=X
    const raw = `?filter=${filterString}&limit=${limit}`;
    resultDiv.textContent = raw;
  }

  addFilterBtn.addEventListener('click', () => {
    const field = sanitizeField(fieldInput.value);
    const operator = operatorSelect.value;
    const value = valueInput.value;
    if (!field) {
      alert('Informe o nome do campo.');
      return;
    }
    // For in/out operators we accept comma-separated values as-is
    const formattedValue = noValueOps.has(operator) ? '' : String(value || '').trim();
    filters.push({ field, operator, value: formattedValue });
    fieldInput.value = '';
    valueInput.value = '';
    renderFilters();
    updateResult();
  });

  operatorSelect.addEventListener('change', updateValueVisibility);
  limitInput.addEventListener('input', updateResult);
  clearAllBtn.addEventListener('click', () => {
    filters = [];
    fieldInput.value = '';
    valueInput.value = '';
    limitInput.value = '10';
    renderFilters();
    updateResult();
  });

  copyBtn.addEventListener('click', () => {
    const text = resultDiv.textContent || '';
    navigator.clipboard?.writeText(text).then(() => {
      copyBtn.textContent = 'Copiado';
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1500);
    }).catch(() => alert('Falha ao copiar.'));
  });

  // Init
  populateOperators();
  updateValueVisibility();
  updateResult();
})();
