import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{ArrowLeft,BookOpen,Camera,Check,ChevronRight,Heart,Home,ImagePlus,Info,MapPin,Palette,RefreshCw,Search,ShieldCheck,ShoppingBag,Sparkles,Star,Trash2,UserRound,WandSparkles}from'lucide-react';
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
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const photosReady=profile=>['frente','perfil','costas'].every(position=>profile.photos?.[position]);
const compressPhoto=file=>new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(new Error('Escolha um arquivo de imagem.'));if(file.size>15*1024*1024)return reject(new Error('A imagem deve ter no máximo 15 MB.'));const reader=new FileReader();reader.onerror=()=>reject(new Error('Não foi possível ler a imagem.'));reader.onload=()=>{const image=new Image();image.onerror=()=>reject(new Error('Imagem inválida ou corrompida.'));image.onload=()=>{const max=1200,scale=Math.min(1,max/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.76))};image.src=reader.result};reader.readAsDataURL(file)});

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
 const[storageError,setStorageError]=useState('');
 useEffect(()=>{if(!save('stylist_profile',profile))setStorageError('O navegador ficou sem espaço. Remova fotos antigas ou use imagens menores.')},[profile]);
 const eraseData=()=>{localStorage.removeItem('stylist_profile');setProfile({answers:[],photos:{},completed:false});setStorageError('');setScreen('home')};
 return <Shell screen={screen} setScreen={setScreen}>
  {storageError&&<div className="errorBanner" role="alert">{storageError}</div>}
  {screen==='home'&&<HomePage setScreen={setScreen} profile={profile} eraseData={eraseData}/>}
  {screen==='analysis'&&<Analysis profile={profile} setProfile={setProfile} setScreen={setScreen}/>}
  {screen==='identity'&&<Identity profile={profile} setProfile={setProfile} setScreen={setScreen}/>}
  {screen==='result'&&<Result profile={profile} setScreen={setScreen}/>}
  {screen==='guide'&&<Guide setScreen={setScreen}/>}
  {screen==='looks'&&<Looks/>}
  {screen==='colors'&&<Colors/>}
  {screen==='pros'&&<Professionals/>}
  {screen==='radar'&&<Radar/>}
 </Shell>
}

function HomePage({setScreen,profile,eraseData}){
 return <>
  <section className="welcome"><span className="eyebrow">SEU ESTILO, COM INTENÇÃO</span><h1>Vista quem você quer ser.</h1><p>Descubra suas linhas, refine seu estilo e encontre as peças certas para você.</p><button className="primary" onClick={()=>setScreen(profile.completed?'result':'analysis')}>{profile.completed?'Ver meu perfil':'Fazer minha análise'} <ChevronRight/></button></section>
  {profile.completed&&<button className="progressCard" onClick={()=>setScreen('result')}><span><Check/> PERFIL INICIADO</span><b>Seu mapa de estilo está pronto</b><small>Veja sua primeira hipótese e continue refinando.</small><ChevronRight/></button>}
  <div className="sectionTitle"><h2>Seu espaço</h2><small>Uma jornada só sua</small></div>
  <section className="grid">{modules.map(({id,title,desc,icon:Icon})=><button className="feature" key={id} onClick={()=>setScreen(id==='identity'&&!photosReady(profile)?'analysis':id)}><Icon/><b>{title}</b><small>{id==='identity'&&!photosReady(profile)?'Comece pelas fotos guiadas':desc}</small><ChevronRight className="corner"/></button>)}</section>
  <button className="banner" onClick={()=>setScreen('radar')}><div><span className="pill">RADAR DE COMPRAS</span><h3>Seu look, encontrado.</h3><p>A IA sugere. O Radar encontra por preço, frete e entrega.</p></div><ShoppingBag/></button>
  <section className="dataPanel"><ShieldCheck/><div><b>Privacidade e dados</b><small>Fotos e respostas ficam somente neste navegador nesta demo.</small></div><button onClick={eraseData} disabled={!profile.answers?.length&&!Object.keys(profile.photos||{}).length}>Apagar meus dados</button></section>
 </>
}

