'use client'

import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about-me')
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Определение активного раздела
      const sections = ['about-me', 'my-projects', 'contact']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element && 
            scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Закрытие мобильного меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { id: 'about-me', label: 'Обо мне' },
    { id: 'my-projects', label: 'Мои проекты' },
    { id: 'contact', label: 'Связь со мной' },
  ]

  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Логотип с улучшенной анимацией */}
          <a 
            href="#about-me" 
            onClick={(e) => handleSmoothScroll(e, 'about-me')}
            className="flex items-center group relative"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 transition-all duration-500 group-hover:scale-110">
              <Image 
                src={'https://avatars.githubusercontent.com/u/205317342?s=96&v=4'}
                alt='logo'
                fill
                className='rounded-full object-cover cursor-pointer border-2 border-white/30 group-hover:border-blue-500 transition-all duration-500 shadow-md'
              />
              {/* Анимированное свечение */}
              <div className="absolute inset-0 rounded-full bg-blue-500/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-500 relative">
              Дядя Крон
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </a>

          {/* Десктопное меню с улучшенными индикаторами */}
          <div className="hidden md:flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-xl p-1.5 border border-gray-100/50 shadow-sm">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className={`px-5 py-2.5 text-gray-700 font-medium rounded-lg transition-all duration-300 relative group overflow-hidden ${
                  activeSection === item.id 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'hover:text-blue-600 hover:bg-gray-100/50'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Подчеркивание для активного элемента */}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                )}
                
                {/* Эффект фона при наведении */}
                <span className="absolute inset-0 bg-blue-500/10 -z-10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></span>
              </a>
            ))}
          </div>

          {/* Кнопка мобильного меню с улучшенной анимацией */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 mt-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 -translate-x-4' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 mt-1.5 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Мобильное меню с улучшенной анимацией */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden bg-white/95 backdrop-blur-md shadow-lg absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleSmoothScroll(e, item.id)}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                      activeSection === item.id
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Индикатор активного элемента */}
                    {activeSection === item.id && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></span>
                    )}
                    
                    {/* Эффект фона при наведении */}
                    <span className="absolute inset-0 bg-blue-500/10 -z-10 scale-0 hover:scale-100 transition-transform duration-300 rounded-lg"></span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Дополнительная информация в мобильном меню */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-200 hover:scale-110"
                  aria-label="GitHub"
                >
                  <span className="text-lg">🐱</span>
                </a>
                <a 
                  href="https://t.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-100 hover:scale-110"
                  aria-label="Telegram"
                >
                  <span className="text-lg">✈️</span>
                </a>
                <a 
                  href="mailto:example@example.com" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-100 hover:scale-110"
                  aria-label="Email"
                >
                  <span className="text-lg">✉️</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer для фиксированной навигации */}
      <div className="h-20 md:h-24"></div>

      <style jsx>{`
        /* Плавные анимации для мобильного меню */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  )
}

export default NavBar