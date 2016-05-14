/* eslint-env jquery */

(() => {
  'use strict';

  const ws = new WebSocket('ws://localhost:3000/monitor/ws');
  ws.onmessage = event => {
    if (!event.data) return;

    const ret = JSON.parse(event.data);

    function sqlQuery(data) {
      console.log(data.sql);
      const $query = $('<div class="alert alert-success"></div>')
              .text(data.sql);

      return $query;
    }

    function sqlResult(data) {
      const rows = data.rows;

      console.log(rows);

      if (rows.length <= 0) {
        $('#retResultBox').empty().append('データなし');
        return $('<div>データなし</div>');
      }

      const fields = Object.keys(rows[0]);
      console.log(fields);

      const $table = $('<table class="table table-bordered table-striped"></table>');

      // <tr><th>id</th><th>name</th>...</tr>
      const $ths = fields.map(field => $('<th></th>').text(field));
      const $header = $('<tr></tr>').append($ths);
      $table.append($header);

      const $rows = rows.map(row => {
        const $tds = fields.map(field => $('<td></td>').text(row[field]));
        return $('<tr></tr>').append($tds);
      });
      $table.append($rows);

      return $table;
    }

    if (!ret.type) {
      console.log('データが空です');
    } else if (ret.type === 'sql/query') {
      $('#results').append(sqlQuery(ret));
    } else if (ret.type === 'sql/result') {
      $('#results').append(sqlResult(ret));
    }
  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
