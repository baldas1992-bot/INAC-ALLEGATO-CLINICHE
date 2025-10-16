(function(){
  function computeTags(r){
    var s = (r.servizi||'') + ' ' + (r.struttura||'');
    s = s.toLowerCase();
    var tags = [];
    if(/rm|risonanza|\btc\b|\btac\b|\brx\b|radiologia|ecografia|diagnostica per immagini/.test(s)) tags.push('Imaging');
    if(/\bemg\b|elettromiografia|\beng\b/.test(s)) tags.push('EMG/ENG');
    if(/otorino|\borl\b|audiometr/.test(s)) tags.push('ORL/Audiometria');
    if(/dermatolog/.test(s)) tags.push('Dermatologia');
    if(/neurolog/.test(s)) tags.push('Neurologia');
    if(/oculistic/.test(s)) tags.push('Oculistica');
    var isPub = (/\baou\b|\bao\s|ospedale|\busl\b|azienda ospedal|policlinico|ssn/).test(s);
    var isAccr = (/accreditat/).test(s);
    var natura = isPub ? 'Pubblico' : (isAccr ? 'Privato accreditato' : 'Privato');
    var modalita = (/intramoenia|\balp\b|\balpi\b/.test(s) || /libera professione/.test(s)) ? 'Intramoenia' : 'Istituzionale/Privato';
    r.natura = r.natura || natura;
    r.modalita = r.modalita || modalita;
  }

  function buildCityOptions(){
    var sel = document.getElementById('city');
    var cities = {};
    for(var i=0;i<DATA.length;i++){ cities[DATA[i].citta]=true; computeTags(DATA[i]); }
    var html = '<option value=\"\">Tutte le città</option>';
    var list = Object.keys(cities).sort();
    for(var j=0;j<list.length;j++) html += '<option>'+list[j]+'</option>';
    sel.innerHTML = html;
  }

  var sortKey = 'citta', sortDir = 1;
  function sortRows(arr){
    return arr.sort(function(a,b){
      var va = (a[sortKey]||'').toString().toLowerCase();
      var vb = (b[sortKey]||'').toString().toLowerCase();
      if(va<vb) return -1*sortDir; if(va>vb) return 1*sortDir; return 0;
    });
  }

  function telLink(text){
    if(!text) return '';
    var parts = (''+text).split(/·|;|,|\||\s{2,}/);
    var out = [];
    for(var i=0;i<parts.length;i++){
      var p = (parts[i]||'').trim();
      if(p) out.push(p);
    }
    return out.join(' · ');
  }

  function render(){
    var q = document.getElementById('q').value;
    var city = document.getElementById('city').value;
    var natura = document.getElementById('natura').value;

    var rows = [];
    for(var i=0;i<DATA.length;i++){
      var r = DATA[i];
      if(city && r.citta!==city) continue;
      if(natura && r.natura!==natura) continue;
      if(q){
        var text = (r.citta+' '+r.struttura+' '+(r.servizi||'')+' '+(r.indirizzo||'')+' '+(r.tel||'')+' '+(r.note||'')).toLowerCase();
        if(text.indexOf(q.toLowerCase())===-1) continue;
      }
      rows.push(r);
    }
    sortRows(rows);
    var tbody = document.getElementById('rows');
    var html = '';
    for(var i=0;i<rows.length;i++){
      var r = rows[i];
      html += '<tr>' +
              '<td>'+ (r.citta||'') +'</td>' +
              '<td><strong>'+ (r.struttura||'') +'</strong></td>' +
              '<td>'+ (r.servizi||'') +'</td>' +
              '<td>'+ (r.indirizzo||'') +'</td>' +
              '<td>'+ (telLink(r.tel)||'') + (r.tel&&r.tel.indexOf('CUP')>=0 ? ' <span class=\"badge\">CUP</span>' : '') +'</td>' +
              '<td>'+ (r.note||'') +'</td>' +
              '</tr>';
    }
    tbody.innerHTML = html || '<tr><td colspan="6" class="note">Nessun risultato con i filtri correnti.</td></tr>';
    document.getElementById('count').textContent = rows.length + ' risultati';
  }

  document.addEventListener('DOMContentLoaded', function(){
    buildCityOptions(); render();
    document.getElementById('q').addEventListener('input', function(){ render(); });
    document.getElementById('city').addEventListener('change', render);
    document.getElementById('natura').addEventListener('change', render);
    document.getElementById('reset').addEventListener('click', function(){
      document.getElementById('q').value='';
      document.getElementById('city').value='';
      document.getElementById('natura').value='';
      render();
    });
  });
})();