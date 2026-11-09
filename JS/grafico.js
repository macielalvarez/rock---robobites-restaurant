// JS/grafico.js
(async function(){
  const TEMPLATE    = '../JSON/reservas_local.json';
  const STORAGE_KEY = 'reservas_local_turnos';
  const dias        = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const margin      = { top:20, right:20, bottom:50, left:40 };

  // 1) Carga y genera próximos 7 días
  const plantilla = await fetch(TEMPLATE).then(r=>r.json());
  function initData(){
    const hoy = new Date(), out = [];
    for(let i=0;i<7;i++){
      const d = new Date(hoy); d.setDate(hoy.getDate()+i);
      const name = dias[d.getDay()];
      const base = plantilla.find(x=> x.dia === name);
      if (!base) continue;
      const interior = {
        maxMesas:    base.interior.maxMesas,
        disponibles:{ ...base.interior.disponibles },
        reservas: {
          manana: [...base.interior.reservas.manana],
          noche:  [...base.interior.reservas.noche]
        }
      };
      const terraza = {
        maxMesas:    base.terraza.maxMesas,
        disponibles:{ ...base.terraza.disponibles },
        reservas: {
          manana: [...base.terraza.reservas.manana],
          noche:  [...base.terraza.reservas.noche]
        }
      };
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      out.push({
        fecha:   `${d.getFullYear()}-${mm}-${dd}`,
        dia:     name,
        mesDia:  `${dd}-${mm} ${name.slice(0,3)}`,
        interior,
        terraza
      });
    }
    return out;
  }

  // 2) Estado en localStorage
  let datos = localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(STORAGE_KEY))
    : initData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  const load = ()=> JSON.parse(localStorage.getItem(STORAGE_KEY));
  const save = d=> localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

  // 3) Calcula totales mañana/noche
  function computeTotals(){
    datos.forEach(d => {
      d.manana = d.interior.disponibles.manana + d.terraza.disponibles.manana;
      d.noche  = d.interior.disponibles.noche  + d.terraza.disponibles.noche;
    });
  }
  computeTotals();

  // 4) D3 responsivo
  function makeSvg(){
    d3.select('#chart').selectAll('svg').remove();
    const C = document.getElementById('chart');
    const totalW = C.clientWidth, totalH = C.clientHeight;
    const W = totalW - margin.left - margin.right;
    const H = totalH - margin.top - margin.bottom;
    const svg = d3.select('#chart')
      .append('svg')
        .attr('viewBox', `0 0 ${totalW} ${totalH}`)
        .attr('preserveAspectRatio','xMidYMid meet')
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    return { svg, W, H };
  }

  // 5) Dibuja gráfico apilado
  function drawChart(){
    datos = load();
    computeTotals();
    const { svg, W, H } = makeSvg();
    const x = d3.scaleBand().domain(datos.map(d=>d.mesDia)).range([0,W]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(datos, d=> d.manana + d.noche)]).nice().range([H,0]);
    const stack = d3.stack().keys(['manana','noche']);
    const series = stack(datos);

    svg.append('g')
      .attr('transform', `translate(0,${H})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform','rotate(-40)')
        .style('text-anchor','end');

    svg.append('g').call(d3.axisLeft(y));

    const grupos = svg.selectAll('g.layer').data(series).enter()
      .append('g')
        .attr('class','layer')
        .attr('fill', (_,i)=> i===0? '#69b3a2' : '#4C9AFF');

    grupos.selectAll('rect').data(d=>d).enter()
      .append('rect')
        .attr('x',     d=> x(d.data.mesDia))
        .attr('y',     d=> y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height',d=> y(d[0]) - y(d[1]))
        .style('cursor','pointer')
        .on('click', (_,d)=>{
          alert(
            `📅 ${d.data.mesDia} (${d.data.dia})\n\n`+
            `Turno mañana: ${d.data.manana} mesas libres\n`+
            `Turno noche:  ${d.data.noche} mesas libres`
          );
        });
  }

  // 6) Formulario y franjas
  const form    = document.getElementById('reserva-form');
  const inFecha = document.getElementById('fecha');
  const selHora = document.getElementById('hora');
  const inPax   = document.getElementById('personas');
  const radios  = document.getElementsByName('lugar');

  window.refrescaHorasYPax = ()=>{
    datos = load();
    const f = inFecha.value;
    const l = Array.from(radios).find(r=>r.checked).value;
    const day = datos.find(d=> d.fecha===f);
    if(!day) return;

    const dow = new Date(f).getDay();
    let m1,m2,n1,n2;
    if(dow>=1 && dow<=5){
      m1='13:00'; m2='17:00';
      n1='19:00'; n2='00:00';
    } else {
      m1='12:00'; m2='18:00';
      n1='18:00'; n2='01:00';
    }

    function rango(a,b){
      const R=[]; let cur=a;
      while(true){
        R.push(cur);
        const [hh,mm]=cur.split(':').map(Number);
        cur=`${String((hh+1)%24).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
        if(cur===b){ R.push(b); break; }
        if(a>b && cur===a) break;
      }
      return R;
    }

    const mat = rango(m1,m2), noc = rango(n1,n2);
    selHora.innerHTML = '';

    // Para cada hora, calculamos mesas usadas
    mat.concat(noc).forEach(h=>{
      const turno = mat.includes(h)? 'manana' : 'noche';
      // suma tablas usadas en interior+terraza
      const usedInt = day.interior.reservas[turno]
                        .reduce((s,r)=> s + Math.ceil(r.personas/2), 0);
      const usedTer = day.terraza.reservas[turno]
                        .reduce((s,r)=> s + Math.ceil(r.personas/2), 0);
      const freeInt = day.interior.maxMesas - usedInt;
      const freeTer = day.terraza.maxMesas - usedTer;
      if(freeInt > 0 || freeTer > 0){
        selHora.add(new Option(h,h));
      }
    });

    // max pax según mesas mínimas disponibles
    const lugar = Array.from(radios).find(r=>r.checked).value;
    const dayObj = datos.find(d=>d.fecha===inFecha.value);
    const totFree = (dayObj[lugar].disponibles.manana + dayObj[lugar].disponibles.noche);
    inPax.max = lugar==='interior'
      ? Math.min(8, totFree*2)
      : Math.min(2, totFree*2);
  };

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const f = inFecha.value;
    const h = selHora.value;
    const p = +inPax.value;
    const l = Array.from(radios).find(r=>r.checked).value;
    const day = datos.find(d=> d.fecha===f);
    if(!day) return alert('Selecciona primero una fecha.');

    // ¿mañana o noche?
    const hh  = +h.split(':')[0];
    const dow = new Date(f).getDay();
    const isMan = dow>=1 && dow<=5
      ? hh>=13 && hh<17
      : hh>=12 && hh<18;
    const turno = isMan ? 'manana' : 'noche';

    const neededTables = Math.ceil(p/2);
    if(day[l].disponibles[turno] < neededTables){
      return alert('No hay suficientes mesas para ese grupo.');
    }

    // guardamos
    day[l].reservas[turno].push({ hora:h, personas:p });
    day[l].disponibles[turno] -= neededTables;
    save(datos);
    drawChart();
    window.refrescaHorasYPax();
    alert('¡Reserva confirmada!');
  });

  // 7) Init
  inFecha.value = datos[0].fecha;
  drawChart();
  window.refrescaHorasYPax();
})();