function Analysis({profile,setProfile,setScreen}){
 const[step,setStep]=useState(0);const[consent,setConsent]=useState(Boolean(profile.consentAt));const[photoError,setPhotoError]=useState('');const positions=['frente','perfil','costas'];
 const setPhoto=async(position,file)=>{if(!file)return;setPhotoError('');try{const photo=await compressPhoto(file);setProfile(p=>({...p,photos:{...p.photos,[position]:photo}}))}catch(error){setPhotoError(error.message)}};
 const remove=position=>setProfile(p=>({...p,photos:{...p.photos,[position]:undefined}}));
 if(step===0)return <section className="card introCard"><span className="pill">ANÁLISE GUIADA</span><h1>Vamos conhecer suas linhas.</h1><p>Você adiciona três fotos e responde perguntas rápidas. A demo cria uma hipótese de estilo — não uma avaliação médica nem um julgamento do seu corpo.</p><div className="privacy"><Camera/><div><b>Suas fotos são suas</b><small>Nesta demo, elas ficam somente neste navegador, são comprimidas antes do armazenamento e podem ser apagadas na tela inicial.</small></div></div><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Autorizo o uso local das fotos para esta demonstração e sei que posso apagar tudo quando quiser.</span></label><button className="primary" disabled={!consent} onClick={()=>{setProfile(p=>({...p,consentAt:new Date().toISOString()}));setStep(1)}}>Começar análise <ChevronRight/></button></section>;
 if(step===4)return <Identity profile={profile} setProfile={setProfile} setScreen={setScreen}/>;
 const position=positions[step-1],photo=profile.photos[position];
 return <section className="card photoCard"><div className="stepLine"><span>ETAPA {step} DE 3</span><i style={{width:`${step/3*100}%`}}/></div><h1>Foto de {position}.</h1><p>Corpo inteiro visível, celular reto, roupa próxima ao corpo e iluminação uniforme.</p><label className={'photoDrop '+(photo?'hasPhoto':'')}>{photo?<img src={photo} alt={`Prévia de ${position}`}/>:<><ImagePlus/><b>Adicionar foto</b><small>JPG, PNG ou imagem do celular · até 15 MB</small></>}<input type="file" accept="image/*" onChange={e=>setPhoto(position,e.target.files?.[0])}/></label>{photoError&&<p className="fieldError" role="alert">{photoError}</p>}{photo&&<button className="textButton" onClick={()=>remove(position)}><Trash2/> Remover e escolher outra</button>}<button className="primary" disabled={!photo} onClick={()=>setStep(step+1)}>{step===3?'Responder perguntas':'Próxima foto'} <ChevronRight/></button></section>
}

function Identity({profile,setProfile,setScreen}){
 const[index,setIndex]=useState(profile.answers.length<quiz.length?profile.answers.length:0);const answers=profile.answers||[];
 const choose=answer=>{const next=[...answers];next[index]=answer;setProfile(p=>({...p,answers:next}));if(index<quiz.length-1)setIndex(index+1);else{setProfile(p=>({...p,answers:next,completed:true}));setScreen('result')}};
 return <section className="card quizCard"><div className="stepLine"><span>PERGUNTA {index+1} DE {quiz.length}</span><i style={{width:`${(index+1)/quiz.length*100}%`}}/></div><span className="eyebrow">IDENTIDADE DE ESTILO</span><h1>{quiz[index].title}</h1><div className="options">{quiz[index].options.map(option=><button key={option} className={answers[index]===option?'selected':''} onClick={()=>choose(option)}><span>{option}</span><ChevronRight/></button>)}</div>{index>0&&<button className="textButton" onClick={()=>setIndex(index-1)}><ArrowLeft/> Voltar uma pergunta</button>}</section>
}

function Result({profile,setScreen}){const answered=profile.answers?.length||0;return <><section className="resultHero"><span className="pill">HIPÓTESE DEMONSTRATIVA</span><h1>Elegante suave</h1><p>Linhas equilibradas, acabamento refinado e detalhes delicados formam um ponto de partida para experimentar — não uma classificação definitiva.</p><div className="evidence"><Info/><span>Baseado nas 3 fotos enviadas e em {answered} respostas. Nesta demo ainda não há motor de visão; o resultado é um exemplo de experiência.</span></div></section><section className="resultGrid"><article><span>01</span><b>Silhuetas</b><p>Estrutura leve, cintura sugerida e caimento contínuo.</p></article><article><span>02</span><b>Materiais</b><p>Tecidos macios, acabamento limpo e brilho discreto.</p></article><article><span>03</span><b>Detalhes</b><p>Escala média, linhas orgânicas e poucos pontos de destaque.</p></article></section><section className="note"><Sparkles/><div><b>Uma hipótese, não uma caixa.</b><p>Não avaliamos peso, saúde, beleza ou valor pessoal. Você pode refinar o resultado conforme experimenta.</p></div></section><div className="dual"><button className="primary" onClick={()=>setScreen('guide')}>Abrir meu guia <BookOpen/></button><button className="secondary" onClick={()=>setScreen('looks')}>Montar um look</button></div></>}

