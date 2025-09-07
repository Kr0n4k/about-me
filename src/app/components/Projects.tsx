'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  fork: boolean
}

// Константы
const GITHUB_USERNAME = 'Kr0n4k'
const REPOS_PER_PAGE = 10 // Уменьшаем количество для избежания лимитов
const MAX_TOPICS_DISPLAY = 3
const CACHE_KEY = `github_repos_${GITHUB_USERNAME}`
const CACHE_TIMEOUT = 30 * 60 * 1000 // 30 минут

const LANGUAGE_ICONS: Record<string, string> = {
  JavaScript: '📜',
  TypeScript: '🔷',
  HTML: '🌐',
  CSS: '🎨',
  Python: '🐍',
  Java: '☕',
  Ruby: '💎',
  PHP: '🐘',
  Default: '💻'
}

// Моковые данные для демонстрации
const MOCK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "Пример проекта",
    description: "Это пример проекта для демонстрации",
    html_url: "https://github.com/username/repo",
    homepage: "https://example.com",
    language: "JavaScript",
    stargazers_count: 15,
    forks_count: 3,
    updated_at: new Date().toISOString(),
    topics: ["react", "typescript", "demo"],
    fork: false
  },
  {
    id: 2,
    name: "Веб-приложение",
    description: "Современное веб-приложение с использованием современных технологий",
    html_url: "https://github.com/username/web-app",
    homepage: "",
    language: "TypeScript",
    stargazers_count: 8,
    forks_count: 2,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    topics: ["nextjs", "tailwind", "api"],
    fork: false
  }
]

const Projects = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [languages, setLanguages] = useState<string[]>([])
  const [useMockData, setUseMockData] = useState(false)

  // Получение репозиториев с кэшированием
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Проверяем кэш
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          if (Date.now() - timestamp < CACHE_TIMEOUT) {
            setRepos(data)
            updateLanguages(data)
            return
          }
        }

        // Пробуем получить данные с GitHub API
        try {
          const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_PER_PAGE}`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              }
            }
          )

          if (response.status === 403) {
            throw new Error('Превышен лимит запросов к GitHub API')
          }

          if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: Не удалось загрузить репозитории`)
          }

          const data: GitHubRepo[] = await response.json()
          const userRepos = data.filter(repo => !repo.fork)
          
          // Сохраняем в кэш
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: userRepos,
            timestamp: Date.now()
          }))

          setRepos(userRepos)
          updateLanguages(userRepos)
          
        } catch (apiError) {
          console.warn('GitHub API недоступен, используем моковые данные:', apiError)
          setUseMockData(true)
          setRepos(MOCK_REPOS)
          updateLanguages(MOCK_REPOS)
          setError('Данные загружены в демо-режиме (GitHub API недоступен)')
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка')
        setUseMockData(true)
        setRepos(MOCK_REPOS)
        updateLanguages(MOCK_REPOS)
      } finally {
        setIsLoading(false)
      }
    }

    const updateLanguages = (reposData: GitHubRepo[]) => {
      const allLanguages = Array.from(
        new Set(reposData.map(repo => repo.language).filter(Boolean))
      ) as string[]
      setLanguages(['all', ...allLanguages.sort()])
    }

    fetchRepos()
  }, [])

  const filteredRepos = useMemo(() => {
    if (selectedLanguage === 'all') {
      return repos
    }
    return repos.filter(repo => repo.language === selectedLanguage)
  }, [selectedLanguage, repos])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  const getLanguageIcon = useCallback((language: string | null) => {
    if (!language) return LANGUAGE_ICONS.Default
    return LANGUAGE_ICONS[language] || LANGUAGE_ICONS.Default
  }, [])

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex mt-4 gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-white rounded-xl shadow-md">
      <div className="text-6xl mb-4">📂</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Проекты не найдены</h3>
      <p className="text-gray-600 mb-4">Нет проектов с выбранным языком программирования.</p>
      <button
        onClick={() => setSelectedLanguage('all')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Показать все проекты
      </button>
    </div>
  )

  const RepoCard = ({ repo }: { repo: GitHubRepo }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
        <div className="text-6xl transition-transform group-hover:scale-110">
          {getLanguageIcon(repo.language)}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 truncate" title={repo.name}>
            {repo.name}
          </h3>
          {repo.language && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {repo.language}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3" title={repo.description}>
          {repo.description || 'Описание отсутствует'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Обновлен: {formatDate(repo.updated_at)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Звёзды">
              ⭐ {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1" title="Форки">
              📂 {repo.forks_count}
            </span>
          </div>
        </div>
        
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.topics.slice(0, MAX_TOPICS_DISPLAY).map(topic => (
              <span 
                key={topic} 
                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full hover:bg-gray-200 transition-colors"
                title={topic}
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > MAX_TOPICS_DISPLAY && (
              <span 
                className="text-gray-400 text-xs cursor-help"
                title={repo.topics.slice(MAX_TOPICS_DISPLAY).join(', ')}
              >
                +{repo.topics.length - MAX_TOPICS_DISPLAY} еще
              </span>
            )}
          </div>
        )}
        
        <div className="flex gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
          >
            <span>Код</span>
            <span>↗</span>
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Демо</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section id="my-projects" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Мои проекты
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {useMockData 
              ? 'Демонстрация проектов (GitHub API недоступен)'
              : 'Здесь представлены мои последние проекты с GitHub. Больше проектов можно найти на моём профиле.'
            }
          </p>
        </div>

        {/* Баннер с предупреждением об ошибке */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <span className="text-yellow-600 text-lg mr-2">⚠️</span>
              <div>
                <p className="text-yellow-800 font-medium">{error}</p>
                {useMockData && (
                  <p className="text-yellow-600 text-sm mt-1">
                    Используются демонстрационные данные
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Фильтр по языкам */}
        {languages.length > 1 && (
          <div className="flex justify-center mb-12 flex-wrap gap-3">
            {languages.map(language => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedLanguage === language
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {language === 'all' ? 'Все проекты' : language}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          renderSkeletons()
        ) : filteredRepos.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRepos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* Ссылка на GitHub */}
        <div className="text-center mt-16">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors group"
          >
            <span>Посмотреть все проекты на GitHub</span>
            <svg 
              className="h-5 w-5 transition-transform group-hover:translate-y-0.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects