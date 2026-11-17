/* Editable trainee identity, preserved separately from evidence. */
(()=>{'use strict';
const STORE='portfolio-trainee-identity-v1';
let data={name:'',school:'',department:'',role:'',specialty:'',year:'',qualification:'',personalPage:5};
try{data={...data,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){}
const fields=[['name','الاسم'],['school','اسم المدرسة'],['department','الإدارة التعليمية'],['role','المسمى الوظيفي'],['specialty','التخصص'],['year','العام الدراسي'],['qualification','المؤهل العلمي']];
const css=document.createElement('style');
css.textContent=`
#identity-open{position:fixed;bottom:18px;left:15px;z-index:9999;border:0;border-radius:12px;background:#624b7a;color:white;padding:12px 18px;font-weight:bold;box-shadow:0 3px 12px #0005}
#identity-panel{display:none;position:fixed;inset:0;z-index:100000;background:#0009;align-items:center;justify-content:center;padding:12px}
#identity-panel .identity-inner{direction:rtl;text-align:right;background:white;color:#292332;width:min(520px,100%);max-height:90vh;overflow:auto;padding:20px;border-radius:15px}
#identity-panel label{display:block;margin:9px 0;font-size:14px}#identity-panel input,#identity-panel select{display:block;width:100%;padding:9px;border:1px solid #bcb1c9;border-radius:7px;margin-top:4px}
#identity-panel button{border:0;background:#624b7a;color:white;padding:11px 18px;border-radius:8px;margin:8px 5px 0}
.identity-text{position:absolute;z-index:10;direction:rtl;text-align:center;pointer-events:none;color:#302639;font-family:Arial,sans-serif;line-height:1.4;text-shadow:0 1px 2px #fff9;white-space:pre-wrap;overflow-wrap:anywhere}
.identity-cover{display:none!important}
.female-cover-fields{position:absolute;z-index:20;left:18%;bottom:43.8%;width:64%;height:11.8%;display:flex;flex-direction:column;justify-content:center;gap:8%;padding:1.5% 3%;background:#f4e5f2;border:1px solid #d3ad70;border-radius:22px;box-sizing:border-box;direction:rtl}
.female-cover-pill{display:flex;align-items:center;gap:3%;height:43%;padding:0 4%;border-radius:999px;background:white;border:1px solid #d3ad70;box-sizing:border-box;overflow:hidden}
.female-cover-label{flex:0 0 auto;font-family:Tahoma,Arial,sans-serif;color:#59416b;font-size:clamp(17px,3.4vw,25px);font-weight:700;white-space:nowrap}
.female-cover-value{flex:1;min-width:0;direction:rtl;text-align:right;color:#59416b;font-family:Tahoma,Arial,sans-serif;font-size:var(--female-cover-size,18px);font-weight:700;white-space:nowrap;overflow:hidden;outline:0}
.female-cover-clear{flex:0 0 auto;width:24px;height:24px;border:0;border-radius:50%;background:#f1e8ee;color:#59416b;font-size:19px;line-height:22px;text-align:center;padding:0}
#female-font-tools{position:fixed;right:12px;bottom:16px;z-index:9998;display:flex;align-items:center;gap:7px;background:white;border:1px solid #d3ad70;border-radius:12px;padding:7px;box-shadow:0 2px 12px #0003;direction:rtl}
#female-font-tools button{border:0;border-radius:8px;background:#624b7a;color:white;font-size:19px;min-width:38px;height:36px;padding:0}
#female-font-tools span{font-size:12px;color:#59416b}
@media print{#female-font-tools,.female-cover-clear{display:none!important}.female-cover-fields{-webkit-print-color-adjust:exact;print-color-adjust:exact}.female-cover-value{font-size:39px!important}.female-cover-label{font-size:28px!important}}
.identity-personal{left:13%;width:74%;top:35%;font-size:clamp(10px,1.3vw,17px);background:#ffffffb8;border-radius:5px;padding:2%}
@media print{#identity-open,#identity-panel{display:none!important}.identity-text{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;
document.head.append(css);
let coverSize=18;try{coverSize=Math.max(12,Math.min(30,Number(localStorage.getItem('female-cover-size')||18)))}catch(e){}document.documentElement.style.setProperty('--female-cover-size',coverSize+'px');
const fontTools=document.createElement('div');fontTools.id='female-font-tools';fontTools.innerHTML='<span>حجم خط الغلاف</span><button type="button" aria-label="تكبير">+</button><button type="button" aria-label="تصغير">−</button>';document.body.append(fontTools);const changeSize=d=>{coverSize=Math.max(12,Math.min(30,coverSize+d));document.documentElement.style.setProperty('--female-cover-size',coverSize+'px');try{localStorage.setItem('female-cover-size',coverSize)}catch(e){}};fontTools.querySelectorAll('button')[0].onclick=()=>changeSize(2);fontTools.querySelectorAll('button')[1].onclick=()=>changeSize(-2);
const open=document.createElement('button');open.id='identity-open';open.type='button';open.textContent='بياناتي';document.body.append(open);
const panel=document.createElement('div');panel.id='identity-panel';
panel.innerHTML='<div class="identity-inner"><h3>بيانات المتدرب / المتدربة</h3><p>تظهر بيانات الاسم والمدرسة على الغلاف، وتظهر البيانات المهنية في صفحة البيانات الشخصية.</p><div id="identity-fields"></div><label>رقم صفحة البيانات الشخصية<select id="identity-page"></select></label><button id="identity-save" type="button">حفظ البيانات</button><button id="identity-close" type="button">إغلاق</button></div>';
document.body.append(panel);
const holder=panel.querySelector('#identity-fields');
fields.forEach(([key,label])=>{const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.dataset.key=key;input.value=data[key]||'';l.append(input);holder.append(l)});
const sel=panel.querySelector('#identity-page');for(let i=2;i<=23;i++){const o=document.createElement('option');o.value=i;o.textContent='الصفحة '+i;sel.append(o)}sel.value=data.personalPage;
open.onclick=()=>{panel.style.display='flex'};panel.querySelector('#identity-close').onclick=()=>panel.style.display='none';
function update(){
document.querySelectorAll('.identity-text').forEach(n=>n.remove());
const roots=[document.getElementById('pages'),document.getElementById('printRoot')].filter(Boolean);
roots.forEach(root=>{const sheets=[...root.querySelectorAll('.sheet')];if(!sheets.length)return;
function put(index,cls,txt){const sheet=sheets[index];if(!sheet)return;const page=sheet.querySelector('.page')||sheet;const n=document.createElement('div');n.className='identity-text '+cls;n.textContent=txt;page.append(n)}
const first=sheets[0];if(first){const page=first.querySelector('.page')||first;let cover=page.querySelector('.female-cover-fields');if(!cover){cover=document.createElement('div');cover.className='female-cover-fields';[['name','الاسم'],['school','المدرسة']].forEach(([key,label])=>{const pill=document.createElement('div');pill.className='female-cover-pill';const cap=document.createElement('span');cap.className='female-cover-label';cap.textContent=label+' /';const value=document.createElement('div');value.className='female-cover-value';value.contentEditable=root.id!=='printRoot'?'true':'false';value.dataset.key=key;value.setAttribute('aria-label',label);value.addEventListener('input',()=>{data[key]=value.textContent||'';try{localStorage.setItem(STORE,JSON.stringify(data))}catch(e){}const form=panel.querySelector('[data-key="'+key+'"]');if(form)form.value=data[key]});const clear=document.createElement('button');clear.type='button';clear.className='female-cover-clear';clear.textContent='×';clear.setAttribute('aria-label','حذف '+label);clear.onclick=()=>{value.textContent='';value.dispatchEvent(new Event('input'));value.focus()};pill.append(cap,value,clear);cover.append(pill)});page.append(cover)}cover.querySelectorAll('.female-cover-value').forEach(value=>{if(document.activeElement!==value)value.textContent=data[value.dataset.key]||''})}
const lines=fields.map(([k,label])=>data[k]?label+' : '+data[k]:null).filter(Boolean);
if(lines.length)put(Math.max(1,Math.min(22,Number(data.personalPage||5)-1)),'identity-personal',lines.join('\n'));
});
}
panel.querySelector('#identity-save').onclick=()=>{fields.forEach(([k])=>data[k]=panel.querySelector('[data-key="'+k+'"]').value.trim());data.personalPage=Number(sel.value);try{localStorage.setItem(STORE,JSON.stringify(data))}catch(e){alert('تعذر حفظ البيانات: مساحة التخزين ممتلئة');return}update();panel.style.display='none'};
let pending=false;const observer=new MutationObserver(mutations=>{if(pending)return;if(!mutations.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.sheet')||n.querySelector?.('.sheet')))))return;pending=true;requestAnimationFrame(()=>{pending=false;update()})});
observer.observe(document.body,{childList:true,subtree:true});update();window.addEventListener('beforeprint',update);
})();