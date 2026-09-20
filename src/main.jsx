import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{ArrowLeft,BookOpen,Camera,Check,ChevronRight,Heart,Home,ImagePlus,MapPin,Palette,RefreshCw,Search,ShoppingBag,Sparkles,Star,Trash2,UserRound,WandSparkles}from'lucide-react';
import'./style.css';

const modules=[
 {id:'analysis',title:'Analisar minhas linhas',desc:'Fotos guiadas + análise de linhas corporais',icon:Camera},
 {id:'identity',title:'Descobrir meu estilo',desc:'Preferências, rotina e objetivos',icon:Sparkles},
 {id:'guide',title:'Meu guia pessoal',desc:'Recomendações feitas para você',icon:BookOpen},
 {id:'looks',title:'Montar um look',desc:'Combinações para cada ocasião',icon:ShoppingBag},
 {id:'colors',title:'Cores & beleza',desc:'Contraste, paleta e cabelo',icon:Palette},
 {id:'pros',title:'Encontrar profissional',desc:'Consultoras e serviços especializados',icon:UserRound}
];
const quiz=[
 {title:'Como você quer se sentir ao se vestir?',options:['Elegante e segura','Criativa e marcante','Leve e natural','Moderna e poderosa']},
 {title:'Qual é sua maior dificuldade hoje?',options:['Combinar o que já tenho','Comprar sem me arrepender','Entender o que me valoriza','Vestir minha nova fase']},
 {title:'Onde você mais precisa de ajuda?',options:['Trabalho','Dia a dia','Eventos','Em tudo um pouco']}
];
const looks=[
 {occasion:'Trabalho',name:'Elegância sem esforço',pieces:['Blazer estruturado','Regata acetinada','Calça reta','Mocassim'],tone:'rose'},
 {occasion:'Fim de semana',name:'Natural sofisticado',pieces:['Camisa fluida','Jeans reto','Bolsa média','Sapatilha'],tone:'sand'},
 {occasion:'Evento',name:'Impacto delicado',pieces:['Vestido midi','Brinco orgânico','Sandália fina'],tone:'plum'}
];
const products=[
 {name:'Blazer alfaiataria',store:'Radar parceiro',price:'R$ 189',delivery:'Entrega em 3 dias',tone:'rose'},
 {name:'Calça reta premium',store:'Radar parceiro',price:'R$ 129',delivery:'Frete grátis',tone:'sand'},
 {name:'Bolsa estruturada',store:'Radar parceiro',price:'R$ 149',delivery:'Entrega amanhã',tone:'plum'}
];
const professionals=[
 {name:'Marina Lopes',role:'Consultora de imagem',place:'Brasília · Online',rating:'4,9',tag:'Estilo pessoal'},
 {name:'Clara Menezes',role:'Personal shopper',place:'Online',rating:'4,8',tag:'Compras inteligentes'},
 {name:'Nina Rocha',role:'Personal organizer',place:'Brasília',rating:'5,0',tag:'Closet e malas'}
];
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

function Shell({screen,setScreen,children}){
 const page=modules.find(x=>x.id===screen)?.title;
 return <main className="app">
  {screen==='home'?<div className="top"><span className="logo">STYLIST <i>AI</i></span><span className="avatar">N</span></div>:<header><button className="iconButton" onClick={()=>setScreen('home')} aria-label="Voltar"><ArrowLeft/></button><b>{page||'Minha jornada'}</b><span className="headerMark">AI</span></header>}
  {children}
  {screen!=='home'&&<nav className="bottomNav"><button onClick={()=>setScreen('home')}><Home/><span>Início</span></button><button onClick={()=>setScreen('guide')}><BookOpen/><span>Guia</span></button><button onClick={()=>setScreen('looks')}><WandSparkles/><span>Looks</span></button><button onClick={()=>setScreen('pros')}><UserRound/><span>Experts</span></button></nav>}
 </main>
}

function App(){
 const[screen,setScreen]=useState('home');
 const[profile,setProfile]=useState(()=>load('stylist_profile',{answers:[],photos:{},completed:false}));
 useEffect(()=>save('stylist_profile',profile),[profile]);
 return <Shell screen={screen} setScreen={setScreen}>
  {screen==='home'&&<HomePage setScreen={setScreen} profile={profile}/>}
  {screen==='analysis'&&<Analysis profile={profile} setProfile={setProfile} setScreen={setScreen}/>}
  {screen==='identity'&&<Identity profile={profile} setProfile={setProfile} setScreen={setScreen}/>}
  {screen==='result'&&<Result setScreen={setScreen}/>}
  {screen==='guide'&&<Guide setScreen={setScreen}/>}
  {screen==='looks'&&<Looks/>}
  {screen==='colors'&&<Colors/>}
  {screen==='pros'&&<Professionals/>}
  {screen==='radar'&&<Radar/>}
 </Shell>
}

