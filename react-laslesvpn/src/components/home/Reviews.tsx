import { useEffect, useRef, useState } from "react"

interface Comment {
  icon: string
  name: string
  location: string
  rating: number
  comment: string
}

export default function Review() {
  const [comments, setComments] = useState<Comment[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [cardsPerPage, setCardsPerPage] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const CARD_WIDTH = 382
  
  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch("/mock/comments.json")
      const { success, data } = await res.json()
      if (success) {
        setComments(data)
      }
    }
    fetchComments()
  }, [])

  
  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth >= 1024) setCardsPerPage(3)
      else if (window.innerWidth >= 768) setCardsPerPage(2)
      else setCardsPerPage(1)
    }

    updateCardsPerPage()
    window.addEventListener("resize", updateCardsPerPage)
    return () => window.removeEventListener("resize", updateCardsPerPage)
  }, [])

  const totalPages = Math.ceil(comments.length / cardsPerPage)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / (CARD_WIDTH * cardsPerPage))
      setCurrentPage(index)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [cardsPerPage])

  const scrollToPage = (index: number) => {
    const container = containerRef.current
    if (!container) return
    const targetIndex = (index + totalPages) % totalPages
    container.scrollTo({
      left: targetIndex * CARD_WIDTH * cardsPerPage,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container || totalPages <= 1) return

    let timer: NodeJS.Timeout

    const startAutoScroll = () => {
      timer = setInterval(() => {
        scrollToPage(currentPage + 1)
      }, 4000)
    }

    const stopAutoScroll = () => clearInterval(timer)

    startAutoScroll()
    container.addEventListener("mouseenter", stopAutoScroll)
    container.addEventListener("mouseleave", startAutoScroll)

    return () => {
      stopAutoScroll()
      container.removeEventListener("mouseenter", stopAutoScroll)
      container.removeEventListener("mouseleave", startAutoScroll)
    }
  }, [currentPage, totalPages, cardsPerPage])

  return (
    <>
      <div
        ref={containerRef}
        className="flex overflow-x-auto pb-6 gap-8 md:gap-10 scroll-smooth snap-x"
      >
        {comments.map((testimonial, index) => (
          <div
            key={index}
            className="min-w-[300px] sm:min-w-[350px] max-w-[400px] snap-start bg-white dark:bg-gray-700 p-6 border border-gray-200 dark:border-gray-600 rounded-lg flex flex-col hover:border-[#F53838] transition-colors"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.icon}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <h3 className="font-medium text-base text-[#0B132A] dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm dark:text-gray-300">
                    {testimonial.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="dark:text-white">{testimonial.rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
            </div>
            <p className="text-left dark:text-gray-300">{testimonial.comment}</p>
          </div>
        ))}
      </div>

      {/* indicator + arrows */}
      <div className="flex items-center justify-between mt-10">
        {/* indicator */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`h-3 rounded-full transition-all duration-300 ${i === currentPage
                  ? "w-10 bg-[#F53838]"
                  : "w-3 bg-gray-200 dark:bg-gray-600"
                }`}
            ></span>
          ))}
        </div>

        {/* arrows */}
        <div className="flex gap-4">
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            className="w-12 h-12 flex items-center justify-center border border-[#F53838] rounded-full"
          >
            <span className="text-[#F53838]">←</span>
          </button>
          <button
            onClick={() => scrollToPage(currentPage + 1)}
            className="w-12 h-12 flex items-center justify-center bg-[#F53838] border border-[#F53838] rounded-full text-white"
          >
            →
          </button>
        </div>
      </div>
    </>
  )
}
