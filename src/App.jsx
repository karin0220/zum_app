import React, { useState, useEffect, useRef } from 'react';
import { Upload, RefreshCw, Check, Coins, ChevronRight, Search, FileText, Menu, Zap } from 'lucide-react';

// --- Mock Data & Assets ---
// 안정적인 플레이스홀더 이미지 사용
const PET_VARIANTS = [
  { id: 1, name: "주황냥", color: "from-orange-300 to-yellow-200", image: "https://placehold.co/150x150/ff9900/ffffff/png?text=Orange+Cat" },
  { id: 2, name: "치즈냥", color: "from-amber-200 to-white", image: "https://placehold.co/150x150/f0e68c/333333/png?text=Cream+Cat" },
  { id: 3, name: "샴냥이", color: "from-gray-200 to-stone-300", image: "https://placehold.co/150x150/b3a394/333333/png?text=Siamese+Cat" },
  { id: 4, name: "골든댕", color: "from-yellow-300 to-amber-200", image: "https://placehold.co/150x150/ffd700/333333/png?text=Golden+Dog" },
  { id: 5, name: "푸들", color: "from-amber-600 to-amber-800", image: "https://placehold.co/150x150/8b4513/ffffff/png?text=Poodle" },
  { id: 6, name: "시바견", color: "from-orange-200 to-yellow-100", image: "https://placehold.co/150x150/e9a032/333333/png?text=Shiba+Inu" },
];