function Guide({setScreen}){const sections=[['Seu corte ideal','Linhas contínuas, estrutura moderada e cintura sutil.'],['Decotes','V suave, canoa delicada e formas abertas sem excesso.'],['Estampas','Desenhos médios, pouco contraste e movimento orgânico.'],['Acessórios','Peças refinadas de escala média e acabamento polido.']];return <><section className="pageIntro"><span className="eyebrow">GUIA PESSOAL</span><h1>Elegância que acompanha você.</h1><p>Recomendações iniciais construídas a partir da sua jornada.</p></section><section className="guideList">{sections.map(([title,text],i)=><article key={title}><span>0{i+1}</span><div><b>{title}</b><p>{text}</p></div><Heart/></article>)}</section><button className="primary" onClick={()=>setScreen('looks')}>Criar looks com meu guia <WandSparkles/></button></>}

function Looks(){const[selected,setSelected]=useState(0);return <><section className="pageIntro"><span className="eyebrow">STYLIST IA</span><h1>Looks pensados para sua vida.</h1><p>Escolha uma ocasião e veja uma composição alinhada ao seu perfil.</p></section><div className="chips">{looks.map((x,i)=><button className={selected===i?'active':''} onClick={()=>setSelected(i)} key={x.occasion}>{x.occasion}</button>)}</div><section className={'lookBoard '+looks[selected].tone}><div className="outfit"><span className="garment jacket"/><span className="garment topPiece"/><span className="garment pants"/></div><span className="pill">{looks[selected].occasion.toUpperCase()}</span><h2>{looks[selected].name}</h2><div className="pieceList">{looks[selected].pieces.map(x=><span key={x}><Check/> {x}</span>)}</div></section><button className="secondary full" onClick={()=>setSelected(value=>(value+1)%looks.length)}><RefreshCw/> Gerar outra combinação</button></>}

function Colors(){return <><section className="pageIntro"><span className="eyebrow">CORES & BELEZA</span><h1>Uma paleta para começar.</h1><p>Na versão completa, luz natural e perguntas de contraste refinam esta hipótese.</p></section><section className="paletteCard"><div className="swatches">{['#6d2437','#b66362','#dca28f','#edc9ae','#58634b','#1d3d42'].map(c=><i style={{background:c}} key={c}/>)}</div><h2>Profunda e suavemente quente</h2><p>Experimente vinho, rosa queimado, terracota, creme, oliva e petróleo.</p></section><section className="beautyTips"><article><b>Cabelo</b><p>Contraste médio e reflexos quentes próximos ao rosto.</p></article><article><b>Maquiagem</b><p>Blush queimado, boca rosada e definição suave.</p></article></section></>}

function Radar(){const[liked,setLiked]=useState([]);return <><section className="pageIntro"><span className="eyebrow">RADAR DE COMPRAS</span><h1>Peças que conversam com seu guia.</h1><p>Exemplo de busca por estilo, preço e prazo de entrega.</p></section><div className="commercialNote"><Info/> Demonstração comercial. Ofertas patrocinadas e links de afiliado serão identificados individualmente.</div><div className="searchBar"><Search/><span>Elegante suave · até R$ 200</span></div><section className="productGrid">{products.map((p,i)=><article key={p.name}><div className={'productArt '+p.tone}><ShoppingBag/></div><button aria-label={`${liked.includes(i)?'Remover':'Adicionar'} ${p.name} dos favoritos`} className={liked.includes(i)?'liked':''} onClick={()=>setLiked(x=>x.includes(i)?x.filter(v=>v!==i):[...x,i])}><Heart/></button><small>EXEMPLO · NÃO PATROCINADO</small><b>{p.name}</b><strong>{p.price}</strong><span>{p.delivery}</span></article>)}</section></>}

function Professionals(){const[open,setOpen]=useState(null);return <><section className="pageIntro"><span className="eyebrow">PROFISSIONAIS</span><h1>Ajuda humana quando você quiser.</h1><p>Perfis fictícios para demonstrar o futuro marketplace.</p></section><div className="commercialNote"><Info/> Perfis de demonstração, não anúncios nem profissionais verificados.</div><div className="searchBar"><MapPin/><span>Brasília e atendimento online</span></div><section className="proList">{professionals.map((p,i)=><article key={p.name}><div className="proAvatar">{p.name[0]}</div><div><small>{p.role}</small><b>{p.name}</b><span><MapPin/> {p.place}</span><em>{p.tag}</em>{open===i&&<p className="profileDetail">Perfil demonstrativo. Agenda e contato estarão disponíveis após verificação profissional.</p>}</div><strong><Star/> {p.rating}</strong><button onClick={()=>setOpen(open===i?null:i)}>{open===i?'Fechar perfil':'Ver perfil'}</button></article>)}</section></>}

createRoot(document.getElementById('root')).render(<App/>);