function HomePage({setScreen,profile}){
 return <>
  <section className="welcome"><span className="eyebrow">SEU ESTILO, COM INTENÇÃO</span><h1>Vista quem você quer ser.</h1><p>Descubra suas linhas, refine seu estilo e encontre as peças certas para você.</p><button className="primary" onClick={()=>setScreen(profile.completed?'result':'analysis')}>{profile.completed?'Ver meu perfil':'Fazer minha análise'} <ChevronRight/></button></section>
  {profile.completed&&<button className="progressCard" onClick={()=>setScreen('result')}><span><Check/> PERFIL INICIADO</span><b>Seu mapa de estilo está pronto</b><small>Veja sua primeira hipótese e continue refinando.</small><ChevronRight/></button>}
  <div className="sectionTitle"><h2>Seu espaço</h2><small>Uma jornada só sua</small></div>
  <section className="grid">{modules.map(({id,title,desc,icon:Icon})=><button className="feature" key={id} onClick={()=>setScreen(id)}><Icon/><b>{title}</b><small>{desc}</small><ChevronRight className="corner"/></button>)}</section>
  <button className="banner" onClick={()=>setScreen('radar')}><div><span className="pill">RADAR DE COMPRAS</span><h3>Seu look, encontrado.</h3><p>A IA sugere. O Radar encontra por preço, frete e entrega.</p></div><ShoppingBag/></button>
 </>
}

function Analysis({profile,setProfile,setScreen}){
 const[step,setStep]=useState(0);const[consent,setConsent]=useState(false);const positions=['frente','perfil','costas'];
 const setPhoto=(position,file)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>setProfile(p=>({...p,photos:{...p.photos,[position]:reader.result}}));reader.readAsDataURL(file)};
 const remove=position=>setProfile(p=>({...p,photos:{...p.photos,[position]:undefined}}));
 if(step===0)return <section className="card introCard"><span className="pill">ANÁLISE GUIADA</span><h1>Vamos conhecer suas linhas.</h1><p>Você adiciona três fotos e responde perguntas rápidas. A demo cria uma primeira hipótese de estilo — não uma avaliação médica.</p><div className="privacy"><Camera/><div><b>Suas fotos são suas</b><small>Nesta demo, elas ficam somente neste navegador e podem ser apagadas quando quiser.</small></div></div><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Entendi e quero continuar com a demonstração.</span></label><button className="primary" disabled={!consent} onClick={()=>setStep(1)}>Começar análise <ChevronRight/></button></section>;
 if(step===4)return <Identity profile={profile} setProfile={setProfile} setScreen={setScreen}/>;
 const position=positions[step-1],photo=profile.photos[position];
 return <section className="card photoCard"><div className="stepLine"><span>ETAPA {step} DE 3</span><i style={{width:`${step/3*100}%`}}/></div><h1>Foto de {position}.</h1><p>Corpo inteiro visível, celular reto, roupa próxima ao corpo e iluminação uniforme.</p><label className={'photoDrop '+(photo?'hasPhoto':'')}>{photo?<img src={photo} alt={`Prévia de ${position}`}/>:<><ImagePlus/><b>Adicionar foto</b><small>Toque para escolher uma imagem</small></>}<input type="file" accept="image/*" onChange={e=>setPhoto(position,e.target.files?.[0])}/></label>{photo&&<button className="textButton" onClick={()=>remove(position)}><Trash2/> Remover e escolher outra</button>}<button className="primary" disabled={!photo} onClick={()=>setStep(step+1)}>{step===3?'Responder perguntas':'Próxima foto'} <ChevronRight/></button></section>
}

function Identity({profile,setProfile,setScreen}){
 const[index,setIndex]=useState(profile.answers.length<quiz.length?profile.answers.length:0);const answers=profile.answers||[];
 const choose=answer=>{const next=[...answers];next[index]=answer;setProfile(p=>({...p,answers:next}));if(index<quiz.length-1)setIndex(index+1);else{setProfile(p=>({...p,answers:next,completed:true}));setScreen('result')}};
 return <section className="card quizCard"><div className="stepLine"><span>PERGUNTA {index+1} DE {quiz.length}</span><i style={{width:`${(index+1)/quiz.length*100}%`}}/></div><span className="eyebrow">IDENTIDADE DE ESTILO</span><h1>{quiz[index].title}</h1><div className="options">{quiz[index].options.map(option=><button key={option} className={answers[index]===option?'selected':''} onClick={()=>choose(option)}><span>{option}</span><ChevronRight/></button>)}</div>{index>0&&<button className="textButton" onClick={()=>setIndex(index-1)}><ArrowLeft/> Voltar uma pergunta</button>}</section>
}

