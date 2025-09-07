'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  image: string
  tags: string[]
  readTime: number
  slug: string
}

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [tags, setTags] = useState<string[]>([])
  const sectionRef = useRef(null)

  // Моковые данные для демонстрации
  const MOCK_POSTS: BlogPost[] = [
    {
      id: 1,
      title: "Создание современного портфолио с Next.js",
      excerpt: "Подробное руководство по созданию портфолио с использованием Next.js, TypeScript и Tailwind CSS.",
      content: "Полное содержание статьи...",
      date: new Date().toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1620674156044-52b714665bee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Next.js", "React", "TypeScript"],
      readTime: 8,
      slug: "sozdanie-portfolio-nextjs"
    },
    {
      id: 2,
      title: "Оптимизация производительности веб-приложений",
      excerpt: "Лучшие практики для улучшения производительности ваших React и Next.js приложений.",
      content: "Полное содержание статьи...",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Оптимизация", "React", "Web Vitals"],
      readTime: 12,
      slug: "optimizaciya-proizvoditelnosti"
    },
    {
      id: 3,
      title: "Введение в NestJS для бэкенд-разработки",
      excerpt: "Изучите основы NestJS - прогрессивного Node.js фреймворка для построения эффективных серверных приложений.",
      content: "Полное содержание статьи...",
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["NestJS", "Node.js", "Backend"],
      readTime: 15,
      slug: "vvedenie-v-nestjs"
    },
    {
      id: 4,
      title: "TypeScript: от новичка к профессионалу",
      excerpt: "Полное руководство по TypeScript с лучшими практиками и продвинутыми техниками.",
      content: "Полное содержание статьи...",
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["TypeScript", "Программирование"],
      readTime: 20,
      slug: "typescript-ot-novichka-k-profu"
    },
    {
      id: 5,
      title: "Docker для веб-разработчиков",
      excerpt: "Как использовать Docker для упрощения процесса разработки и деплоя приложений.",
      content: "Полное содержание статьи...",
      date: new Date(Date.now() - 86400000 * 10).toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1589654443831-2fe9a79abb02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Docker", "DevOps", "Deployment"],
      readTime: 14,
      slug: "docker-dlya-veb-razrabotchikov"
    },
    {
      id: 6,
      title: "Создание API с помощью NestJS и PostgreSQL",
      excerpt: "Пошаговое руководство по созданию RESTful API с использованием NestJS и PostgreSQL.",
      content: "Полное содержание статьи...",
      date: new Date(Date.now() - 86400000 * 14).toISOString(),
      author: "Дядя Крон",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["NestJS", "PostgreSQL", "API"],
      readTime: 18,
      slug: "sozdanie-api-nestjs-postgresql"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Имитация загрузки данных
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        // В реальном приложении здесь был бы fetch к API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPosts(MOCK_POSTS)
        
        // Извлекаем все уникальные теги
        const allTags = Array.from(
          new Set(MOCK_POSTS.flatMap(post => post.tags))
        )
        setTags(['all', ...allTags.sort()])
      } catch (error) {
        console.error('Ошибка загрузки постов:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
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
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Статьи не найдены</h3>
      <p className="text-gray-600 mb-4">Нет статей с выбранным тегом.</p>
      <button
        onClick={() => setSelectedTag('all')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Показать все статьи
      </button>
    </div>
  )

  const PostCard = ({ post }: { post: BlogPost }) => (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {post.readTime} мин чтения
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{formatDate(post.date)}</span>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <a
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group/readmore"
        >
          <span>Читать далее</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 transition-transform group-hover/readmore:translate-x-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </article>
  )

  return (
    <section 
      id="blog" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden"
    >
      {/* Анимированные фоновые элементы */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Мой блог
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Делимся знаниями и опытом в веб-разработке, новых технологиях и лучших практиках.
          </p>
        </div>

        {/* Фильтр по тегам */}
        {tags.length > 1 && (
          <div className={`flex justify-center mb-12 flex-wrap gap-3 transition-all duration-1000 ease-out delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {tag === 'all' ? 'Все статьи' : tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          renderSkeletons()
        ) : filteredPosts.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog