/* Datos de ejemplo para el modo demo (antes de conectar la Sheet). El material real llega desde Drive. */
'use strict';
const DEMO = (() => {
  const R = String.raw;
  const hoy = new Date();
  const iso = (dd, h = 9) => { const d = new Date(hoy); d.setDate(d.getDate() + dd); d.setHours(h, 0, 0, 0); return d.toISOString(); };
  const dia = dd => iso(dd).slice(0, 10);

  const estudio = {
    'vof-m1': {
      tipo: 'semestre-estudio', version: 1, semestre: '2026-1', asignatura: 'vof', modulo: 'vof-m1',
      titulo: 'Règims financers', material: 'PID_00166346', generado: '2026-11-16',
      temas: [
        {
          id: 'vof-m1-t4', titulo: "Règim financer d'interès compost a tipus constant",
          resumen: R`<p>En capitalització composta els interessos de cada període s'afegeixen al capital i generen nous interessos.</p>
<h4>Capitalitzar i actualitzar</h4>
$$C_n = C_0\,(1+i)^n$$
$$C_0 = C_n\,(1+i)^{-n}$$
<p>El tipus $i$ i el nombre de períodes $n$ han d'estar sempre en la mateixa unitat de temps.</p>
<h4>Tipus nominal i efectiu</h4>
<p>Un tipus nominal anual $j_m$ es capitalitza $m$ vegades l'any. El tipus efectiu del subperíode és</p>
$$i_m = \dfrac{j_m}{m}$$
<p>i el tipus efectiu anual equivalent:</p>
$$i = (1+i_m)^m - 1$$
<h4>Tipus equivalents</h4>
<p>Dos tipus són equivalents si, aplicats al mateix capital durant el mateix temps, donen el mateix capital final: $(1+i) = (1+i_m)^m$.</p>
<ul><li>Si $m>1$, el tipus efectiu anual sempre és més gran que el nominal: $i > j_m$.</li><li>De mensual a anual: $i=(1+i_{12})^{12}-1$. D'anual a mensual: $i_{12}=(1+i)^{1/12}-1$.</li></ul>`,
          tarjetas: [
            { id: 'vof-m1-t4-c1', pregunta: 'Fórmula del capital final en interès compost a tipus constant', respuesta: R`$$C_n = C_0\,(1+i)^n$$` },
            { id: 'vof-m1-t4-c2', pregunta: 'Com actualitzes un capital $C_n$ al moment 0?', respuesta: R`$$C_0 = C_n\,(1+i)^{-n}$$` },
            { id: 'vof-m1-t4-c3', pregunta: R`Com passes d'un tipus nominal $j_{12}$ al tipus efectiu anual?`, respuesta: R`Primer el tipus mensual $i_{12} = \dfrac{j_{12}}{12}$ i després $i = (1+i_{12})^{12}-1$.` },
            { id: 'vof-m1-t4-c4', pregunta: 'Quan són equivalents dos tipus efectius $i$ i $i_m$?', respuesta: R`Quan $(1+i) = (1+i_m)^m$: amb el mateix capital i la mateixa durada donen el mateix capital final.` },
            { id: 'vof-m1-t4-c5', pregunta: R`Un 6 % nominal amb capitalització mensual: quin tipus efectiu anual és?`, respuesta: R`$i_{12}=0{,}005 \Rightarrow i=(1{,}005)^{12}-1=6{,}17\,\%$. Més alt que el nominal.` }
          ],
          ejercicios: [
            {
              id: 'vof-m1-t4-e1', tipo: 'calculo',
              enunciado: R`Ingresses 5.000 € en un dipòsit al 4 % nominal anual amb capitalització trimestral durant 3 anys. Quin capital tindràs al final i quin és el tipus efectiu anual?`,
              pasos: [
                { titulo: 'Classificar', texto: R`Capitalització en règim d'interès compost a tipus constant, amb un sol capital: $C_0 = 5.000$.` },
                { titulo: 'Esquema temporal', texto: R`Període trimestral: $n = 3 \cdot 4 = 12$ trimestres. $C_0$ a $t=0$ i $C_{12}$ a $t=12$.` },
                { titulo: 'Convertir el tipus', texto: R`$$j_4 = 0{,}04 \;\Rightarrow\; i_4 = \dfrac{0{,}04}{4} = 0{,}01$$` },
                { titulo: 'Plantejar i resoldre', texto: R`$$\begin{aligned} C_{12} &= 5.000\,(1{,}01)^{12} \\ &= 5.000 \cdot 1{,}126825 \\ &= 5.634{,}13\ \text{€} \end{aligned}$$` },
                { titulo: 'Tipus efectiu anual', texto: R`$$i = (1{,}01)^4 - 1 = 0{,}040604 \;\Rightarrow\; 4{,}06\,\%$$` }
              ],
              resultado: R`El capital final és de 5.634,13 € i el tipus efectiu anual, del 4,06 %.`
            }
          ]
        },
        {
          id: 'vof-m1-t6', titulo: "TAE d'una operació financera de finançament",
          resumen: R`<p>La TAE és el tipus efectiu anual que iguala financerament el que reps (prestació) i el que pagues (contraprestació).</p>
<h4>Com es planteja</h4>
<ol><li>Prestació neta: el capital rebut menys les comissions que pagues al principi.</li><li>Equació d'equivalència: prestació neta = valor actual dels pagaments.</li><li>Resols el tipus del període i l'anualitzes.</li></ol>
$$C_0 - G_0 = \sum_{s=1}^{n} a_s\,(1+i_m)^{-s}$$
$$\text{TAE} = (1+i_m)^m - 1$$`,
          tarjetas: [
            { id: 'vof-m1-t6-c1', pregunta: 'Què es resta de la prestació quan calcules la TAE?', respuesta: "Les comissions i despeses que paga el prestatari a l'inici (per exemple, la comissió d'obertura)." },
            { id: 'vof-m1-t6-c2', pregunta: 'Per què la TAE amb comissions és més alta que el tipus pactat?', respuesta: 'Perquè reps menys diners (prestació neta més petita) però retornes el mateix.' }
          ],
          ejercicios: [
            {
              id: 'vof-m1-t6-e1', tipo: 'calculo',
              enunciado: R`Et presten 10.000 € a tornar d'un sol cop d'aquí a 2 anys amb 11.025 €. Hi ha una comissió d'obertura de 100 €. Calcula la TAE.`,
              pasos: [
                { titulo: 'Classificar', texto: 'Préstec amb un sol reemborsament i comissió inicial: TAE per equivalència financera.' },
                { titulo: 'Prestació neta', texto: R`$$10.000 - 100 = 9.900\ \text{€}$$` },
                { titulo: 'Plantejar', texto: R`$$9.900 = 11.025\,(1+i)^{-2}$$` },
                { titulo: 'Resoldre', texto: R`$$(1+i)^2 = \dfrac{11.025}{9.900} = 1{,}113636 \;\Rightarrow\; i = 0{,}055290$$` }
              ],
              resultado: R`TAE = 5,53 %. Sense la comissió seria del 5 %.`
            }
          ]
        }
      ]
    },
    'vof-m2': {
      tipo: 'semestre-estudio', version: 1, semestre: '2026-1', asignatura: 'vof', modulo: 'vof-m2',
      titulo: 'Rendes', generado: '2026-11-16',
      temas: [
        {
          id: 'vof-m2-t1', titulo: 'Rendes constants',
          resumen: R`<p>Una renda és un conjunt de capitals amb venciments periòdics. Si tots els termes són iguals, és constant.</p>
<h4>Postpagable (termes al final de cada període)</h4>
$$V_0 = c\; a_{\overline{n}|i}$$
$$a_{\overline{n}|i} = \dfrac{1-(1+i)^{-n}}{i}$$
<h4>Prepagable (termes al principi)</h4>
$$\ddot a_{\overline{n}|i} = (1+i)\; a_{\overline{n}|i}$$
<h4>Valor final i renda diferida</h4>
$$s_{\overline{n}|i} = \dfrac{(1+i)^n-1}{i}$$
$$V_0 = c\; a_{\overline{n}|i}\,(1+i)^{-d}$$
<p>Mètode de les solucions oficials: valorar un període abans del primer terme i després actualitzar o capitalitzar.</p>`,
          tarjetas: [
            { id: 'vof-m2-t1-c1', pregunta: R`Fórmula de $a_{\overline{n}|i}$`, respuesta: R`$$a_{\overline{n}|i} = \dfrac{1-(1+i)^{-n}}{i}$$` },
            { id: 'vof-m2-t1-c2', pregunta: 'Relació entre renda prepagable i postpagable', respuesta: R`$$\ddot a_{\overline{n}|i} = (1+i)\,a_{\overline{n}|i}$$` },
            { id: 'vof-m2-t1-c3', pregunta: R`Com valores una renda diferida $d$ períodes?`, respuesta: R`Valores la renda com si fos immediata i l'actualitzes $d$ períodes: $V_0 = c\,a_{\overline{n}|i}(1+i)^{-d}$.` }
          ],
          ejercicios: [
            {
              id: 'vof-m2-t1-e1', tipo: 'calculo',
              enunciado: R`Cobraràs 300 € al final de cada mes durant 2 anys. El tipus efectiu anual és del 6 %. Quin és el valor actual?`,
              pasos: [
                { titulo: 'Classificar', texto: 'Renda constant, postpagable, immediata i temporal de 24 termes mensuals.' },
                { titulo: 'Convertir el tipus', texto: R`$$i_{12} = (1{,}06)^{1/12} - 1 = 0{,}0048676$$` },
                { titulo: 'Plantejar', texto: R`$$V_0 = 300\; a_{\overline{24}|0{,}0048676}$$` },
                { titulo: 'Resoldre', texto: R`$$a_{\overline{24}|i} = \dfrac{1-(1{,}0048676)^{-24}}{0{,}0048676} = 22{,}599367$$ $$V_0 = 300 \cdot 22{,}599367 = 6.779{,}81\ \text{€}$$` }
              ],
              resultado: 'El valor actual de la renda és de 6.779,81 €.'
            }
          ]
        }
      ]
    },
    'hist-m2': {
      tipo: 'semestre-estudio', version: 1, semestre: '2026-1', asignatura: 'hist', modulo: 'hist-m2',
      titulo: 'La Revolució Industrial', generado: '2026-11-16',
      temas: [
        {
          id: 'hist-m2-t1', titulo: 'Per què Gran Bretanya? La tesi de Robert Allen',
          resumen: R`<p>Allen explica que la industrialització comença a Gran Bretanya per una combinació de preus relatius: <strong>salaris alts</strong> i <strong>energia barata</strong> (carbó).</p>
<p>Amb el treball car i el carbó barat, sortia a compte inventar màquines que estalviaven treball i gastaven energia. Les mateixes màquines no eren rendibles a França o a l'Índia, on el treball era barat.</p>
<h4>Crítiques</h4>
<ul><li>Humphries: els salaris de dones i infants eren baixos, i la fàbrica en va fer un ús intensiu.</li><li>Mokyr: hi posa més pes en la cultura del coneixement útil (Il·lustració industrial).</li></ul>`,
          tarjetas: [
            { id: 'hist-m2-t1-c1', pregunta: 'Quins dos preus relatius expliquen la industrialització britànica segons Allen?', respuesta: 'Salaris alts i energia (carbó) barata.' },
            { id: 'hist-m2-t1-c2', pregunta: 'Per què les màquines britàniques no es van difondre de seguida a França o a l\'Índia?', respuesta: 'Perquè allà el treball era barat i estalviar-lo no compensava el cost del capital i de l\'energia.' },
            { id: 'hist-m2-t1-c3', pregunta: 'Quina alternativa planteja Mokyr?', respuesta: 'La Il·lustració industrial: la difusió del coneixement útil i una cultura favorable a la innovació.' }
          ],
          ejercicios: [
            {
              id: 'hist-m2-t1-e1', tipo: 'desarrollo',
              enunciado: 'Explica en uns 1.500 caràcters per què, segons Allen, la Revolució Industrial comença a Gran Bretanya. Esmenta almenys una crítica.',
              puntos: ['Salaris alts en relació amb el preu del capital i de l\'energia.', 'Carbó abundant i barat.', 'Incentiu a inventar tecnologia que estalvia treball.', 'Per què no era rendible en altres economies.', 'Una crítica (Humphries o Mokyr) amb la idea principal.']
            }
          ]
        }
      ]
    }
  };

  function datos() {
    return {
      entregas: {
        'vof-pac1': { estado: 'entregada', nota: '7.5' },
        'vof-pac2': { estado: 'entregada', nota: '6' },
        'hist-r1': { estado: 'entregada', letra: 'C+' },
        'hist-r2': { estado: 'no_entregada' },
        'im-pac1': { estado: 'entregada', letra: 'B' },
        'xarxes-r1': { estado: 'entregada', letra: 'B' },
        'xarxes-r2': { estado: 'entregada', letra: 'C+' }
      },
      temas: {
        'vof-m1-t1': { estado: '2', ultimo: dia(-20) },
        'vof-m1-t2': { estado: '2', ultimo: dia(-20) },
        'vof-m1-t3': { estado: '1', ultimo: dia(-12) },
        'vof-m1-t4': { estado: '1', duda: '1', apunte: 'Repassar quan cal convertir el tipus abans de plantejar', ultimo: dia(-9) },
        'vof-m1-t6': { estado: '0', prioridad: '1' },
        'vof-m2-t1': { estado: '1', ultimo: dia(-4) },
        'hist-m2-t1': { estado: '2', ultimo: dia(-14) },
        'im-m1-t1': { estado: '2', ultimo: dia(-25) },
        'im-m1-t4': { estado: '1', duda: '1', apunte: 'Diferència exacta entre exploratòria i descriptiva', ultimo: dia(-7) }
      },
      propios: {},
      cards: {
        'vof-m1-t4-c1': { s: '3.2', d: '5', reps: '2', lapses: '0', last: iso(-3), due: iso(0, 4), primera: dia(-6) },
        'vof-m1-t4-c3': { s: '1.4', d: '6.5', reps: '2', lapses: '1', last: iso(-2), due: iso(-1, 4), primera: dia(-6) },
        'hist-m2-t1-c1': { s: '8', d: '4', reps: '3', lapses: '0', last: iso(-8), due: iso(0, 4), primera: dia(-14) }
      },
      ejercicios: {},
      ajustes: {}
    };
  }

  return { estudio, datos };
})();