export default function App() {
  // --- State ---
  const [currentTab, setCurrentTab] = useState('benefits');
  const [points, setPoints] = useState(9658);
  const [appState, setAppState] = useState('main_rock');
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedPet, setGeneratedPet] = useState(null);
  const [tapAnimations, setTapAnimations] = useState([]);

  // --- Actions ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setTimeout(() => setAppState('processing'), 500);
    }
  };

  useEffect(() => {
    if (appState === 'processing') {
      const timer = setTimeout(() => {
        rerollPet();
        setAppState('result');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const rerollPet = () => {
    const randomPet = PET_VARIANTS[Math.floor(Math.random() * PET_VARIANTS.length)];
    setGeneratedPet(randomPet);
  };

  const confirmPet = () => {
    setAppState('main_pet');
  };

  const handlePetTap = (e) => {
    setPoints(p => p + 1 + Math.floor(Math.random() * 3));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // ✨ 여기가 에러 났던 부분입니다. 깔끔하게 정리했습니다.
    const newAnim = {
      id: Date.now(),
      x,
      y,
      val: `+${1 + Math.floor(Math.random() * 3)}P`
    };
    
    setTapAnimations(prev => [...prev, newAnim]);
    setTimeout(() => {
      setTapAnimations(prev => prev.filter(a => a.id !== newAnim.id));
    }, 1000);
  };

  // --- Render Components ---

  const Header = () => (
    <header className="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
        <span className="font-bold text-xl text-gray-800">{points.toLocaleString()}P</span>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600">내역</button>
        <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600">포인트 전환</button>
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className="flex justify-between items-center px-6 py-3 bg-white border-t border-gray-100 sticky bottom-0 pb-6 text-xs text-gray-400 z-50">
      <div className="flex flex-col items-center gap-1" onClick={() => setCurrentTab('search')}>
        <Search size={24} />
        <span>검색</span>
      </div>
      <div className="flex flex-col items-center gap-1" onClick={() => setCurrentTab('issue')}>
        <FileText size={24} />
        <span>이슈</span>
      </div>
      <div className={`flex flex-col items-center gap-1 ${currentTab === 'benefits' ? 'text-gray-900 font-bold' : ''}`} onClick={() => setCurrentTab('benefits')}>
        <div className="relative">
          <Zap size={24} fill={currentTab === 'benefits' ? "black" : "none"} />
          {currentTab === 'benefits' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
        <span>혜택</span>
      </div>
      <div className="flex flex-col items-center gap-1" onClick={() => setCurrentTab('more')}>
        <Menu size={24} />
        <span>더보기</span>
      </div>
    </nav>
  );

  const UploadScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">나만의 펫 만들기</h2>
        <p className="text-sm text-gray-500 mb-6">사진을 올리면 AI가 귀여운 3D 펫으로 변신시켜 드려요!</p>
        <label className="w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors group">
          {selectedFile ? (
            <img src={selectedFile} alt="Preview" className="w-full h-full object-cover rounded-xl opacity-50" />
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <span className="text-blue-500 font-bold">사진 업로드 하기</span>
              <span className="text-xs text-gray-400 mt-1">갤러리에서 선택</span>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );

  const ProcessingScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        {selectedFile && (
           <img src={selectedFile} className="absolute inset-4 w-24 h-24 object-cover rounded-full opacity-80 animate-pulse" alt="orig" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 animate-bounce">AI가 펫을 빚는 중...</h3>
      <p className="text-gray-500 text-sm">조금만 기다려주세요! (약 3초)</p>
    </div>
  );

  const ResultScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-between bg-gray-50 p-6 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">짠! 펫이 탄생했어요 🎉</h2>
        <div className={`relative w-64 h-64 bg-gradient-to-br ${generatedPet.color} rounded-3xl shadow-xl flex items-center justify-center p-4 mb-4 animate-[bounce_3s_infinite]`}>
          <div className="absolute inset-0 bg-white opacity-20 rounded-3xl blur-xl"></div>
          <img src={generatedPet.image} alt="Pet" className="w-48 h-48 object-contain z-10 drop-shadow-lg" />
          <div className="absolute -bottom-4 bg-white px-4 py-2 rounded-full shadow-md text-gray-800 font-bold text-sm border border-gray-100">
            Lv.1 {generatedPet.name}
          </div>
        </div>
        <p className="text-gray-500 mt-4 text-sm">이 펫으로 포인트를 모으시겠어요?</p>
      </div>
      <div className="w-full space-y-3">
        <button 
          onClick={confirmPet}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Check size={20} />
          이걸로 확정하기
        </button>
        <button 
          onClick={rerollPet}
          className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <RefreshCw size={20} />
          광고 보고 다시 뽑기
        </button>
      </div>
    </div>
  );

  const MainPetScreen = () => (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto scrollbar-hide">
      <div className="bg-gradient-to-b from-blue-50 to-gray-50 pb-24 rounded-b-[3rem] shadow-sm relative z-20">
        
        <div className="text-center pt-8 pb-4 z-10 relative">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            톡톡! 포인트가 쏟아지는<br />
            <span className="text-blue-500">나만의 3D 펫</span>
          </h1>
          <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full inline-block mt-3 animate-pulse">
            펫을 계속 쓰다듬어 보세요!
          </div>
        </div>

        <div className="flex justify-center items-center pt-4 relative">
          <div className={`absolute w-64 h-64 bg-gradient-to-tr ${generatedPet.color} rounded-full blur-3xl opacity-40 transform translate-y-4`}></div>
          
          <div 
            className="relative w-64 h-64 cursor-pointer transition-transform active:scale-90 active:rotate-3 select-none touch-manipulation z-30 group"
            onClick={handlePetTap}
          >
            <img 
              src={generatedPet.image} 
              alt="My Pet" 
              className="w-full h-full object-contain drop-shadow-2xl filter group-hover:brightness-110 transition-all transform hover:-translate-y-2" 
              style={{ transform: 'translateZ(0)' }}
            />
            
            {tapAnimations.map(anim => (
              <div 
                key={anim.id}
                className="absolute text-yellow-500 font-bold text-2xl animate-[floatUp_0.8s_ease-out_forwards] pointer-events-none z-40 whitespace-nowrap"
                style={{ left: anim.x, top: anim.y }}
              >
                {anim.val}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 relative z-10 -mt-10">
        <h3 className="font-bold text-gray-600 text-sm px-1 mb-2">함께하는 특별 미션</h3>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-xl">💌</div>
            <div>
              <div className="font-bold text-gray-800">더 커진 친구 초대</div>
              <div className="text-xs text-gray-400">가입 보상에 활동 보너스까지!</div>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-500 px-3 py-1 rounded-lg text-sm font-bold">500P</div>
        </div>

        <h3 className="font-bold text-gray-600 text-sm px-1 mt-6 mb-2">매일 참여 미션</h3>
         {[
            { icon: '🖐️', title: '가위바위보 챌린지', sub: '이길수록 커지는 보상', reward: '최대 100P' },
            { icon: '🥠', title: '행운의 포춘쿠키', sub: '하루 3번 열기 가능', reward: '최대 150P' },
            { icon: '🌵', title: '선인장 뛰어넘기', sub: '10번만 넘으면 보상', reward: '최대 10P' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.sub}</div>
                </div>
              </div>
              <div className="bg-blue-50 text-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold">{item.reward}</div>
            </div>
          ))}
      </div>
    </div>
  );

  const LegacyRockScreen = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-blue-50 p-6 pb-10 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-100 to-white opacity-50"></div>
         <h1 className="text-2xl font-bold text-gray-900 relative z-10 mb-4">
            톡톡! 포인트가 나오는<br /><span className="text-blue-500">신비한 바위</span>
         </h1>
         <div className="w-40 h-40 bg-gray-300 rounded-[3rem] mx-auto shadow-lg flex items-center justify-center text-4xl grayscale opacity-50 relative z-10">
            🪨
         </div>
         <div className="mt-8 relative z-20">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-400 animate-pulse">
              <div className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">NEW</div>
              <h3 className="font-bold text-lg mb-1">이제 돌멩이는 그만! 🛑</h3>
              <p className="text-sm text-gray-600 mb-4">내가 직접 만든 <span className="text-blue-500 font-bold">3D 펫</span>을 키워보세요.</p>
              <button 
                onClick={() => setAppState('upload')}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors"
              >
                내 펫 만들러 가기 👉
              </button>
            </div>
         </div>
      </div>
       <div className="p-4 space-y-3 opacity-50 pointer-events-none">
          <div className="h-20 bg-white rounded-xl"></div>
          <div className="h-20 bg-white rounded-xl"></div>
       </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="w-full max-w-[375px] h-[812px] bg-white shadow-2xl overflow-hidden flex flex-col relative">
        <Header />
        {appState === 'main_rock' && <LegacyRockScreen />}
        {appState === 'upload' && <UploadScreen />}
        {appState === 'processing' && <ProcessingScreen />}
        {appState === 'result' && <ResultScreen />}
        {appState === 'main_pet' && <MainPetScreen />}
        <BottomNav />
      </div>
    </div>
  );
}
