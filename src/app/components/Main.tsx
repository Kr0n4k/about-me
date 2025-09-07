'use client'

import React, { useState, useEffect, useRef } from 'react'

const Main = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Обновление текущего времени
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Дата рождения для расчета возраста
  const birthDate = new Date(2009, 2, 21) // 21 марта 2009
  const age = Math.floor((new Date().getTime() - birthDate.getTime()) / 3.15576e+10)

  // Эффект параллакса для фона
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height
      
      const moveX = (x - 0.5) * 20
      const moveY = (y - 0.5) * 20
      
      const elements = containerRef.current.querySelectorAll('.parallax-element')
      elements.forEach((el: Element) => {
        const depth = parseFloat((el as HTMLElement).dataset.depth || '0.1')
        ;(el as HTMLElement).style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`
      })
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <main 
      id="about-me" 
      ref={containerRef}
      className="min-h-screen pt-20 md:pt-24 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden"
    >
      {/* Улучшенный анимированный фон с параллаксом */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float parallax-element"
            data-depth={(i % 5 + 1) * 0.1}
            style={{
              width: `${Math.random() * 100 + 40}px`,
              height: `${Math.random() * 100 + 40}px`,
              background: i % 4 === 0 
                ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
                : i % 4 === 1
                ? 'linear-gradient(45deg, #10b981, #06b6d4)'
                : i % 4 === 2
                ? 'linear-gradient(45deg, #f59e0b, #ef4444)'
                : 'linear-gradient(45deg, #ec4899, #8b5cf6)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          />
        ))}
        
        {/* Анимированные градиентные пятна */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob parallax-element" data-depth="0.05"></div>
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 parallax-element" data-depth="0.1"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 parallax-element" data-depth="0.07"></div>
        
        {/* Сетка для фона */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNIDAgMCBMIDYwIDAgTCA2MCA2MCIgLz48cGF0aCBkPSJNIDAgMCBMIDAgNjAgTCA2MCA2MCIgLz48L2c+PC9zdmc+')]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Текстовый контент */}
          <div className={`flex-1 text-center md:text-left transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-lg border border-gray-100/50 parallax-element" data-depth="0.15">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-2 animate-pulse"></div>
              <span className="text-gray-700">Сейчас {currentTime} • Доступен для проектов</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Привет, я <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-text">Дядя Крон</span>
            </h1>
            
            <div className="text-xl md:text-2xl text-gray-700 mb-6 font-medium flex items-center justify-center md:justify-start gap-2">
              <span>Fullstack Разработчик</span>
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full px-4 py-2 text-sm font-medium shadow-md border border-blue-200/50 transition-all duration-300 hover:scale-105">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {age} лет, {birthDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full px-4 py-2 text-sm font-medium shadow-md border border-purple-200/50 transition-all duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Елец, Россия
              </div>
              
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full px-4 py-2 text-sm font-medium shadow-md border border-green-200/50 transition-all duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Институт СПО ЕГУ им. И. А. Бунина
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-md hover:bg-white/80">
              Создаю современные и интуитивные веб-приложения с использованием 
              передовых технологий. Превращаю идеи в цифровую реальность.
            </p>
            
            {/* Стек технологий */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Мой стек технологий:
              </h2>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  { name: 'Next.js', color: 'bg-black text-white hover:shadow-lg' },
                  { name: 'NestJS', color: 'bg-red-500 text-white hover:shadow-lg' },
                  { name: 'TypeScript', color: 'bg-blue-600 text-white hover:shadow-lg' },
                  { name: 'React', color: 'bg-cyan-500 text-white hover:shadow-lg' },
                  { name: 'Node.js', color: 'bg-green-600 text-white hover:shadow-lg' },
                  { name: 'PostgreSQL', color: 'bg-blue-800 text-white hover:shadow-lg' },
                  { name: 'Docker', color: 'bg-blue-400 text-white hover:shadow-lg' }
                ].map((tech) => (
                  <span 
                    key={tech.name} 
                    className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 ${tech.color} ${hoveredTech === tech.name ? 'ring-2 ring-offset-2 ring-white' : ''}`}
                    onMouseEnter={() => setHoveredTech(tech.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
              <button 
                onClick={() => scrollToSection('projects')}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Начать проект</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="group relative border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <span className="relative z-10">Посмотреть работы</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </button>
            </div>
            
            {/* Социальные иконки */}
            <div className="flex justify-center md:justify-start gap-4 mt-8">
              {[
                { name: 'github', icon: '🐱', url: 'https://github.com', color: 'hover:bg-gray-800 hover:text-white', bg: 'bg-white' },
                { name: 'linkedin', icon: '💼', url: 'https://linkedin.com', color: 'hover:bg-blue-700 hover:text-white', bg: 'bg-white' },
                { name: 'telegram', icon: '✈️', url: 'https://telegram.org', color: 'hover:bg-blue-500 hover:text-white', bg: 'bg-white' },
                { name: 'email', icon: '✉️', url: 'mailto:example@example.com', color: 'hover:bg-red-500 hover:text-white', bg: 'bg-white' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 ${social.bg} rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${social.color} group relative overflow-hidden`}
                  aria-label={social.name}
                >
                  <span className="text-xl relative z-10 group-hover:text-white transition-colors">{social.icon}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-current rounded-full"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Изображение/аватар с улучшенной анимацией */}
          <div className={`flex-1 flex justify-center md:justify-end transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] parallax-element" data-depth="0.2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              
              <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-full p-3 shadow-2xl border-8 border-white/20">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 rounded-full flex items-center justify-center overflow-hidden relative">
                  <div className="text-7xl md:text-9xl transition-all duration-700 hover:scale-110">👨‍💻</div>
                  
                  {/* Анимированные орбиты */}
                  <div className="absolute w-64 h-64 md:w-80 md:h-80 border-2 border-blue-200/30 rounded-full animate-spin-slow">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
                  </div>
                  <div className="absolute w-80 h-80 md:w-96 md:h-96 border-2 border-purple-200/30 rounded-full animate-spin-slow reverse">
                    <div className="absolute top-0 right-1/2 -translate-y-1/2 w-5 h-5 bg-purple-500 rounded-full shadow-md"></div>
                  </div>
                  
                  {/* Частицы вокруг аватара */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"
                      style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Анимированные элементы */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg z-10">
                  <span className="text-2xl">⭐</span>
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                  <span className="text-3xl">🚀</span>
                </div>

                {/* Дополнительные декоративные элементы */}
                <div className="absolute top-12 -right-6 w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center rotate-12 animate-float shadow-md z-10">
                  <span className="text-white text-xs font-bold">Next.js</span>
                </div>
                
                <div className="absolute bottom-16 -left-8 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center -rotate-12 animate-float shadow-md z-10" style={{animationDelay: '2s'}}>
                  <span className="text-white text-xs font-bold">Docker</span>
                </div>
                
                {/* Светящийся эффект */}
                <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-ping opacity-0"></div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={() => scrollToSection('about')}
            className="animate-bounce flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors group"
            aria-label="Прокрутить вниз"
          >
            <span className="text-sm mb-2 group-hover:font-medium transition-all">Листайте вниз</span>
            <div className="w-8 h-12 border-2 border-gray-300 rounded-full flex justify-center group-hover:border-blue-500 transition-colors">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-3 animate-pulse group-hover:bg-blue-500 transition-colors"></div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animate-text {
          background-size: 200% auto;
          animation: text-gradient 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .reverse {
          animation-direction: reverse;
        }
      `}</style>
    </main>
  )
}

export default Main