function Result({setScreen}){return <><section className="resultHero"><span className="pill">SUA PRIMEIRA HIPÓTESE</span><h1>Elegante suave</h1><p>Linhas equilibradas, acabamento refinado e detalhes delicados formam o ponto de partida do seu estilo.</p><div className="confidence"><span>Compatibilidade inicial</span><b>86%</b><i><em/></i></div></section><section className="resultGrid"><article><span>01</span><b>Silhuetas</b><p>Estrutura leve, cintura sugerida e caimento contínuo.</p></article><article><span>02</span><b>Materiais</b><p>Tecidos macios, acabamento limpo e brilho discreto.</p></article><article><span>03</span><b>Detalhes</b><p>Escala média, linhas orgânicas e poucos pontos de destaque.</p></article></section><section className="note"><Sparkles/><div><b>Uma hipótese, não uma caixa.</b><p>Você pode refinar o resultado conforme experimenta e conta o que funcionou.</p></div></section><div className="dual"><button className="primary" onClick={()=>setScreen('guide')}>Abrir meu guia <BookOpen/></button><button className="secondary" onClick={()=>setScreen('looks')}>Montar um look</button></div></>}

function Guide({setScreen}){const sections=[['Seu corte ideal','Linhas contínuas, estrutura moderada e cintura sutil.'],['Decotes','V suave, canoa delicada e formas abertas sem excesso.'],['Estampas','Desenhos médios, pouco contraste e movimento orgânico.'],['Acessórios','Peças refinadas de escala média e acabamento polido.']];return <><section className="pageIntro"><span className="eyebrow">GUIA PESSOAL</span><h1>Elegância que acompanha você.</h1><p>Recomendações iniciais construídas a partir da sua jornada.</p></section><section className="guideList">{sections.map(([title,text],i)=><article key={title}><span>0{i+1}</span><div><b>{title}</b><p>{text}</p></div><Heart/></article>)}</section><button className="primary" onClick={()=>setScreen('looks')}>Criar looks com meu guia <WandSparkles/></button></>}

function Looks(){const[selected,setSelected]=useState(0);return <><section className="pageIntro"><span className="eyebrow">STYLIST IA</span><h1>Looks pensados para sua vida.</h1><p>Escolha uma ocasião e veja uma composição alinhada ao seu perfil.</p></section><div className="chips">{looks.map((x,i)=><button className={selected===i?'active':''} onClick={()=>setSelected(i)} key={x.occasion}>{x.occasion}</button>)}</div><section className={'lookBoard '+looks[selected].tone}><div className="outfit"><span className="garment jacket"/><span className="garment topPiece"/><span className="garment pants"/></div><span className="pill">{looks[selected].occasion.toUpperCase()}</span><h2>{looks[selected].name}</h2><div className="pieceList">{looks[selected].pieces.map(x=><span key={x}><Check/> {x}</span>)}</div></section><button className="secondary full"><RefreshCw/> Gerar outra combinação</button></>}

function Colors(){return <><section className="pageIntro"><span className="eyebrow">CORES & BELEZA</span><h1>Uma paleta para começar.</h1><p>Na versão completa, luz natural e perguntas de contraste refinam esta hipótese.</p></section><section className="paletteCard"><div className="swatches">{['#6d2437','#b66362','#dca28f','#edc9ae','#58634b','#1d3d42'].map(c=><i style={{background:c}} key={c}/>)}</div><h2>Profunda e suavemente quente</h2><p>Experimente vinho, rosa queimado, terracota, creme, oliva e petróleo.</p></section><section className="beautyTips"><article><b>Cabelo</b><p>Contraste médio e reflexos quentes próximos ao rosto.</p></article><article><b>Maquiagem</b><p>Blush queimado, boca rosada e definição suave.</p></article></section></>}

function Radar(){const[liked,setLiked]=useState([]);return <><section className="pageIntro"><span className="eyebrow">RADAR DE COMPRAS</span><h1>Peças que conversam com seu guia.</h1><p>Exemplo de busca por estilo, preço e prazo de entrega.</p></section><div className="searchBar"><Search/><span>Elegante suave · até R$ 200</span></div><section className="productGrid">{products.map((p,i)=><article key={p.name}><div className={'productArt '+p.tone}><ShoppingBag/></div><button className={liked.includes(i)?'liked':''} onClick={()=>setLiked(x=>x.includes(i)?x.filter(v=>v!==i):[...x,i])}><Heart/></button><small>{p.store}</small><b>{p.name}</b><strong>{p.price}</strong><span>{p.delivery}</span></article>)}</section></>}

function Professionals(){return <><section className="pageIntro"><span className="eyebrow">PROFISSIONAIS</span><h1>Ajuda humana quando você quiser.</h1><p>Conheça serviços que complementam sua jornada de estilo.</p></section><div className="searchBar"><MapPin/><span>Brasília e atendimento online</span></div><section className="proList">{professionals.map(p=><article key={p.name}><div className="proAvatar">{p.name[0]}</div><div><small>{p.role}</small><b>{p.name}</b><span><MapPin/> {p.place}</span><em>{p.tag}</em></div><strong><Star/> {p.rating}</strong><button>Ver perfil</button></article>)}</section></>}

createRoot(document.getElementById('root')).render(<App/>);
