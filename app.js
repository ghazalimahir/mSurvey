const modules=[
['bgcoord','BG/JK ke Koordinat','Hitung koordinat baharu daripada koordinat, bearing dan jarak.',1],
['coordbg','Koordinat ke BG/JK','Hitung bearing dan jarak antara dua titik.',1],
['mid','Titik Tengah','Hitung koordinat titik tengah dua titik.',1],
['area','Koordinat ke Luas','Hitung luas poligon daripada senarai koordinat.',1],
['intersection','Titik Persilangan','Persilangan dua garisan melalui dua pasangan titik.',1],
['circle','Pusat Bulatan','Pusat bulatan melalui tiga titik.',1],
['level','Ukur Aras','Kaedah tinggi kolimatan asas.',1],
['traverse','Ukur Trabas','Hitung garisan penutup daripada beberapa bearing dan jarak.',1],['missing','Hilang ke Jarak','Modul asal menunggu pengesahan formula APK.',0],['equal','Sekan Lebar Sama','Modul asal menunggu pengesahan formula APK.',0],['unequal','Sekan Lebar Beza','Modul asal menunggu pengesahan formula APK.',0],['angle','Sudut Dalam','Modul asal menunggu pengesahan formula APK.',0]];
const menu=document.querySelector('#menu'),panel=document.querySelector('#panel');
modules.forEach(m=>{const d=document.createElement('article');d.className='card';d.innerHTML=`<h2>${m[1]}</h2><p>${m[2]}</p><span class="tag ${m[3]?'':'pending'}">${m[3]?'Berfungsi':'Belum disahkan'}</span>`;d.onclick=()=>openModule(m[0]);menu.appendChild(d)});
function degFromDms(v){v=Number(v);if(!isFinite(v))throw Error('Bearing tidak sah');const sign=v<0?-1:1;v=Math.abs(v);const d=Math.floor(v),frac=(v-d)*100,m=Math.floor(frac+1e-9),s=(frac-m)*100;if(m>=60||s>=60)throw Error('Minit/saat mesti kurang 60');return sign*(d+m/60+s/3600)}
function dmsFromDeg(v){v=(v%360+360)%360;let d=Math.floor(v),mm=(v-d)*60,m=Math.floor(mm),s=(mm-m)*60;s=Math.round(s*100)/100;if(s>=60){s=0;m++}if(m>=60){m=0;d=(d+1)%360}return `${String(d).padStart(3,'0')}.${String(m).padStart(2,'0')}${s.toFixed(2).padStart(5,'0')}`}
const n=id=>{const v=Number(document.getElementById(id).value);if(!isFinite(v))throw Error('Lengkapkan semua nilai');return v};
function shell(title,body,calc){menu.classList.add('hidden');panel.classList.remove('hidden');panel.innerHTML=`<div class="toolbar"><h2>${title}</h2><button class="secondary" onclick="home()">Menu</button></div>${body}<div class="actions"><button onclick="${calc}()">Kira</button><button class="secondary" onclick="clearResult()">Padam keputusan</button></div><div id="result" class="result">Sedia.</div>`}
function fields(arr){return `<div class="fields">${arr.map(x=>`<label>${x[1]}<input id="${x[0]}" inputmode="decimal" placeholder="${x[2]||''}"></label>`).join('')}</div>`}
function openModule(id){if(id==='bgcoord')shell('BG/JK ke Koordinat',fields([['n1','Utara/Northing 1'],['e1','Timur/Easting 1'],['b','Bearing DDD.MMSS','123.4530'],['d','Jarak']]),'calcBgCoord');else if(id==='coordbg')shell('Koordinat ke BG/JK',fields([['n1','Utara 1'],['e1','Timur 1'],['n2','Utara 2'],['e2','Timur 2']]),'calcCoordBg');else if(id==='mid')shell('Titik Tengah',fields([['n1','Utara 1'],['e1','Timur 1'],['n2','Utara 2'],['e2','Timur 2']]),'calcMid');else if(id==='intersection')shell('Titik Persilangan',fields([['x1','Easting A1'],['y1','Northing A1'],['x2','Easting A2'],['y2','Northing A2'],['x3','Easting B1'],['y3','Northing B1'],['x4','Easting B2'],['y4','Northing B2']]),'calcIntersection');else if(id==='circle')shell('Pusat Bulatan',fields([['x1','Easting 1'],['y1','Northing 1'],['x2','Easting 2'],['y2','Northing 2'],['x3','Easting 3'],['y3','Northing 3']]),'calcCircle');else if(id==='level')shell('Ukur Aras',fields([['rl','Aras laras/RL diketahui'],['bs','Pandangan belakang (BS)'],['is','Pandangan tengah/depan (IS/FS)']]),'calcLevel');else if(id==='traverse'){shell('Ukur Trabas',`<p class="help">Masukkan setiap garisan trabas. Gunakan format bearing <b>DDD.MMSS</b>.</p><div class="table-wrap"><table class="traverse-table"><thead><tr><th>No.</th><th>Bearing</th><th>Jarak</th><th></th></tr></thead><tbody id="traverseRows"></tbody></table></div><div class="row-actions"><button type="button" class="secondary" onclick="addTraverseRow()">+ Tambah Garisan</button><button type="button" class="secondary" onclick="resetTraverseRows()">Kosongkan Semua</button></div>`,'calcTraverse');addTraverseRow('073.1330','115.990');addTraverseRow('171.3750','124.575');}else if(id==='area')shell('Koordinat ke Luas','<label>Koordinat (satu titik setiap baris: Easting,Northing)<textarea id="coords" rows="10" placeholder="1000,1000\n1100,1000\n1100,1050\n1000,1050"></textarea></label><br>','calcArea');else shell(modules.find(m=>m[0]===id)?.[1]||'Modul','<p>Formula modul ini belum dapat disahkan sepenuhnya daripada APK asal. Ia sengaja tidak diaktifkan bagi mengelakkan keputusan ukur yang salah.</p>','notReady')}
function out(t){document.getElementById('result').textContent=t}function safe(fn){try{fn()}catch(e){out('Ralat: '+e.message)}}

