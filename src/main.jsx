import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Camera,Sparkles,ShoppingBag,Palette,UserRound,BookOpen,ChevronRight} from 'lucide-react';
import './style.css';

const features=[
 ['Analisar minhas linhas',Camera,'Fotos guiadas + análise de linhas corporais'],
 ['Descobrir meu estilo',Sparkles,'Arquétipos, preferências e objetivos'],
 ['Meu guia pessoal',BookOpen,'Guia individual gerado pela IA'],
 ['Montar um look',ShoppingBag,'Looks + radar de peças para comprar'],
 ['Cores & beleza',Palette,'Contraste, hipóteses de cartela e cabelo'],
 ['Encontrar profissional',UserRound,'Consultoras, visagistas e serviços']
];

function App(){
 const [screen,setScreen]=useState('home');
 const [step,setStep]=useState(0);
 if(screen==='analysis') return <main className="app">
   <header><button className="back" onClick={()=>setScreen('home')}>←</button><b>Minha análise</b><span></span></header>
   <section className="card hero">
    <span className="pill">ETAPA {step+1} DE 4</span>
    <h1>{['Vamos conhecer suas linhas','Foto de frente','Foto de perfil','Foto de costas'][step]}</h1>
    <p>{step===0?'Usamos fotos guiadas e algumas respostas para sugerir as famílias de estilo mais compatíveis com suas linhas. O resultado é uma hipótese de styling, não uma medição médica.':'Posicione o celular reto, com o corpo inteiro visível e iluminação uniforme.'}</p>
    <div className="silhouette"><Camera size={44}/><span>{step===0?'Leva cerca de 3 minutos':'Adicionar foto'}</span></div>
    <button className="primary" onClick={()=>step<3?setStep(step+1):setScreen('result')}>{step===0?'Começar análise':'Continuar'} <ChevronRight size={18}/></button>
   </section>
 </main>;
 if(screen==='result') return <main className="app">
  <header><button className="back" onClick={()=>setScreen('home')}>←</button><b>Seu perfil</b><span></span></header>
  <section className="result">
   <span className="pill">PRIMEIRA HIPÓTESE</span><h1>Seu mapa de estilo começa aqui.</h1>
   <p>A versão real comparará suas linhas, altura e respostas antes de sugerir famílias prováveis e explicar o porquê.</p>
   <div className="score"><b>Linhas corporais</b><span>Em análise</span></div>
   <div className="score"><b>Identidade de estilo</b><span>A fazer</span></div>
   <div className="score"><b>Cores & contraste</b><span>A fazer</span></div>
   <button className="primary" onClick={()=>setScreen('home')}>Ir para meu painel</button>
  </section>
 </main>;
 return <main className="app">
  <section className="top"><span className="logo">STYLIST <i>AI</i></span><span className="avatar">N</span></section>
  <section className="welcome"><span className="eyebrow">SEU ESTILO, COM INTENÇÃO</span><h1>Vista quem você quer ser.</h1><p>Descubra suas linhas, refine seu estilo e encontre as peças certas para você.</p><button className="primary" onClick={()=>setScreen('analysis')}>Fazer minha análise <ChevronRight size={18}/></button></section>
  <h2>Seu espaço</h2>
  <section className="grid">{features.map(([t,I,d],i)=><button className="feature" key={t} onClick={()=>i===0&&setScreen('analysis')}><I/><b>{t}</b><small>{d}</small></button>)}</section>
  <section className="banner"><div><span className="pill">EM BREVE</span><h3>Seu look, encontrado.</h3><p>A IA cria. O Radar encontra opções por preço, frete e entrega.</p></div><ShoppingBag size={42}/></section>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);