function dmsWholeSecond(v){v=(v%360+360)%360;let total=Math.round(v*3600);total%=1296000;const d=Math.floor(total/3600),m=Math.floor((total%3600)/60),sec=total%60;return `${String(d).padStart(3,'0')}.${String(m).padStart(2,'0')}${String(sec).padStart(2,'0')}`}
let traverseRowCount=0;
function addTraverseRow(bearing='',distance=''){
  const tbody=document.getElementById('traverseRows');
  if(!tbody)return;
  traverseRowCount++;
  const tr=document.createElement('tr');
  tr.innerHTML=`<td class="row-no"></td><td><input class="traverse-bearing" inputmode="decimal" placeholder="073.1330" value="${bearing}" aria-label="Bearing garisan"></td><td><input class="traverse-distance" inputmode="decimal" placeholder="115.990" value="${distance}" aria-label="Jarak garisan"></td><td><button type="button" class="danger compact" onclick="removeTraverseRow(this)" aria-label="Buang garisan">×</button></td>`;
  tbody.appendChild(tr);
  renumberTraverseRows();
}
function removeTraverseRow(btn){
  const tbody=document.getElementById('traverseRows');
  if(!tbody)return;
  if(tbody.rows.length<=1){tbody.querySelectorAll('input').forEach(i=>i.value='');return;}
  btn.closest('tr').remove();
  renumberTraverseRows();
}
function renumberTraverseRows(){document.querySelectorAll('#traverseRows tr').forEach((tr,i)=>tr.querySelector('.row-no').textContent=i+1)}
function resetTraverseRows(){const tbody=document.getElementById('traverseRows');if(!tbody)return;tbody.innerHTML='';traverseRowCount=0;addTraverseRow();clearResult()}
function calcTraverse(){safe(()=>{
  const rows=[...document.querySelectorAll('#traverseRows tr')];
  const lines=[];
  for(const [i,row] of rows.entries()){
    const btxt=row.querySelector('.traverse-bearing').value.trim();
    const dtxt=row.querySelector('.traverse-distance').value.trim();
    if(!btxt&&!dtxt)continue;
    if(!btxt||!dtxt)throw Error(`Lengkapkan bearing dan jarak pada garisan ${i+1}`);
    const bearing=degFromDms(Number(btxt));
    const distance=Number(dtxt);
    if(!isFinite(distance)||distance<0)throw Error(`Jarak garisan ${i+1} tidak sah`);
    const rad=bearing*Math.PI/180;
    lines.push({no:i+1,bearing,distance,dn:distance*Math.cos(rad),de:distance*Math.sin(rad)});
  }
  if(lines.length<2)throw Error('Masukkan sekurang-kurangnya 2 garisan');
  const sumN=lines.reduce((s,l)=>s+l.dn,0),sumE=lines.reduce((s,l)=>s+l.de,0);
  const closeN=-sumN,closeE=-sumE,dist=Math.hypot(closeN,closeE),az=Math.atan2(closeE,closeN)*180/Math.PI;
  const details=lines.map(l=>`${String(l.no).padStart(2,'0')}  ΔN ${l.dn.toFixed(4).padStart(11)}   ΔE ${l.de.toFixed(4).padStart(11)}`).join('\n');
  out(`${details}
-----------------------------------
Jumlah ΔN = ${sumN.toFixed(4)}
Jumlah ΔE = ${sumE.toFixed(4)}

Bearing penutup = ${dmsWholeSecond(az)} (1″ terhampir)
Jarak penutup = ${dist.toFixed(3)}
ΔN penutup = ${closeN.toFixed(4)}
ΔE penutup = ${closeE.toFixed(4)}`)
})}
function calcBgCoord(){safe(()=>{const a=degFromDms(n('b'))*Math.PI/180,D=n('d');out(`Northing 2 = ${(n('n1')+D*Math.cos(a)).toFixed(4)}\nEasting 2  = ${(n('e1')+D*Math.sin(a)).toFixed(4)}`)})}
function calcCoordBg(){safe(()=>{const dn=n('n2')-n('n1'),de=n('e2')-n('e1'),dist=Math.hypot(dn,de),az=Math.atan2(de,dn)*180/Math.PI;out(`Bearing DDD.MMSS = ${dmsFromDeg(az)}\nBearing decimal = ${((az%360+360)%360).toFixed(8)}°\nJarak = ${dist.toFixed(4)}`)})}
function calcMid(){safe(()=>out(`Northing tengah = ${((n('n1')+n('n2'))/2).toFixed(4)}\nEasting tengah  = ${((n('e1')+n('e2'))/2).toFixed(4)}`))}
function calcLevel(){safe(()=>{const hi=n('rl')+n('bs');out(`Tinggi kolimatan = ${hi.toFixed(4)}\nAras titik = ${(hi-n('is')).toFixed(4)}`)})}
function calcArea(){safe(()=>{const pts=document.getElementById('coords').value.trim().split(/\n+/).map(l=>l.split(/[ ,;]+/).map(Number));if(pts.length<3||pts.some(p=>p.length<2||p.some(x=>!isFinite(x))))throw Error('Masukkan sekurang-kurangnya 3 titik yang sah');let a=0;pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1]});out(`Luas = ${Math.abs(a/2).toFixed(4)} unit²\nBilangan titik = ${pts.length}`)})}
function calcIntersection(){safe(()=>{const x1=n('x1'),y1=n('y1'),x2=n('x2'),y2=n('y2'),x3=n('x3'),y3=n('y3'),x4=n('x4'),y4=n('y4');const den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);if(Math.abs(den)<1e-12)throw Error('Garisan selari atau bertindih');const t=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/den,u=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/den;out(`Easting = ${t.toFixed(4)}\nNorthing = ${u.toFixed(4)}`)})}
function calcCircle(){safe(()=>{const x1=n('x1'),y1=n('y1'),x2=n('x2'),y2=n('y2'),x3=n('x3'),y3=n('y3');const d=2*(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2));if(Math.abs(d)<1e-12)throw Error('Tiga titik segaris');const ux=((x1*x1+y1*y1)*(y2-y3)+(x2*x2+y2*y2)*(y3-y1)+(x3*x3+y3*y3)*(y1-y2))/d;const uy=((x1*x1+y1*y1)*(x3-x2)+(x2*x2+y2*y2)*(x1-x3)+(x3*x3+y3*y3)*(x2-x1))/d;out(`Easting pusat = ${ux.toFixed(4)}\nNorthing pusat = ${uy.toFixed(4)}\nJejari = ${Math.hypot(ux-x1,uy-y1).toFixed(4)}`)})}
function notReady(){out('Belum diaktifkan — menunggu pengesahan formula asal.')}function clearResult(){out('Sedia.')}function home(){panel.classList.add('hidden');menu.classList.remove('hidden')}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=031');let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;installBtn.hidden=false});installBtn.onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;installBtn.hidden=true}};
